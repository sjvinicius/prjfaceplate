"use client"

import { SetUser } from "@/lib/repos/user"
import { addEnrollmentQueue } from "@/lib/repos/enrollmentqueue"

import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
import Image from "next/image"
import { UploadedFaceImage, uploadFaceImages } from "@/lib/storage/faces"

type CreateUserDTO = {
    nome: string
    realm: string[]
    email: string
    cpf: string
    dtnasc: string
    password: string
}

type FaceImage = {
    file: File | null
    preview: string | null
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

    const [faceImages, setFaceImages] = useState<FaceImage[]>(
        Array.from({ length: 5 }, () => ({
            file: null,
            preview: null
        }))
    )

    const imageLabels = [
        "Rosto frontal neutro",
        "Rosto com leve sorriso",
        "Leve rotação para esquerda",
        "Leve rotação para direita",
        "Inclinação leve (cima ou baixo)"
    ]

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleCreate()
        }
    }

    async function handleCreate() {
        setLoading(true)
        const toastId = toast.loading("Criando usuário...")

        try {
            // -------------------------
            // validações básicas
            // -------------------------
            if (
                !nome.trim() ||
                !email.trim() ||
                !cpf.trim() ||
                !dtnasc ||
                !password.trim() ||
                !confirmpassword.trim()
            ) {
                throw new Error("Todos os campos são obrigatórios.")
            }

            if (nome.trim().split(" ").filter(Boolean).length < 2) {
                throw new Error("Nome completo inválido.")
            }

            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                throw new Error("Email inválido.")
            }

            if (faceImages.some(img => !img.file)) {
                throw new Error("Envie todas as 5 fotos obrigatórias.")
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
                throw new Error("Senha forte: 8+ chars, 1 maiúscula, 1 número, 1 símbolo.")
            }

            if (password !== confirmpassword) {
                throw new Error("As senhas não coincidem.")
            }

            // -------------------------
            // cria usuário
            // -------------------------
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

            // -------------------------
            // upload imagens
            // -------------------------
            const files = faceImages
                .map(i => i.file)
                .filter(Boolean) as File[]

            if (user.usuario_id) {

                const uploaded = await uploadFaceImages(
                    user.usuario_id,
                    files
                )

                // -------------------------
                // fila do worker Python
                // -------------------------
                await Promise.all(
                    uploaded.map((img: UploadedFaceImage) =>
                        addEnrollmentQueue({
                            usuario_id: Number(user.usuario_id),
                            image_url: img.url,
                            storage_path: img.path,
                            label: img.label
                        })
                    )
                )
            }

            toast.success("Usuário criado com sucesso!", { id: toastId })

            // -------------------------
            // reset completo
            // -------------------------
            setNome("")
            setEmail("")
            setCpf("")
            setDtnasc("")
            setPassword("")
            setConfirmPassword("")

            setFaceImages(
                Array.from({ length: 5 }, () => ({
                    file: null,
                    preview: null
                }))
            )

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
        <div className="flex flex-col items-center min-h-screen py-6 px-3">
            <div
                className="w-[50vw] my-auto flex flex-col min-h-[90vh] rounded-md px-[6vh] py-[4vh] bg-[var(--background)]"
                style={{ filter: "drop-shadow(-6px 4px 6.8px rgba(0, 0, 0, 0.25))" }}
            >
                {/* HEADER */}
                <div className="flex flex-col items-center text-center mb-6">
                    <Image src="/logo.svg" alt="Logo" width={110} height={110} />
                    <p className="text-sm text-gray-600">
                        Tecnologia e proteção para sua casa, em um só lugar.
                    </p>
                </div>

                {/* FORM */}
                <div className="space-y-6 w-full">

                    {/* DADOS */}
                    <section className="space-y-4">
                        <h2 className="text-sm font-semibold">Dados pessoais</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input
                                placeholder="Nome completo"
                                value={nome}
                                onChange={(e) => setNome(e.target.value)}
                                onKeyDown={handleKeyDown}
                                className="input border rounded px-3 py-2"
                            />

                            <input
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="input border rounded px-3 py-2"
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
                                maxLength={14}
                                className="input border rounded px-3 py-2"
                            />

                            <input
                                type="date"
                                value={dtnasc}
                                onChange={(e) => setDtnasc(e.target.value)}
                                className="input border rounded px-3 py-2"
                            />

                            <input
                                type="password"
                                placeholder="Senha"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="input border rounded px-3 py-2"
                            />

                            <input
                                type="password"
                                placeholder="Confirmar senha"
                                value={confirmpassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="input border rounded px-3 py-2"
                            />
                        </div>
                    </section>

                    {/* INSTRUÇÕES */}
                    <section className="bg-gray-50 border rounded-lg p-4 text-xs text-gray-600 space-y-1">
                        <p className="font-semibold text-gray-800">
                            Instruções para reconhecimento facial
                        </p>
                        <p>📸 Envie 5 fotos em diferentes ângulos</p>
                        <p>💡 Use boa iluminação (preferência luz natural)</p>
                        <p>🚫 Evite filtros, bonés e máscaras</p>
                        <p>👓 Se usa óculos: inclua fotos com e sem</p>
                    </section>

                    {/* UPLOAD FOTOS */}
                    <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {imageLabels.map((label, index) => {
                            const img = faceImages[index]

                            return (
                                <label
                                    key={index}
                                    className="border-2 border-dashed rounded-lg p-3 cursor-pointer min-h-[180px] flex flex-col items-center justify-center transition hover:border-[var(--primary)] hover:bg-gray-50"
                                >
                                    <input
                                        type="file"
                                        accept="image/*"
                                        hidden
                                        onChange={(e) => {
                                            const file = e.target.files?.[0]
                                            if (!file) return

                                            const preview = URL.createObjectURL(file)

                                            const updated = [...faceImages]
                                            updated[index] = { file, preview }
                                            setFaceImages(updated)
                                        }}
                                    />

                                    {img?.preview ? (
                                        <img
                                            src={img.preview}
                                            className="w-full h-[160px] object-cover rounded-md"
                                        />
                                    ) : (
                                        <p className="text-sm text-gray-500 text-center">
                                            {label}
                                        </p>
                                    )}
                                </label>
                            )
                        })}
                    </section>

                    {/* BOTÃO */}
                    <button
                        onClick={handleCreate}
                        disabled={isloading}
                        className="w-full mt-2 px-4 py-2 bg-[var(--primary)] text-white rounded disabled:opacity-50"
                    >
                        {isloading ? "Processando..." : "Cadastrar"}
                    </button>
                </div>

                {/* FOOTER */}
                <p className="text-xs mt-auto text-center pt-6">
                    Já tem uma conta? <Link href="/login">Acesse</Link>
                </p>
            </div>
        </div>
    )
}