// import { getVeiculos } from "@/lib/db"

import CardValidacao from "@/components/cardvalidation"
import { GetPendingVehicle } from "@/lib/repos/vehicle"

export default async function ValidUser() {
    const veiculos = await GetPendingVehicle()

    return (
        <div className="flex flex-col items-center h-screen">
            <div className="w-[90vw] my-auto flex flex-col h-full rounded-md py-[3vh] bg-[var(--background)] gap-15">
                <div className="py-3 text-4xl ps-20 border border-l-0 border-[var(--primary)] rounded-r-lg w-[40vw]">
                    <h1 className="text-[var(--primary)]">Validação de Veículos</h1>
                </div>

                <div className="flex flex-col gap-4 h-full overflow-y w-[90%] m-auto">
                    {veiculos ? veiculos.map((v) => (
                        <CardValidacao key={v.usuarioveiculo_id} veiculo={v} />
                    )) : <p className="mx-auto text-2xl"> Nenhum veículo pendente de validação. Clique aqui para <a className="text-[var(--primary)] cursor-pointer hover:underline" href="vehicles">Cadastrar Veículo</a></p>}
                </div>
            </div>
        </div>
    )
}
