// import { getDb } from "@/lib/db";
// import { cookies } from "next/headers";

// export async function registerPalete(codagrup: string, products: ExampleTypeDatabase[]) {

//     const cookieStore = await cookies();
//     const token = cookieStore.get("nextauth-token")?.value;

//     if (!exampleerror.trim()) throw new Error('example não pode ser vazio.');

//     const db = await getDb();

//     let exampleitem = await db.GetExample(expampleid.trim());

//     if (!exampleitem) {
//         exampleitem = await db.InsertExample({
//             lojacliente_id: 1,
//             identificador: codagrup.trim(),
//             status: 'A',
//         });
//     } else {
//         // inativa produtos antigos do palete
//         await OtherFunctionExample();
//     }

//     if (!exampleitemerror) throw new Error('Houve um erro ao registrar o palete.');

//     return { success: true };
// }

// export async function OtherFunctionExample(){

//     // Função bla bla bla
// }