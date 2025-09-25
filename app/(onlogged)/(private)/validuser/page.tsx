'use client'
import { useState } from "react"

export default function ValidUser() {

    const [isloading, SetIsLoading] = useState(false)

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

                <div className="flex flex-col h-full overflow-y w-[90%] m-auto">
                    <div className="flex items-center justify-center gap-3 rounded border border-[var(--primary)] border-solid py-5 px-10">

                        <div className="flex-[2]">
                            <label
                                htmlFor="name"
                                className="block w-full border-b-[3px] border-[var(--primary)] border-solid"
                            >
                                Nome
                            </label>
                            <h4 className="text-xl">Vinícius S jesus</h4>
                        </div>

                        <div className="flex-1">
                            <label
                                htmlFor="name"
                                className="block w-full border-b-[3px] border-[var(--primary)] border-solid"
                            >
                                Tipo
                            </label>
                            <h4 className="text-xl">Morador</h4>
                        </div>

                        <div className="flex-1">
                            <label
                                htmlFor="name"
                                className="block w-full border-b-[3px] border-[var(--primary)] border-solid"
                            >
                                Data Criação
                            </label>
                            <h4 className="text-xl">23/09/2025 17:34</h4>
                        </div>

                        <div className="flex-none">
                            <button
                                disabled={isloading}
                                className="text-sm px-4 py-2 cursor-pointer text-center justify-center rounded bg-[var(--tertiary)] text-white hover:opacity-80 flex items-center gap-2 disabled:opacity-50"
                            >
                                Reprovar
                            </button>
                        </div>
                        <div className="flex-none">
                            <button
                                disabled={isloading}
                                className="text-sm px-4 py-2 cursor-pointer text-center justify-center rounded bg-green-600 text-white hover:opacity-80 flex items-center gap-2 disabled:opacity-50"
                            >
                                Aprovar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}