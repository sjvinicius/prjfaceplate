// lib/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';
import { DatabaseClient, Usuario } from './database';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
        db: {
            schema: "dbxoutlet"
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
            .select('nome, email, password, role, status')
            .eq('email', email);

        if (error) throw new Error(error.message);

        const row = data[0];

        if (!row) return null;

        return {
            nome: String(row.nome),
            email: String(row.email),
            password: String(row.password),
            role: String(row.role),
            status: String(row.status),
        };
    },
}