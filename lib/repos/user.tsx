"use server"
import { revalidatePath } from "next/cache";
import { Usuario } from "../database";
import { getDb } from "../db";

export async function GetUserByEmail(email: string): Promise<Partial<Usuario> | null> {

    const db = await getDb();
    const user = await db.GetUserByEmail(email)

    return user
}

export async function SetUser(user: Partial<Usuario>): Promise<Partial<Usuario> | null> {

    const db = await getDb();
    const usersetted = await db.SetUser(user)

    console.log(usersetted)
    return usersetted
}

export async function GetPendingUsers(): Promise<Partial<Usuario>[] | null> {

    const db = await getDb();
    const user = await db.GetPendingUsers()

    return user
}

export async function SetUpdateUser(veiculo: Partial<Usuario>) {
    const db = await getDb();
    const user = await db.SetUpdateUser(veiculo)

    return user
}

export async function aprovarusuario(usuario_id: number) {
    await SetUpdateUser({ usuario_id, status: "A" });
    revalidatePath("/validuser");
}

export async function reprovarusuario(usuario_id: number) {
    await SetUpdateUser({ usuario_id, status: "R" });
    revalidatePath("/validuser");
}