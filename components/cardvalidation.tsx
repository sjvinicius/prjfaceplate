"use client"

import { aprovarVeiculo, reprovarVeiculo } from "@/lib/repos/vehicle";
import { useTransition } from "react"
import toast from "react-hot-toast";

export default function CardValidacao({ veiculo }: { veiculo: any }) {
    const [isPending, startTransition] = useTransition()

    function handleAprovar(usuarioveiculo_id: number | string) {
        startTransition(async () => {
            try {
                await aprovarVeiculo(Number(usuarioveiculo_id))
                toast.success("Veículo aprovado!")
            } catch (err: any) {
                toast.error("Erro ao aprovar veículo")
            }
        })
    }

    function handleReprovar(usuarioveiculo_id: number | string) {
        startTransition(async () => {
            try {
                await reprovarVeiculo(Number(usuarioveiculo_id))
                toast.success("Veículo reprovado!")
            } catch (err: any) {
                toast.error("Erro ao reprovar veículo")
            }
        })
    }

    return (
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-6 rounded border border-[var(--primary)] py-4 px-4 sm:px-6 md:px-10">
            {/* Placa */}
            <div className="flex-1 w-full">
                <label className="block w-full border-b-[3px] border-[var(--primary)] mb-1">
                    Placa
                </label>
                <h4 className="text-lg md:text-xl">{veiculo.placa}</h4>
            </div>

            {/* Usuário Solicitante */}
            <div className="flex-1 w-full">
                <label className="block w-full border-b-[3px] border-[var(--primary)] mb-1">
                    Usuário Solicitante
                </label>
                <h4 className="text-lg md:text-xl">
                    {veiculo.usuario_id?.nome?.split(" ").slice(0, 3).join(" ")}
                </h4>
            </div>

            {/* Veículo */}
            <div className="flex-1 w-full">
                <label className="block w-full border-b-[3px] border-[var(--primary)] mb-1">
                    Veículo
                </label>
                <h4 className="text-lg md:text-xl">{veiculo.marca}/{veiculo.modelo}</h4>
            </div>

            {/* Botões */}
            <div className="flex gap-2 w-full md:w-auto mt-2 md:mt-0">
                <button
                    disabled={isPending}
                    onClick={() => startTransition(() => handleReprovar(veiculo.usuarioveiculo_id))}
                    className="flex-1 md:flex-none px-4 py-2 rounded cursor-pointer bg-[var(--tertiary)] text-white hover:opacity-80 disabled:opacity-50"
                >
                    {isPending ? "..." : "Reprovar"}
                </button>

                <button
                    disabled={isPending}
                    onClick={() => startTransition(() => handleAprovar(veiculo.usuarioveiculo_id))}
                    className="flex-1 md:flex-none px-4 py-2 rounded cursor-pointer bg-green-600 text-white hover:opacity-80 disabled:opacity-50"
                >
                    {isPending ? "..." : "Aprovar"}
                </button>
            </div>
        </div>
    )
}
