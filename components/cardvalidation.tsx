"use client"

import { aprovarVeiculo, reprovarVeiculo, SetUpdateVehicle } from "@/lib/repos/vehicle";
import { useTransition } from "react"
import toast from "react-hot-toast";
// import { aprovarVeiculo, reprovarVeiculo } from "@/lib/actions"

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
        <div className="flex items-center justify-between gap-3 rounded border border-[var(--primary)] py-5 px-10">
            <div className="flex-1">
                <label className="block w-full border-b-[3px] border-[var(--primary)]">
                    Placa
                </label>
                <h4 className="text-xl">{veiculo.placa}</h4>
            </div>

            <div className="flex-[2]">
                <label className="block w-full border-b-[3px] border-[var(--primary)]">
                    Usuário Solicitante
                </label>
                <h4 className="text-xl">{veiculo.usuario_id?.nome
                    ?.split(" ")
                    .slice(0, 3)
                    .join(" ")}</h4>
            </div>

            <div className="flex-1">
                <label className="block w-full border-b-[3px] border-[var(--primary)]">
                    Veículo
                </label>
                <h4 className="text-xl">{veiculo.marca}/{veiculo.modelo}</h4>
            </div>

            <div className="flex gap-2">
                <button
                    disabled={isPending}
                    onClick={() => startTransition(() => handleReprovar(veiculo.usuarioveiculo_id))}
                    className="px-4 py-2 rounded cursor-pointer bg-[var(--tertiary)] text-white hover:opacity-80 disabled:opacity-50"
                >
                    {isPending ? "..." : "Reprovar"}
                </button>

                <button
                    disabled={isPending}
                    onClick={() => startTransition(() => handleAprovar(veiculo.usuarioveiculo_id))}
                    className="px-4 py-2 rounded cursor-pointer bg-green-600 text-white hover:opacity-80 disabled:opacity-50"
                >
                    {isPending ? "..." : "Aprovar"}
                </button>
            </div>
        </div>
    )
}
