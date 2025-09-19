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