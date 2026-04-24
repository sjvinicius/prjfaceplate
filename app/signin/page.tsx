"use client"

import { SetUser } from "@/lib/repos/user"
import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
import Image from "next/image"

type CreateUserDTO = {
  nome: string
  realm: string[]
  email: string
  cpf: string
  dtnasc: string
  password: string
}

export default function SignIn() {
    const router = useRouter()

    const [nome, setNome] = useState("")
    const [email, setEmail] = useState("")
    const [cpf, setCpf] = useState("")
    const [dtnasc, setDtnasc] = useState("")
    const [password, setPassword] = useState("")
    const [confirmpassword, setConfirmPassword] = useState("")
    const [isloading, setLoading] = useState(false)

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleCreate()
        }
    }

    async function handleCreate() {
        setLoading(true)
        const toastId = toast.loading("Cadastrando usuário...")

        try {
            if (!nome.trim() || !email.trim() || !cpf.trim() || !dtnasc || !password.trim() || !confirmpassword.trim()) {
                throw new Error("Todos os campos são obrigatórios.")
            }

            if (nome.trim().split(" ").filter(Boolean).length < 2) {
                throw new Error("Nome completo inválido.")
            }

            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                throw new Error("Email inválido.")
            }

            const dtnascDate = new Date(dtnasc)
            const today = new Date()

            const minDate = new Date(today.getFullYear() - 120, today.getMonth(), today.getDate())
            const maxDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate())

            if (dtnascDate < minDate || dtnascDate > maxDate) {
                throw new Error("Idade deve ser entre 18 e 120 anos.")
            }

            const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/

            if (!passwordRegex.test(password)) {
                throw new Error("Senha deve ter 8+ caracteres, 1 maiúscula, 1 número e 1 símbolo.")
            }

            if (password !== confirmpassword) {
                throw new Error("As senhas não coincidem.")
            }

            const payload: CreateUserDTO = {
                nome,
                realm: ["morador"],
                email,
                cpf,
                dtnasc,
                password
            }

            const user = await SetUser(payload)

            if (!user || !("usuario_id" in user)) {
                throw new Error("Erro ao criar usuário.")
            }

            toast.success("Usuário criado com sucesso!", { id: toastId })

            // reset
            setNome("")
            setEmail("")
            setCpf("")
            setDtnasc("")
            setPassword("")
            setConfirmPassword("")

            router.replace("/login")

        } catch (err) {
            if (err instanceof Error) {
                toast.error(err.message, { id: toastId })
            } else {
                toast.error("Erro inesperado", { id: toastId })
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex flex-col items-center h-screen py-5 px-3">
            <div
                className="w-[50vw] my-auto flex flex-col h-[90vh] rounded-md px-[10vh] py-[3vh] justify-center items-center bg-[var(--background)]"
                style={{ filter: "drop-shadow(-6px 4px 6.8px rgba(0, 0, 0, 0.25))" }}
            >
                <div className="flex flex-col gap-1 w-full items-center">

                    <div className="flex flex-col text-center items-center mb-5">
                        <Image src="/logo.svg" alt="Logo" width={120} height={120} />
                        <p className="text-sm">
                            Tecnologia e proteção para sua casa, em um só lugar.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                        
                        <input
                            placeholder="Nome completo"
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                            onKeyDown={handleKeyDown}
                            className="input"
                        />

                        <input
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            onKeyDown={handleKeyDown}
                            className="input"
                        />

                        <input
                            placeholder="CPF"
                            value={cpf}
                            onChange={(e) => {
                                let value = e.target.value.replace(/\D/g, "")
                                if (value.length <= 11) {
                                    value = value
                                        .replace(/(\d{3})(\d)/, "$1.$2")
                                        .replace(/(\d{3})(\d)/, "$1.$2")
                                        .replace(/(\d{3})(\d{1,2})$/, "$1-$2")
                                }
                                setCpf(value)
                            }}
                            className="input"
                        />

                        <input
                            type="date"
                            value={dtnasc}
                            onChange={(e) => setDtnasc(e.target.value)}
                            className="input"
                        />

                        <input
                            type="password"
                            placeholder="Senha"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="input"
                        />

                        <input
                            type="password"
                            placeholder="Confirmar senha"
                            value={confirmpassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="input"
                        />
                    </div>

                    <button
                        onClick={handleCreate}
                        disabled={isloading}
                        className="mt-4 px-4 py-2 bg-[var(--primary)] text-white rounded disabled:opacity-50"
                    >
                        {isloading ? "Cadastrando..." : "Cadastrar"}
                    </button>
                </div>

                <p className="text-xs mt-auto">
                    Já tem uma conta? <Link href="/login">Acesse</Link>
                </p>
            </div>
        </div>
    )
}
