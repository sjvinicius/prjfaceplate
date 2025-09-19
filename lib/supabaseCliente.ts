// lib/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';
import { DatabaseClient, Usuario } from './database';
import { GetUserByEmail } from './repos/user';
import bcrypt from "bcryptjs"

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SERVICE_ROLE_KEY!,
    {
        db: {
            schema: "public"
        }
    }
);


export const supabaseDb: DatabaseClient = {

    GetUserByEmail: async (email: string): Promise<Usuario | null> => {

        if (!email) {

            throw new Error("Email não informado.");
        }

        const { data, error } = await supabase
            .from('usuario')
            .select('nome, email, phone, cpf, dtnasc, password, realm, status')
            .eq('email', email);

        if (error) throw new Error(error.message);

        const row = data[0];

        if (!row) return null;

        return {
            nome: String(row.nome),
            email: String(row.email),
            phone: String(row.phone),
            cpf: String(row.cpf),
            dtnasc: String(row.dtnasc),
            password: String(row.password),
            realm: String(row.realm),
            status: String(row.status),
        };
    },
    SetUser: async (user: Partial<Usuario>): Promise<Usuario | null> => {

        if (!user.nome || !user.email || !user.password || !user.cpf || !user.dtnasc) {

            throw new Error("Parâmetros insuficientes.");
        }

        if (user.nome.trim().split(" ").length <= 1) {

            throw new Error("Nome completo inválido.")
        }


        if (!user.email.trim().match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {

            throw new Error("Email inválido.");
        }

        const dtnascDate = new Date(user.dtnasc);

        const today = new Date();
        const minDate = new Date(today.getFullYear() - 120, today.getMonth(), today.getDate());
        const maxDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());

        if (dtnascDate < minDate || dtnascDate > maxDate) {
            throw new Error("Data de nascimento inválida (deve estar entre mínimo: 18 anos e máximo: 120 anos).");
        }

        const now = new Date().toISOString();
        const hashedPassword = await bcrypt.hash(user.password, 10);

        const { data, error } = await supabase
            .from("usuario")
            .upsert({
                nome: user.nome,
                realm: user.realm,
                email: user.email,
                phone: user.phone,
                dtnasc: user.dtnasc,
                cpf: user.cpf,
                password: hashedPassword,
                alteracao_token: "sistema",
                alteracao_data: now,
            })
            .select()
            .single();
            console.log(error)
        if (error) throw new Error("Houve um erro ao criar usuário.")

        return data;
    }
}