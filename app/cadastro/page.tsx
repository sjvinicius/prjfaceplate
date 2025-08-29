"use client"

import { LogIn } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Toaster } from "react-hot-toast";

export default function Cadastro() {


    const [nome, setNome] = useState('')
    const [cpf, setCpf] = useState('')
    const [dtnasc, setDtnasc] = useState('')
    const [isloading, setLoading] = useState(false);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            // handleLogin();
        }
    };

    return (
        <div className="flex flex-col items-center h-screen py-5 px-3">

            <div
                className="w-[60vh] my-auto flex flex-col h-[90vh] rounded-md px-[10vh] py-[3vh] justify-center items-center bg-[var(--background)]"
                style={{
                    filter: "drop-shadow(-6px 4px 6.8px rgba(0, 0, 0, 0.25))"
                }}
            >

                <div className="flex flex-col gap-1 w-full items-center">

                    <div className="flex flex-col text-center justify-center items-center mb-5">
                        <img src="/logo.svg" />
                        <p className="text-sm">Tecnologia e proteção para sua casa, em um só lugar.</p>
                    </div>
                    <div className="flex flex-col gap-1 w-full">
                        <label className="text-sm" htmlFor="nome">
                            Nome
                        </label>
                        <input
                            id="nome"
                            type="text"
                            placeholder="example@example.com"
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                            className="mb-3 text-sm px-4 py-2 border rounded w-full max-w-xs"
                            required={true}
                            onKeyDown={handleKeyDown}
                        />
                    </div>

                    <div className="flex flex-col gap-1 w-full">
                        <label className="text-sm" htmlFor="cpf">
                            CPF
                        </label>
                        <input
                            id="cpf"
                            type="text"
                            placeholder="********"
                            value={cpf}
                            onChange={(e) => setCpf(e.target.value)}
                            className="mb-5 px-4 text-sm py-2 border rounded w-full max-w-xs"
                            required={true}
                            onKeyDown={handleKeyDown}
                        />
                    </div>

                    <div className="flex flex-col gap-1 w-full">
                        <label className="text-sm" htmlFor="dtnasc">
                            Data Nascimento
                        </label>
                        <input
                            id="dtnasc"
                            type="datetime-local"
                            placeholder="********"
                            value={dtnasc}
                            onChange={(e) => setDtnasc(e.target.value)}
                            className="mb-5 px-4 text-sm py-2 border rounded w-full max-w-xs"
                            required={true}
                            onKeyDown={handleKeyDown}
                        />
                    </div>

                    <button
                        // onClick={handleLogin}
                        disabled={isloading}
                        className="text-sm w-30 px-4 py-2 cursor-pointer text-center justify-center rounded bg-gray-400 text-white hover:bg-gray-500 flex items-center gap-2 disabled:opacity-50"
                    >
                        {isloading ? 'Cadastrando...' : (
                            <>
                                Cadastrar
                                <LogIn size={18} />
                            </>
                        )}
                    </button>
                </div>
                <p className="text-xs" style={{ marginTop: "auto" }}>Já tem uma conta? <strong><Link href="/login">Acesse</Link></strong></p>
            </div>

            <Toaster />
        </div>
    )
}