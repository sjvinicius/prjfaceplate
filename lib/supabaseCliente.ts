// lib/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';
import { DatabaseClient, LogUsuarioVeiculo, Usuario, Veiculo } from './database';
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
            .select('usuario_id, nome, email, phone, cpf, dtnasc, password, realm, status')
            .eq('email', email);

        if (error) throw new Error(error.message);

        const row = data[0];

        if (!row) return null;

        return {
            usuario_id: row.usuario_id,
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
        const dtnasciso = dtnascDate.toISOString().split("T")[0];

        const now = new Date().toISOString();
        const hashedPassword = await bcrypt.hash(user.password, 10);

        const { data, error } = await supabase
            .from("usuario")
            .upsert({
                nome: user.nome,
                realm: user.realm,
                email: user.email,
                phone: user.phone,
                dtnasc: dtnasciso,
                cpf: user.cpf,
                password: hashedPassword,
                alteracao_token: "sistema",
                alteracao_data: now,
            })
            .select()
            .single();

        if (error) throw new Error("Houve um erro ao criar usuário.")

        const { error: errorvalid } = await supabase
            .from("usuariovalidacao")
            .upsert({
                usuario_id: data.usuario_id,
                criacao_token: "sistema",
                criacao_data: now,
                alteracao_token: "sistema",
                alteracao_data: now,
            })

        if (errorvalid) throw new Error("Houve um erro ao inserir para validação.")

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
    GetPendingUsers: async (): Promise<Partial<Usuario>[] | null> => {
        const { data, error } = await supabase
            .from('usuario')
            .select(`
                usuario_id,
                nome,
                realm,
                email,
                dtnasc,
                phone,
                cpf,
                criacao_data
            `).eq('status', 'P')
            .order('criacao_data', { ascending: false });

        if (error) throw new Error(error.message);

        if (!data || data.length === 0) return null;

        // Mapeia os registros corretamente no formato do Veiculo
        return data.map((row: any) => ({
            usuario_id: row.usuario_id,
            nome: row.nome,
            realm: row.realm,
            email: row.email,
            dtnasc: row.dtnasc,
            phone: row.phone,
            cpf: row.cpf,
            criacao_data: row.criacao_data,
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
    },
    SetUpdateUser: async (usuario: Partial<Usuario>): Promise<Partial<Usuario> | null> => {

        if (!usuario.usuario_id) {

            throw new Error("Parâmetros insuficientes.")
        }

        const { ...updateFields } = usuario;

        if (Object.keys(updateFields).length === 0) {
            throw new Error("Nenhum campo enviado para atualização.");
        }

        if (!updateFields.alteracao_data) {
            updateFields.alteracao_data = new Date().toISOString();
        }

        updateFields.alteracao_data = new Date().toISOString();

        const { data, error } = await supabase
            .from("usuario")
            .update(updateFields)
            .eq("usuario_id", usuario.usuario_id)
            .select()
            .single();

        if (error) {
            throw new Error(error.message);
        }

        return data;
    },
    isValidVehicle: async (veiculo: Partial<Veiculo>): Promise<{ success: boolean }> => {

        if (!veiculo.placa) {

            throw new Error("Parâmetros insuficientes.");
        }

        const { data, error } = await supabase
            .from('usuarioveiculo')
            .select(`
                usuarioveiculo_id,
                placa,
                usuario:usuario_id (
                status
                )
            `)
            .eq('placa', veiculo.placa)
            .eq('status', 'A');

        if (error) throw new Error(error.message);

        const row = data.find(r => r.usuario?.some(u => u.status === 'A'));

        return { success: !!row };
    },
    SetLogVehicle: async (logusuarioveiculo: Partial<LogUsuarioVeiculo>): Promise<{ success: boolean }> => {

        if (!logusuarioveiculo.placa) {

            throw new Error("Parâmetros insuficientes.");
        }

        const { data, error } = await supabase
            .from('logusuarioveiculo')
            .insert(logusuarioveiculo)

        if (error) throw new Error(error.message);

        return { success: true }
    },
    SetVehicle: async (veiculo: Partial<Veiculo>): Promise<Partial<Veiculo> | { error: string }> => {

        const usuarioId =
            typeof veiculo.usuario_id === "object"
                ? veiculo.usuario_id?.usuario_id
                : veiculo.usuario_id;

        if (!usuarioId || !veiculo.marca || !veiculo.modelo || !veiculo.cor || !veiculo.placa) {
            throw new Error("Parâmetros insuficientes.");
        }

        const { data, error } = await supabase
            .from("usuarioveiculo")
            .insert({
                ...veiculo,
                usuario_id: Number(usuarioId), // força bigint
            })
            .select()
            .single();

        if (error) throw new Error(error.message);

        return data;
    },
    GetVehicles: async (usuario_id: string | number = ""): Promise<Partial<Veiculo>[] | null> => {
        let query = supabase
            .from("usuarioveiculo")
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
        `);

        if (usuario_id) {
            query = query.eq("usuario_id", usuario_id);
        } else {
            query = query.eq("status", "A");
        }

        const { data: veiculos, error } = await query;
        if (error) throw new Error(error.message);
        if (!veiculos || veiculos.length === 0) return null;

        // extrair placas para buscar só os logs que interessam
        const placas = veiculos.map(v => v.placa).filter(Boolean);

        const { data: logs, error: logsError } = await supabase
            .from("logusuarioveiculo")
            .select("placa, criacao_data")
            .in("placa", placas);

            console.log(placas)
        if (logsError) throw new Error(logsError.message);

        const logsByPlaca = new Map<string, any>();
        logs?.forEach(log => {
            if (!logsByPlaca.has(log.placa)) {
                logsByPlaca.set(log.placa, log);
            } else {
                const atual = logsByPlaca.get(log.placa);
                if (new Date(log.criacao_data) > new Date(atual.criacao_data)) {
                    logsByPlaca.set(log.placa, log);
                }
            }
        });

        return veiculos.map((row: any) => ({
            usuarioveiculo_id: row.usuarioveiculo_id,
            marca: row.marca,
            modelo: row.modelo,
            placa: row.placa,
            status: row.status,
            usuario_id: {
                usuario_id: row.usuario?.usuario_id,
                nome: row.usuario?.nome,
            },
            logusuarioveiculo_id: {
                criacao_data: logsByPlaca.get(row.placa)?.criacao_data || null,
            }
        }));

    },
}