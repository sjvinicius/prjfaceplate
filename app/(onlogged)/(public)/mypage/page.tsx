'use client'
import { useState } from "react"

export default function ValidUser() {

    const [isloading, SetIsLoading] = useState(false)

    return (
        <div className="flex flex-col items-center min-h-screen">
            <div className="w-full pt-20 max-w-7xl flex flex-col h-full rounded-md py-6 bg-[var(--background)] gap-10 min-h-screen">

                <div className="py-3 text-4xl rounded-r-lg border border-l-[0] border-[var(--primary)] border-solid ps-20 w-[40vw]">
                    <h1 className="text-[var(--primary)]">Minhas Informações</h1>
                </div>

                <div className="flex flex-col h-full overflow-y w-[90%] gap-25 px-4">

                    <div className="flex gap-3">
                        <div className="flex-[2] flex flex-col gap-1">
                            <label className="text-sm" htmlFor="nome">
                                Nome Completo
                            </label>
                            <input
                                id="nome"
                                type="text"
                                placeholder="Jhon Doe"
                                // value={nome}
                                // onChange={(e) => setNome(e.target.value)}
                                className="mb-3 text-sm px-4 py-2 border rounded w-full"
                                required={true}
                            // onKeyDown={handleKeyDown}
                            />
                        </div>
                        <div className="flex-[2] flex flex-col gap-1">
                            <label className="text-sm" htmlFor="email">
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                placeholder="example@example.com"
                                // value={email}
                                // onChange={(e) => setEmail(e.target.value)}
                                className="mb-3 text-sm px-4 py-2 border rounded w-full"
                                required={true}
                            // onKeyDown={handleKeyDown}
                            />
                        </div>
                        <div className="flex-1 flex flex-col gap-1">

                        </div>
                        <div className="flex-[2] flex flex-col gap-1">
                            <label className="text-sm" htmlFor="cpf">
                                CPF
                            </label>
                            <input
                                id="cpf"
                                type="text"
                                placeholder="999.999.999-99"
                                // value={cpf}
                                // onChange={async (e) => {
                                //     let value = e.target.value.replace(/\D/g, ''); // só números

                                //     if (value.length <= 11) {
                                //         // CPF: 000.000.000-00
                                //         value = value
                                //             .replace(/(\d{3})(\d)/, "$1.$2")
                                //             .replace(/(\d{3})(\d)/, "$1.$2")
                                //             .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
                                //     }

                                //     await setCpf(value);
                                // }}
                                maxLength={14}
                                className="mb-5 px-4 text-sm py-2 border rounded w-full"
                                required={true}
                            // onKeyDown={handleKeyDown}
                            />
                        </div>
                        <div className="flex-[2] flex flex-col gap-1">

                        </div>
                        <div className="flex-1 flex flex-col gap-1">
                            <label className="text-sm" htmlFor="dtnasc">
                                Data Nascimento
                            </label>
                            <input
                                id="dtnasc"
                                type="date"
                                // value={dtnasc}
                                // onChange={(e) => setDtnasc(e.target.value)}
                                className="mb-5 px-4 text-sm py-2 border rounded w-full"
                                required={true}
                                // onKeyDown={handleKeyDown}
                                min={new Date(new Date().setFullYear(new Date().getFullYear() - 120))
                                    .toISOString()
                                    .split('T')[0]}
                                max={new Date(new Date().setFullYear(new Date().getFullYear() - 18))
                                    .toISOString()
                                    .split('T')[0]}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}