export interface Usuario {
    usuario_id?: number;
    nome: string;
    role: string;
    email: string;
    password: string;
    criacao_token?: string;
    criacao_data?: string;
    alteracao_token?: string;
    alteracao_data?: string;
    status?: string;
}

export interface DatabaseClient {
    GetUserByEmail(email: string): Promise<Partial<Usuario> | null>;
}