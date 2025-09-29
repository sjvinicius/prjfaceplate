import CardValidacaoUser from "@/components/cardvalidationuser"
import { GetPendingUsers } from "@/lib/repos/user"

export default async function ValidUser() {
    const usuarios = await GetPendingUsers()

    return (
        <div className="flex flex-col items-center min-h-screen">
            <div
                className="w-full pt-20 max-w-7xl my-auto flex flex-col h-full rounded-md py-6 bg-[var(--background)] gap-10 min-h-screen"
                style={{
                    filter: "drop-shadow(-6px 4px 6.8px rgba(0, 0, 0, 0.25))"
                }}
            >
                {/* Título */}
                <div className="py-3 px-6 text-2xl md:text-4xl rounded-r-lg border border-l-0 border-[var(--primary)] border-solid w-full md:w-[60%] lg:w-[40%]">
                    <h1 className="text-[var(--primary)]">Validação de Usuários</h1>
                </div>

                {/* Lista de usuários */}
                <div className="flex flex-col gap-4 h-full overflow-y-auto w-full max-w-6xl mx-auto px-2 sm:px-4">
                    {usuarios && usuarios.length > 0 ? (
                        usuarios.map((v) => (
                            <CardValidacaoUser key={v.usuario_id} usuario={v} />
                        ))
                    ) : (
                        <p className="mx-auto text-lg sm:text-xl md:text-2xl text-center px-4">
                            Nenhum usuário pendente de validação.
                        </p>
                    )}
                </div>
            </div>
        </div>
    )
}
