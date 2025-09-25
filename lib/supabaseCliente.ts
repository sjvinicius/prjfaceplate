// lib/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';
import { DatabaseClient, Usuario, Veiculo } from './database';
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

        if (error) throw new Error("Houve um erro ao criar usuário.")

        return data;
    },
    GetPendingVehicle: async (): Promise<Partial<Veiculo>[] | null> => {
        const { data, error } = await supabase
            .from('usuarioveiculo')
            .select(`
                usuarioveiculo_id,
                marca,
                modelo,
                placa,
                status,
                usuario:usuario_id (
                    usuario_id,
                    nome,
                    realm,
                    email,
                    dtnasc,
                    phone,
                    cpf
                )
            `).eq('status', 'P')
            .order('criacao_data', { ascending: false });

        if (error) throw new Error(error.message);

        if (!data || data.length === 0) return null;

        // Mapeia os registros corretamente no formato do Veiculo
        return data.map((row: any) => ({
            usuarioveiculo_id: row.usuarioveiculo_id,
            marca: row.marca,
            modelo: row.modelo,
            placa: row.placa,
            status: row.status,
            usuario_id: {
                usuario_id: row.usuario?.usuario_id,
                nome: row.usuario?.nome,
                realm: row.usuario?.realm,
                email: row.usuario?.email,
                dtnasc: row.usuario?.dtnasc,
                phone: row.usuario?.phone,
                cpf: row.usuario?.cpf,
            }
        }));
    },
    SetUpdateVehicle: async (veiculo: Partial<Veiculo>): Promise<Partial<Veiculo> | null> => {

        if (!veiculo.usuarioveiculo_id) {

            throw new Error("Parâmetros insuficientes.")
        }

        const { ...updateFields } = veiculo;

        if (Object.keys(updateFields).length === 0) {
            throw new Error("Nenhum campo enviado para atualização.");
        }

        if (!updateFields.alteracao_data) {
            updateFields.alteracao_data = new Date().toISOString();
        }

        updateFields.alteracao_data = new Date().toISOString();

        const { data, error } = await supabase
            .from("usuarioveiculo")
            .update(updateFields)
            .eq("usuarioveiculo_id", veiculo.usuarioveiculo_id)
            .select()
            .single();

        if (error) {
            throw new Error(error.message);
        }

        return data;
    }


}