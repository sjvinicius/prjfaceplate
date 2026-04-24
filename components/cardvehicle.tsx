'use client'

import { getLogVehicle } from "@/lib/repos/vehicle"
import { X } from "lucide-react"
import { useState, useTransition } from "react"
import toast from "react-hot-toast"
import Image from "next/image"

type VehicleLog = {
  status: "A" | "R" | string
  criacao_data: string
}

type Vehicle = {
  usuarioveiculo_id: number | string
  placa: string
  modelo?: string
  marca?: string
  status?: "A" | "R" | string
  logusuarioveiculo_id?: {
    criacao_data?: string
  }
}

export default function CardVehicle({ veiculo }: { veiculo: Vehicle }) {

    const [isPending, startTransition] = useTransition()
    const [showModal, setShowModal] = useState(false)
    const [logs, setLogs] = useState<VehicleLog[]>([])
    const [loadingLogs, setLoadingLogs] = useState(false)

    const handleOpenModal = () => {
        setShowModal(true)
        setLoadingLogs(true)
        setLogs([])

        startTransition(async () => {
            const toastId = toast.loading("Buscando histórico...")

            try {
                if (!veiculo.placa) {
                    throw new Error("Placa inválida.")
                }

                const reslogs = await getLogVehicle(veiculo.placa)

                if (reslogs?.length) {
                    setLogs(reslogs)
                }

            } catch (err) {
                if (err instanceof Error) {
                    toast.error(err.message)
                } else {
                    toast.error("Erro ao buscar logs")
                }
            } finally {
                setLoadingLogs(false)
                toast.dismiss(toastId)
            }
        })
    }

    return (
        <>
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-6 rounded border border-[var(--primary)] py-4 px-4 sm:px-6 md:px-10 mb-5">
                
                <div className={
                    veiculo.status === 'A'
                        ? "rounded-full bg-green-500 w-5 h-5"
                        : veiculo.status === 'R'
                            ? "rounded-full bg-red-500 w-5 h-5"
                            : "rounded-full bg-orange-500 w-5 h-5"
                } />

                <div className="flex-1 w-full flex justify-center md:justify-start">
                    <Image
                        src={`/${veiculo.marca?.toLowerCase() || "default"}.png`}
                        alt="logo do veículo"
                        width={80}
                        height={80}
                        className="object-contain"
                    />
                </div>

                <div className="flex-1 w-full">
                    <label className="block border-b-[3px] border-[var(--primary)] mb-1">Modelo</label>
                    <h4>{veiculo.modelo || "N/d"}</h4>
                </div>

                <div className="flex-1 w-full">
                    <label className="block border-b-[3px] border-[var(--primary)] mb-1">Placa</label>
                    <h4>
                        {veiculo.placa
                            ? veiculo.placa.slice(0, 3) + " " + veiculo.placa.slice(3)
                            : "N/d"}
                    </h4>
                </div>

                <div className="flex-1 w-full">
                    <label className="block border-b-[3px] border-[var(--primary)] mb-1">Último registro</label>
                    <h4>
                        {veiculo.logusuarioveiculo_id?.criacao_data
                            ? new Date(veiculo.logusuarioveiculo_id.criacao_data)
                                .toLocaleString("pt-BR")
                            : "N/d"}
                    </h4>
                </div>

                <button
                    disabled={isPending}
                    onClick={handleOpenModal}
                    className="px-4 py-2 rounded bg-[var(--primary)] text-white"
                >
                    Histórico
                </button>
            </div>

            {showModal && (
                <div className="fixed inset-0 flex justify-center items-center z-50">
                    
                    <div className="absolute inset-0 bg-black opacity-30" onClick={() => setShowModal(false)} />

                    <div className="relative bg-white rounded-lg p-6 w-[600px] max-h-[80vh]">
                        <div className="flex justify-between">
                            <h3>Histórico do veículo</h3>
                            <button onClick={() => setShowModal(false)}>
                                <X />
                            </button>
                        </div>

                        {loadingLogs ? (
                            <p>Carregando...</p>
                        ) : logs.length > 0 ? (
                            <ul className="overflow-y-auto max-h-[60vh]">
                                {logs.map((log, i) => (
                                    <li key={i} className="flex justify-between px-4 py-2">
                                        <div className={
                                            log.status === "A"
                                                ? "bg-green-500 w-3 h-3 rounded-full"
                                                : "bg-red-500 w-3 h-3 rounded-full"
                                        } />
                                        {new Date(log.criacao_data).toLocaleString("pt-BR")}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>Nenhum log encontrado.</p>
                        )}
                    </div>
                </div>
            )}
        </>
    )
}
