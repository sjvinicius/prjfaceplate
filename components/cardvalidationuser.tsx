"use client"

import { Usuario } from "@/lib/database";
import { aprovarusuario, reprovarusuario } from "@/lib/repos/user";
import { useTransition } from "react"
import toast from "react-hot-toast";

export default function CardValidacaoUser({ usuario }: { usuario: Partial<Usuario> }) {
    const [isPending, startTransition] = useTransition()

    function handleAprovar(usuario_id: number | string) {
        startTransition(async () => {
            try {
                await aprovarusuario(Number(usuario_id))
                toast.success("Veículo aprovado!")
            } catch (err: any) {
                toast.error("Erro ao aprovar veículo")
            }
        })
    }

    function handleReprovar(usuario_id: number | string) {
        startTransition(async () => {
            try {
                await reprovarusuario(Number(usuario_id))
                toast.success("Veículo reprovado!")
            } catch (err: any) {
                toast.error("Erro ao reprovar veículo")
            }
        })
    }

    return (
        <div className="flex flex-col h-full overflow-y w-[90%] m-auto">
            <div className="flex items-center justify-center gap-3 rounded border border-[var(--primary)] border-solid py-5 px-10">

                <div className="flex-[2]">
                    <label
                        htmlFor="name"
                        className="block w-full border-b-[3px] border-[var(--primary)] border-solid"
                    >
                        Nome
                    </label>
                    <h4 className="text-xl">{usuario.nome}</h4>
                </div>

                <div className="flex-1">
                    <label
                        htmlFor="name"
                        className="block w-full border-b-[3px] border-[var(--primary)] border-solid"
                    >
                        Tipo
                    </label>
                    <h4 className="text-xl">{String(usuario.realm).replaceAll("[", "").replaceAll("]", "")}</h4>
                </div>

                <div className="flex-1">
                    <label
                        htmlFor="name"
                        className="block w-full border-b-[3px] border-[var(--primary)] border-solid"
                    >
                        Data Criação
                    </label>
                    <h4 className="text-xl">{usuario.criacao_data
                        ? new Date(usuario.criacao_data).toLocaleString("pt-BR", {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: false,
                        })
                        : "-"}
                    </h4>
                </div>

                <button
                    disabled={isPending}
                    onClick={() => startTransition(() => handleReprovar(String(usuario.usuario_id)))}
                    className="px-4 py-2 rounded cursor-pointer bg-[var(--tertiary)] text-white hover:opacity-80 disabled:opacity-50"
                >
                    {isPending ? "..." : "Reprovar"}
                </button>

                <button
                    disabled={isPending}
                    onClick={() => startTransition(() => handleAprovar(String(usuario.usuario_id)))}
                    className="px-4 py-2 rounded cursor-pointer bg-green-600 text-white hover:opacity-80 disabled:opacity-50"
                >
                    {isPending ? "..." : "Aprovar"}
                </button>
            </div>
        </div>
    )
}
