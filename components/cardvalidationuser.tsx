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
                toast.success("Usuário aprovado!")
            } catch (err: any) {
                toast.error("Erro ao aprovar usuário")
            }
        })
    }

    function handleReprovar(usuario_id: number | string) {
        startTransition(async () => {
            try {
                await reprovarusuario(Number(usuario_id))
                toast.success("Usuário reprovado!")
            } catch (err: any) {
                toast.error("Erro ao reprovar usuário")
            }
        })
    }

    return (
        <div className="flex flex-col h-full w-full mx-auto px-2 sm:px-4">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-6 rounded border border-[var(--primary)] py-4 px-4 sm:px-6">
                {/* Nome */}
                <div className="flex-2 w-full">
                    <label className="block w-full border-b-[3px] border-[var(--primary)] mb-1">
                        Nome
                    </label>
                    <h4 className="text-lg md:text-xl">{usuario.nome}</h4>
                </div>

                {/* Tipo */}
                <div className="flex-1 w-full">
                    <label className="block w-full border-b-[3px] border-[var(--primary)] mb-1">
                        Tipo
                    </label>
                    <h4 className="text-lg md:text-xl">{String(usuario.realm).replaceAll("[", "").replaceAll("]", "")}</h4>
                </div>

                {/* Data de Criação */}
                <div className="flex-2 w-full">
                    <label className="block w-full border-b-[3px] border-[var(--primary)] mb-1">
                        Data Criação
                    </label>
                    <h4 className="text-lg md:text-xl">
                        {usuario.criacao_data
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

                {/* Botões */}
                <div className="flex gap-2 w-full md:w-auto mt-2 md:mt-0">
                    <button
                        disabled={isPending}
                        onClick={() => startTransition(() => handleReprovar(String(usuario.usuario_id)))}
                        className="flex-1 md:flex-none px-4 py-2 rounded cursor-pointer bg-[var(--tertiary)] text-white hover:opacity-80 disabled:opacity-50"
                    >
                        {isPending ? "..." : "Reprovar"}
                    </button>

                    <button
                        disabled={isPending}
                        onClick={() => startTransition(() => handleAprovar(String(usuario.usuario_id)))}
                        className="flex-1 md:flex-none px-4 py-2 rounded cursor-pointer bg-green-600 text-white hover:opacity-80 disabled:opacity-50"
                    >
                        {isPending ? "..." : "Aprovar"}
                    </button>
                </div>
            </div>
        </div>
    )
}
