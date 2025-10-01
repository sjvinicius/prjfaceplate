import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from './lib/jwt/jwt';

interface Route {
    path: string;
    whenauth: string;
}

let routes: { morador: Route[]; gerente: Route[], admin: Route[] } = {
    morador: [
        {
            path: "/validuser",
            whenauth: "redirect"
        },
        {
            path: "/validvehicle",
            whenauth: "redirect"
        },
    ],
    gerente: [],
    admin: []
};

routes.admin = [...routes.gerente]

export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;
    const fallbackUrl = 'https://faceplate.vercel.app';

    const token = req.cookies.get('nextauthprjfaceplate-token')?.value;

    const redirectUrl = new URL('/login', req.url);
    // const redirectUrl = new URL('/?redirect=' + encodeURIComponent(pathname), req.url);

    redirectUrl.searchParams.set('redirect', pathname);

    const isApiRoute = pathname.startsWith('/api/');

    try {

        if (!token) {

            return isApiRoute
                ? NextResponse.json({ error: 'Requisição não autorizada.' }, { status: 401 })
                : (req.nextUrl.pathname == "/" || req.nextUrl.pathname == "/login" || req.nextUrl.pathname == "/signin" ? NextResponse.next() : NextResponse.redirect(redirectUrl));
        }

        const decoded = await verifyToken(token);

        if (!decoded) {
            return isApiRoute
                ? NextResponse.json({ error: 'Requisição não autorizada.' }, { status: 401 })
                : NextResponse.redirect(redirectUrl);
        }

        const { realm } = decoded as { realm: string }

        let redirect = "/vehicles"

        if (["admin", "gerente"].includes(realm)) {

            redirect = "/validvehicle"
        }

        if (realm?.includes("admin")) {

            if (pathname != "/") {

                return NextResponse.next();
            }

        }

        if (pathname == "/") {
            return NextResponse.redirect(new URL(redirect, req.url));
        }

        let realmArray: string[] = [];
        type realmKey = "morador" | "gerente" | "admin";
        type AliasKey = keyof typeof routes;
        const realm_alias: Record<realmKey, AliasKey> = {
            gerente: "gerente",
            morador: "morador",
            admin: "admin"
        };

        try {
            realmArray = JSON.parse(realm.replace(/'/g, '"'));
        } catch {
            realmArray = realm.replace(/^\[|\]$/g, "").split(",").map(r => r.trim());
        }

        let mainRole: realmKey = "morador"; // padrão
        if (realmArray.includes("admin")) mainRole = "admin";
        else if (realmArray.includes("gerente")) mainRole = "gerente";

        const alias: AliasKey = realm_alias[mainRole];

        const findroute = routes[alias].find(route => route.path === pathname && route.path == "redirect");

        if (findroute) {
            // return NextResponse.json({ error: "Acesso negado." }, { status: 403 });
            return NextResponse.redirect(new URL("/vehicles", req.url));
        }

        if (pathname.startsWith('/crud') && mainRole !== "admin") {
            return NextResponse.json({ error: "Acesso negado. Apenas admins podem criar usuários." }, { status: 403 });
        }

        if (pathname == "/") {
            let redirect = mainRole === "admin" ? "/validvehicle" : mainRole === "gerente" ? "/validvehicle" : "/vehicles";
            return NextResponse.redirect(new URL(redirect, req.url));
        }

        return NextResponse.next();
    } catch (err: any) {

        const message =
            err.name === 'TokenExpiredError'
                ? 'Token inválido.'
                : 'Token inválido.';

        return isApiRoute
            ? NextResponse.json({ error: message }, { status: 401 })
            : NextResponse.redirect(new URL(req.nextUrl.pathname != "/" ? '/?expired=true' : "/", req.url || fallbackUrl));
    }
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!/|api/auth|_next/static|_next/image|favicon.ico|logo.svg|leftbg.svg|rightbg.svg).*)',
    ],
};