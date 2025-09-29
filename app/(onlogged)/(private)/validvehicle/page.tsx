// import { getVeiculos } from "@/lib/db"

import CardValidacao from "@/components/cardvalidation"
import { GetPendingVehicle } from "@/lib/repos/vehicle"

export default async function ValidUser() {
    const veiculos = await GetPendingVehicle()

    return (
        <div className="flex flex-col items-center min-h-screen">
            <div className="w-full pt-20 max-w-7xl my-auto flex flex-col h-full rounded-md py-6 bg-[var(--background)] gap-10 min-h-screen" style={{ filter: "drop-shadow(rgba(0, 0, 0, 0.25) -6px 4px 6.8px)" }}>
                {/* Título */}
                <div className="py-3 px-6 text-2xl md:text-4xl border border-l-0 border-[var(--primary)] rounded-r-lg w-full md:w-[60%] lg:w-[40%]">
                    <h1 className="text-[var(--primary)]">Validação de Veículos</h1>
                </div>

                {/* Conteúdo */}
                <div className="flex flex-col gap-4 h-full overflow-y-auto w-full max-w-6xl mx-auto px-2 sm:px-4">
                    {veiculos && veiculos.length > 0 ? (
                        veiculos.map((v) => (
                            <CardValidacao key={v.usuarioveiculo_id} veiculo={v} />
                        ))
                    ) : (
                        <p className="mx-auto text-lg sm:text-xl md:text-2xl text-center px-4">
                            Nenhum veículo pendente de validação.{" "}
                            <a
                                className="text-[var(--primary)] cursor-pointer hover:underline"
                                href="vehicles"
                            >
                                Cadastrar Veículo
                            </a>
                        </p>
                    )}
                </div>
            </div>
        </div>
    )
}
