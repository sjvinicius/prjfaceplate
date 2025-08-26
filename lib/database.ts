export interface Usuario {
    usuario_id?: number;
    nome: string;
    role: string;
    email: string;
    password: string;
    criacao_data?: string;
    alteracao_data?: string;
    status?: string;
}

export interface DatabaseClient {

}