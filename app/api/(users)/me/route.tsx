import { verifyToken } from "@/lib/jwt/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const token = req.cookies.get("nextauthprjfaceplate-token")?.value;

    if (!token) {
        return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }

    const decoded = await verifyToken(token);

    if (!decoded) {
        return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }

    return NextResponse.json(decoded, { status: 200 });
}
