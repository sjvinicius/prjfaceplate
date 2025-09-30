'use client'

import { Veiculo } from "@/lib/database";
import { useTransition } from "react";

export default function CardVehicle({ veiculo }: { veiculo: Partial<Veiculo> }) {

    const [isPending, startTransition] = useTransition()

    return (
        <div key={veiculo.usuarioveiculo_id} className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-6 rounded border border-[var(--primary)] py-4 px-4 sm:px-6 md:px-10 mb-5">
            <div className={
                veiculo.status === 'A'
                    ? "rounded-full bg-green-500 w-5 h-5"
                    : veiculo.status === 'R'
                        ? "rounded-full bg-red-500 w-5 h-5"
                        : "rounded-full bg-orange-500 w-5 h-5"
            } />
            <div className="flex-1 w-full flex justify-center md:justify-start">
                <img
                    src={`/${veiculo.marca?.toLowerCase()}.png`}
                    alt="logo do veículo"
                    className="w-20 h-20 object-contain"
                />
            </div>

            <div className="flex-1 w-full">
                <label className="block w-full border-b-[3px] border-[var(--primary)] mb-1">Modelo</label>
                <h4 className="text-lg md:text-xl">{veiculo.modelo || "N/d"}</h4>
            </div>

            <div className="flex-1 w-full">
                <label className="block w-full border-b-[3px] border-[var(--primary)] mb-1">Placa</label>
                <h4 className="text-lg md:text-xl">{veiculo.placa ? veiculo.placa.substring(0, 3) + " " + veiculo.placa.substring(3) : "N/d"}</h4>
            </div>

            <div className="flex-1 w-full">
                <label className="block w-full border-b-[3px] border-[var(--primary)] mb-1">Último registro</label>
                <h4 className="text-lg md:text-xl">
                    {veiculo.logusuarioveiculo_id?.criacao_data
                        ? new Date(veiculo.logusuarioveiculo_id.criacao_data).toLocaleString("pt-BR", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                        })
                        : "N/d"}
                </h4>

            </div>

            <div className="flex gap-2 w-full md:w-auto mt-2 md:mt-0">
                <button
                    disabled={isPending}
                    className="flex-1 md:flex-none px-4 py-2 rounded cursor-pointer bg-[var(--primary)] text-white hover:opacity-80 disabled:opacity-50"
                >
                    Histórico
                </button>
            </div>
        </div>
    )
}