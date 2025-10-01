import { GetUserByEmail } from "@/lib/repos/user";
import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt/jwt";
import { isValidVehicle, setLogVehicle } from "@/lib/repos/vehicle";

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY as string;

export async function POST(req: NextRequest) {

    let token = req.cookies.get("nextauthprjfaceplate-token")?.value;

    if (!token) {
        // return NextResponse.json({ error: "Token não encontrado" }, { status: 401 });
        token = "apiisvalidvehicle" 
    }

    const { plate } = await req.json()

    if (!plate) {

        return NextResponse.json({ error: "Parâmetros insuficientes." }, { status: 400 });
    }

    const now = new Date().toISOString();
    const vehicle = await isValidVehicle({ placa: plate });

    if (!vehicle) {

        await setLogVehicle({
            placa: plate,
            criacao_token: token,
            criacao_data: now,
            status: "X"
        });

        return NextResponse.json({ error: "Não habilitado." }, { status: 404 })
    }

    await setLogVehicle({
        placa: plate,
        criacao_token: token,
        criacao_data: now,
        status: "A"
    });

    return NextResponse.json({ success: true }, { status: 200 });

}
