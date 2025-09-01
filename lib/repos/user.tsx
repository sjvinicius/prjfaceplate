import { Usuario } from "../database";
import { getDb } from "../db";

export async function GetUserByEmail(email: string): Promise<Partial<Usuario> | null> {

    const db = await getDb();
    const user = await db.GetUserByEmail(email)

    return user
}

// export async function SetUser(usuario: Partial<Usuario>): Promise<Partial<Usuario> | null> {

//     const db = await getDb();
    
//     const user = await db.setUsuario(usuario)

//     return user
// }