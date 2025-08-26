// import { SignJWT, jwtVerify, JWTPayload } from 'jose';

// const JWT_SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET_KEY!);

// export interface JwtPayload extends JWTPayload {
//     email: string;
//     role: string | string[];
//     nome: string;
//     lojacliente_id: string | number;
// }

// export async function generateToken(payload: JwtPayload): Promise<string> {
//     return await new SignJWT(payload)
//         .setProtectedHeader({ alg: 'HS256' })
//         .setExpirationTime('60m')
//         .sign(JWT_SECRET_KEY);
// }

// export async function verifyToken(token: string): Promise<JwtPayload | null> {
//     try {
//         const { payload } = await jwtVerify(token, JWT_SECRET_KEY);
//         return payload as JwtPayload;
//     } catch {
//         return null;
//     }
// }
