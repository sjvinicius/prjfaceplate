import CardValidacaoUser from "@/components/cardvalidationuser"
import { GetPendingUsers } from "@/lib/repos/user"

export default async function ValidUser() {

    const usuarios = await GetPendingUsers()

    return (
        <div className="flex flex-col items-center h-screen">

            <div
                className="w-[90vw] my-auto flex flex-col h-full rounded-md py-[3vh] bg-[var(--background)] gap-15"
                style={{
                    filter: "drop-shadow(-6px 4px 6.8px rgba(0, 0, 0, 0.25))"
                }}
            >
                <div className="py-3 text-4xl rounded-r-lg border border-l-[0] border-[var(--primary)] border-solid ps-20 w-[40vw]">
                    <h1 className="text-[var(--primary)]">Validação de Usuários</h1>
                </div>

                <div className="flex flex-col gap-4 h-full overflow-y w-[90%] m-auto">
                    {usuarios ? usuarios.map((v) => (
                        <CardValidacaoUser key={v.usuario_id} usuario={v} />
                    )) : <p className="mx-auto text-2xl"> Nenhum usuário pendente de validação.</p>}
                </div>
            </div>
        </div>
    )
}
