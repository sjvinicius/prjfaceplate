import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from './lib/jwt/jwt';

interface Route {
  path: string;
  whenauth: string;
}

type Role = "morador" | "gerente" | "admin";

const routes: Record<Role, Route[]> = {
  morador: [
    { path: "/validuser", whenauth: "redirect" },
    { path: "/validvehicle", whenauth: "redirect" },
  ],
  gerente: [],
  admin: [],
};

function parseRealm(realm: string): string[] {
  try {
    return JSON.parse(realm.replace(/'/g, '"'));
  } catch {
    return realm
      .replace(/^\[|\]$/g, "")
      .split(",")
      .map(r => r.trim());
  }
}

function getMainRole(realms: string[]): Role {
  if (realms.includes("admin")) return "admin";
  if (realms.includes("gerente")) return "gerente";
  return "morador";
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isApiRoute = pathname.startsWith('/api/');
  const token = req.cookies.get('nextauthprjfaceplate-token')?.value;
  const apiKey = req.headers.get("x-api-key");

  const isOrangePi =
    apiKey && apiKey === process.env.ORANGE_PI_SECRET;

  if (isOrangePi) {
    return NextResponse.next();
  }

  const redirectUrl = new URL('/login', req.url);
  redirectUrl.searchParams.set('redirect', pathname);

  try {
    // 🔒 Sem token
    if (!token) {
      if (isApiRoute) {
        return NextResponse.json({ error: 'Requisição não autorizada.' }, { status: 401 });
      }

      if (["/", "/login", "/signin"].includes(pathname)) {
        return NextResponse.next();
      }

      return NextResponse.redirect(redirectUrl);
    }

    // 🔍 Verifica token
    const decoded = await verifyToken(token);

    if (!decoded) {
      return isApiRoute
        ? NextResponse.json({ error: 'Requisição não autorizada.' }, { status: 401 })
        : NextResponse.redirect(redirectUrl);
    }

    const { realm } = decoded as { realm: string };

    const realmArray = parseRealm(realm);
    const mainRole = getMainRole(realmArray);

    const defaultRedirect =
      mainRole === "admin" || mainRole === "gerente"
        ? "/validvehicle"
        : "/vehicles";

    // 🔁 Login já autenticado
    if (["/login", "/signin"].includes(pathname)) {
      return NextResponse.redirect(new URL(defaultRedirect, req.url));
    }

    // 🏠 Root
    if (pathname === "/") {
      return NextResponse.redirect(new URL(defaultRedirect, req.url));
    }

    // 🔐 Rotas bloqueadas por role
    const blockedRoute = routes[mainRole].find(
      route => route.path === pathname && route.whenauth === "redirect"
    );

    if (blockedRoute) {
      return NextResponse.redirect(new URL("/vehicles", req.url));
    }

    // 🔒 CRUD só admin
    if (pathname.startsWith('/crud') && mainRole !== "admin") {
      return NextResponse.json(
        { error: "Acesso negado. Apenas admins podem criar usuários." },
        { status: 403 }
      );
    }

    return NextResponse.next();
  } catch (err: any) {
    const message =
      err.name === 'TokenExpiredError'
        ? 'Token expirado.'
        : 'Token inválido.';

    return isApiRoute
      ? NextResponse.json({ error: message }, { status: 401 })
      : NextResponse.redirect(
        new URL(
          req.nextUrl.pathname !== "/" ? '/?expired=true' : "/",
          req.url
        )
      );
  }
}

export const config = {
  matcher: [
    '/((?!api/auth|_next/static|_next/image|favicon.ico|logo.svg|leftbg.svg|rightbg.svg).*)',
  ],
};