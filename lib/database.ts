export interface Usuario {
    usuario_id?: number | string;
    nome: string;
    realm: string;
    email: string;
    dtnasc: string;
    phone: string;
    cpf: string;
    password: string;
    criacao_token?: string;
    criacao_data?: string;
    alteracao_token?: string;
    alteracao_data?: string;
    status?: string;
}

export interface Veiculo {
    usuarioveiculo_id?: number;
    usuario_id: Partial<Usuario>;
    marca: string;
    modelo: string;
    cor: string;
    placa: string;
    criacao_token?: string;
    criacao_data?: string;
    alteracao_token?: string;
    alteracao_data?: string;
    status?: string;
}

export interface LogUsuarioVeiculo {
    logusuarioveiculo_id: number;
    placa: string | number;
    usuario_id: Partial<Usuario>;
    criacao_token?: string;
    criacao_data?: string;
    alteracao_token?: string;
    alteracao_data?: string;
    status?: string;
}

export interface DatabaseClient {
    GetUserByEmail(email: string): Promise<Partial<Usuario> | null>;
    SetUser(user: Partial<Usuario>): Promise<Partial<Usuario> | null>;
    GetPendingVehicle(): Promise<Partial<Veiculo>[] | null>;
    GetPendingUsers(): Promise<Partial<Usuario>[] | null>;
    SetUpdateVehicle(veiculo: Partial<Veiculo>): Promise<Partial<Veiculo> | null>;
    SetUpdateUser(usuario: Partial<Usuario>): Promise<Partial<Usuario> | null>;
    isValidVehicle(veiculo: Partial<Veiculo>): Promise<{ success: boolean }>;
    SetLogVehicle(logusuarioveiculo: Partial<LogUsuarioVeiculo>): Promise<{ success: boolean }>;
    SetVehicle(veiculo: Partial<Veiculo>): Promise<Partial<Veiculo> | { error: string }>;
    GetVehicles(usuario_id: string | number): Promise<Partial<Veiculo>[] | null>;

}