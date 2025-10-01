'use client'

import { Veiculo } from "@/lib/database";
import { getLogVehicle } from "@/lib/repos/vehicle";
import { X } from "lucide-react";
import { useState, useTransition } from "react";
import toast from "react-hot-toast";

export default function CardVehicle({ veiculo }: { veiculo: Partial<Veiculo> }) {

    const [isPending, startTransition] = useTransition()
    const [showModal, setShowModal] = useState(false)
    const [logs, setLogs] = useState<any[]>([]);
    const [loadingLogs, setLoadingLogs] = useState(false);

    const handleOpenModal = () => {
        setShowModal(true);
        setLoadingLogs(true);
        setLogs([])

        // Buscar os logs somente ao abrir o modal
        startTransition(async () => {

            let toastId: string | null = null

            try {

                toastId = toast.loading("Checando credenciais...");

                if (!veiculo.placa) {
                    throw new Error("Placa inválida.")
                }

                const reslogs = await getLogVehicle(String(veiculo.placa))

                if (reslogs) {
                    setLogs(reslogs)
                }
            } catch (err: any) {
                toast.error(err.message, {
                    style: {
                        borderRadius: "10px",
                        background: "#333",
                        color: "#fff",
                    },
                    duration: 2000,
                });
            } finally {
                setLoadingLogs(false);
                if (toastId) {

                    toast.dismiss(toastId);
                }
            }
        });
    };

    return (
        <>
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
                        onClick={handleOpenModal}
                        className="flex-1 md:flex-none px-4 py-2 rounded cursor-pointer bg-[var(--primary)] text-white hover:opacity-80 disabled:opacity-50"
                    >
                        Histórico
                    </button>
                </div>
            </div>
            {showModal && (
                <div className="relative">
                    <div className="fixed inset-0 bg-black opacity-30 flex justify-center items-center z-50"
                        onClick={() => setShowModal(false)}>

                    </div>
                    <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-white rounded-lg shadow-lg p-6 w-[600px] max-h-[80vh]">
                        <div className="flex items-center justify-between px-5">

                            <h3 className="text-lg font-semibold mb-4">Histórico do veículo</h3>

                            <button
                                onClick={() => setShowModal(false)}
                                className="px-4 py-2 rounded text-black cursor-pointer"
                            >
                                <X className="text-black hover:text-red" />
                            </button>
                        </div>
                        {loadingLogs ? (
                            <p>Carregando...</p>
                        ) : logs.length > 0 ? (
                            <ul className="list-disc pl-5 space-y-2 overflow-y-auto max-h-[60vh]">
                                {logs.map((log, i) => (
                                    <li
                                        key={i}
                                        className={`
                                            flex items-center rounded justify-between px-5 py-1
                                            odd:bg-[rgba(66,146,237,0.2)] even:bg-white
                                            `}
                                    >
                                        <div
                                            className={
                                                log.status === "A"
                                                    ? "rounded-full bg-green-500 w-3 h-3"
                                                    : "rounded-full bg-red-500 w-3 h-3"
                                            }
                                        ></div>
                                        {new Date(log.criacao_data).toLocaleString("pt-BR")}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>Nenhum log encontrado.</p>
                        )}
                    </div>
                </div >
            )
            }
        </>
    )
}