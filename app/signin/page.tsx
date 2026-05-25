"use client"

import { SetUser } from "@/lib/repos/user"
import { addEnrollmentQueue } from "@/lib/repos/enrollmentqueue"

import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
import Image from "next/image"
import { UploadedFaceImage, uploadFaceImages } from "@/lib/storage/faces"

// imports adicionais
import {
    CheckCircle2,
    Circle,
    ImagePlus,
    ShieldCheck
} from "lucide-react"

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

    const passwordChecks = [
        {
            label: "Mínimo de 8 caracteres",
            valid: password.length >= 8
        },
        {
            label: "Uma letra maiúscula",
            valid: /[A-Z]/.test(password)
        },
        {
            label: "Um número",
            valid: /\d/.test(password)
        },
        {
            label: "Um caractere especial",
            valid: /[\W_]/.test(password)
        },
        {
            label: "As senhas coincidem",
            valid:
                password.length > 0 &&
                password === confirmpassword
        }
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
                            criacao_token: "cadastro",
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
        <div className="min-h-screen flex items-center justify-center px-4 py-8">

            <div
                className="w-[80vw] max-w-7xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100"
            >

                {/* HEADER */}
                <div className="px-8 py-10">

                    <div className="flex flex-col items-center text-center gap-3">

                        <div className="bg-white/15 p-4 rounded-2xl backdrop-blur">
                            <Image
                                src="/logo.svg"
                                alt="Logo"
                                width={120}
                                height={120}
                            />
                        </div>

                        <div>
                            <h1 className="text-3xl font-bold">
                                Criar Conta
                            </h1>

                            <p className="text-sm mt-1">
                                Segurança inteligente com reconhecimento facial
                            </p>
                        </div>
                    </div>
                </div>

                <div className="p-8 lg:p-10 space-y-8">

                    {/* DADOS */}
                    <section className="space-y-5">

                        <div className="flex items-center gap-2">
                            <ShieldCheck
                                size={20}
                                className="text-[var(--primary)]"
                            />

                            <h2 className="text-lg font-semibold text-gray-800">
                                Dados pessoais
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                            <input
                                placeholder="Nome completo"
                                value={nome}
                                onChange={(e) => setNome(e.target.value)}
                                onKeyDown={handleKeyDown}
                                className="h-12 rounded-xl border border-gray-300 px-4 outline-none focus:border-[var(--primary)] focus:ring-4 focus:ring-blue-100 transition"
                            />

                            <input
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="h-12 rounded-xl border border-gray-300 px-4 outline-none focus:border-[var(--primary)] focus:ring-4 focus:ring-blue-100 transition"
                            />

                            <input
                                placeholder="CPF"
                                value={cpf}
                                onChange={(e) => {

                                    let value =
                                        e.target.value.replace(/\D/g, "")

                                    if (value.length <= 11) {

                                        value = value
                                            .replace(/(\d{3})(\d)/, "$1.$2")
                                            .replace(/(\d{3})(\d)/, "$1.$2")
                                            .replace(/(\d{3})(\d{1,2})$/, "$1-$2")
                                    }

                                    setCpf(value)
                                }}
                                maxLength={14}
                                className="h-12 rounded-xl border border-gray-300 px-4 outline-none focus:border-[var(--primary)] focus:ring-4 focus:ring-blue-100 transition"
                            />

                            <input
                                type="date"
                                value={dtnasc}
                                onChange={(e) => setDtnasc(e.target.value)}
                                className="h-12 rounded-xl border border-gray-300 px-4 outline-none focus:border-[var(--primary)] focus:ring-4 focus:ring-blue-100 transition"
                            />

                            <div className="space-y-3">

                                <input
                                    type="password"
                                    placeholder="Senha"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full h-12 rounded-xl border border-gray-300 px-4 outline-none focus:border-[var(--primary)] focus:ring-4 focus:ring-blue-100 transition"
                                />

                                {/* CHECKLIST */}
                                <div className="bg-gray-50 space-y-2">

                                    {
                                        passwordChecks.map((item, index) => (

                                            <div
                                                key={index}
                                                className={`flex items-center gap-2 text-sm transition ${item.valid
                                                    ? "text-green-600"
                                                    : "text-gray-500"
                                                    }`}
                                            >

                                                {
                                                    item.valid ? (
                                                        <CheckCircle2 size={16} />
                                                    ) : (
                                                        <Circle size={16} />
                                                    )
                                                }

                                                <span>
                                                    {item.label}
                                                </span>
                                            </div>
                                        ))
                                    }
                                </div>
                            </div>

                            <input
                                type="password"
                                placeholder="Confirmar senha"
                                value={confirmpassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="h-12 rounded-xl border border-gray-300 px-4 outline-none focus:border-[var(--primary)] focus:ring-4 focus:ring-blue-100 transition"
                            />
                        </div>
                    </section>

                    {/* INSTRUÇÕES */}
                    <section className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-5">

                        <div className="flex items-center gap-2 mb-3">
                            <ImagePlus
                                size={18}
                                className="text-[var(--primary)]"
                            />

                            <p className="font-semibold text-gray-800">
                                Instruções para reconhecimento facial
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-2 text-sm text-gray-700">

                            <p>📸 Envie 5 fotos em diferentes ângulos</p>
                            <p>💡 Utilize boa iluminação</p>
                            <p>🚫 Evite bonés, filtros e máscaras</p>
                            <p>👓 Inclua fotos com e sem óculos</p>
                        </div>
                    </section>

                    {/* FOTOS */}
                    <section className="space-y-5">

                        <h2 className="text-lg font-semibold text-gray-800">
                            Fotos faciais
                        </h2>

                        {/* PRIMEIRA LINHA */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

                            {imageLabels.slice(0, 3).map((label, index) => {

                                const img = faceImages[index]

                                return (
                                    <label
                                        key={index}
                                        className="group border-2 border-dashed border-gray-300 rounded-2xl p-3 cursor-pointer h-[240px] flex flex-col items-center justify-center transition hover:border-[var(--primary)] hover:bg-blue-50"
                                    >

                                        <input
                                            type="file"
                                            accept="image/*"
                                            hidden
                                            onChange={(e) => {

                                                const file =
                                                    e.target.files?.[0]

                                                if (!file) return

                                                const preview =
                                                    URL.createObjectURL(file)

                                                const updated =
                                                    [...faceImages]

                                                updated[index] = {
                                                    file,
                                                    preview
                                                }

                                                setFaceImages(updated)
                                            }}
                                        />

                                        {
                                            img?.preview ? (

                                                <img
                                                    src={img.preview}
                                                    className="w-full h-full rounded-xl object-cover"
                                                />

                                            ) : (

                                                <div className="flex flex-col items-center text-center text-gray-500">

                                                    <ImagePlus
                                                        size={34}
                                                        className="mb-3 group-hover:scale-110 transition"
                                                    />

                                                    <span className="text-sm font-medium">
                                                        {label}
                                                    </span>
                                                </div>
                                            )
                                        }
                                    </label>
                                )
                            })}
                        </div>

                        {/* SEGUNDA LINHA CENTRALIZADA */}
                        <div className="flex justify-center gap-5 flex-wrap">

                            {imageLabels.slice(3, 5).map((label, idx) => {

                                const index = idx + 3

                                const img =
                                    faceImages[index]

                                return (
                                    <label
                                        key={index}
                                        className="group w-full md:w-[31%] border-2 border-dashed border-gray-300 rounded-2xl p-3 cursor-pointer h-[240px] flex flex-col items-center justify-center transition hover:border-[var(--primary)] hover:bg-blue-50"
                                    >

                                        <input
                                            type="file"
                                            accept="image/*"
                                            hidden
                                            onChange={(e) => {

                                                const file =
                                                    e.target.files?.[0]

                                                if (!file) return

                                                const preview =
                                                    URL.createObjectURL(file)

                                                const updated =
                                                    [...faceImages]

                                                updated[index] = {
                                                    file,
                                                    preview
                                                }

                                                setFaceImages(updated)
                                            }}
                                        />

                                        {
                                            img?.preview ? (

                                                <img
                                                    src={img.preview}
                                                    className="w-full h-full rounded-xl object-cover"
                                                />

                                            ) : (

                                                <div className="flex flex-col items-center text-center text-gray-500">

                                                    <ImagePlus
                                                        size={34}
                                                        className="mb-3 group-hover:scale-110 transition"
                                                    />

                                                    <span className="text-sm font-medium">
                                                        {label}
                                                    </span>
                                                </div>
                                            )
                                        }
                                    </label>
                                )
                            })}
                        </div>
                    </section>

                    <div
                        className="justify-center flex flex-col items-center">

                        {/* BOTÃO */}
                        <button
                            onClick={handleCreate}
                            disabled={isloading}
                            className="w-auto px-10 h-14 rounded bg-[var(--primary)] text-white font-semibold text-lg transition hover:opacity-90 disabled:opacity-50 shadow-lg shadow-blue-200"
                        >
                            {
                                isloading
                                    ? "Processando..."
                                    : "Cadastrar"
                            }
                        </button>

                        {/* FOOTER */}
                        <p className="text-center text-sm text-gray-500">

                            Já possui conta?

                            <Link
                                href="/login"
                                className="ml-1 text-[var(--primary)] font-semibold hover:underline"
                            >
                                Acesse aqui
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div >
    )
}