import { GetUserByEmail } from "@/lib/repos/user";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs"
import { generateToken } from "@/lib/jwt/jwt";


export async function POST(req: NextRequest) {

    const { email, pwd } = await req.json()

    if (!email || !pwd) {

        return NextResponse.json({ error: "Parâmetros insuficientes." }, { status: 400 });
    }

    const user = await GetUserByEmail(email)

    if (!user?.usuario_id) {

        return NextResponse.json({ error: "Credenciais incorretas." }, { status: 404 })
    }

    if (user.status != 'A') {

        return NextResponse.json({ error: "Usuário inativo, entre em contato com o suporte." }, { status: 404 })
    }

    if (!await bcrypt.compare(pwd, String(user.password))) {

        return NextResponse.json({ error: "Credenciais incorretas." }, { status: 404 })
    }

    const token = await generateToken({ email: String(user.email), realm: String(user.realm), nome: String(user.nome), usuario_id: user.usuario_id, lojacliente_id: 1 });

    const response = NextResponse.json({ user: { token, email: String(user.email), realm: String(user.realm), nome: String(user.nome) } }, { status: 200 });
    const isProduction = process.env.NODE_ENV === "production";

    response.cookies.set('nextauthprjfaceplate-token', token, {
        httpOnly: true,
        secure: isProduction,
        sameSite: 'strict',
        path: '/',
        maxAge: 60 * 60 * 4, // 4 horas
    });

    return response;
}