'use client'

import { CreateVehicleDTO } from "@/lib/database"
import { setVehicle } from "@/lib/repos/vehicle"
import { useRouter } from "next/navigation"
import { useState, useTransition } from "react"
import toast from "react-hot-toast"

const marcas = [
    'Selecione', 'BMW', 'Citroen', 'Dafra', 'Fiat', 'Harley Davidson', 'Honda', 'Hyundai', 'Jeep',
    'Kawasaki', 'Mercedes-Benz', 'Nissan', 'Peugeot', 'Renault', 'Royal Enfield',
    'Shineray', 'Suzuki', 'Toyota', 'Triumph', 'Volkswagen', 'Yamaha'
]

type MeResponse = {
    usuario_id: number
}

export default function NewVehicle() {
    const [brand, setBrand] = useState(marcas[0])
    const [modelo, setModelo] = useState("")
    const [cor, setCor] = useState("")
    const [placa, setPlaca] = useState("")
    const [isPending, startTransition] = useTransition()

    const router = useRouter()

    const handleRegister = () => {
        startTransition(async () => {
            const toastId = toast.loading("Registrando veículo...")

            try {
                if (brand === "Selecione") {
                    throw new Error("Selecione uma marca.")
                }

                if (!modelo.trim()) {
                    throw new Error("Insira um modelo.")
                }

                if (!cor) {
                    throw new Error("Selecione uma cor.")
                }

                if (!placa.trim()) {
                    throw new Error("Insira uma placa.")
                }

                const placaRegex = /^[A-Z]{3}\s?[0-9][0-9A-Z][0-9]{2}$/i

                if (!placaRegex.test(placa.toUpperCase())) {
                    throw new Error("Placa inválida.")
                }

                const res = await fetch('/api/me')
                const data: MeResponse = await res.json()

                if (!res.ok) {
                    throw new Error("Erro de autenticação.")
                }

                const payload: CreateVehicleDTO = {
                    usuario_id: data.usuario_id,
                    marca: brand,
                    modelo,
                    cor,
                    placa: placa.toUpperCase().replaceAll(" ", ""),
                    status: "P"
                }

                const result = await setVehicle(payload)

                if (!result) {
                    throw new Error("Erro ao cadastrar veículo.")
                }

                toast.success("Veículo cadastrado!", { id: toastId })

                setBrand(marcas[0])
                setModelo("")
                setCor("")
                setPlaca("")

                router.refresh()

            } catch (err) {
                if (err instanceof Error) {
                    toast.error(err.message, { id: toastId })
                } else {
                    toast.error("Erro inesperado", { id: toastId })
                }
            }
        })
    }

    function formatarPlacaInput(value: string) {
        const placa = value.toUpperCase().replace(/[^A-Z0-9]/g, "")
        let resultado = ""

        for (let i = 0; i < placa.length; i++) {
            if (i < 3 && /[A-Z]/.test(placa[i])) resultado += placa[i]
            else if (i === 3 && /[0-9]/.test(placa[i])) resultado += " " + placa[i]
            else if (i === 4 && /[A-Z0-9]/.test(placa[i])) resultado += placa[i]
            else if (i === 5 && /[0-9]/.test(placa[i])) resultado += placa[i]
            else if (i === 6 && /[0-9]/.test(placa[i])) resultado += placa[i]
        }

        return resultado.slice(0, 8)
    }

    return (
        <div className="w-full bg-white rounded-2xl border border-gray-200 p-6 shadow-sm flex flex-col justify-between">
        
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                {/* Marca */}
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-700">
                        Marca
                    </label>

                    <select
                        value={brand}
                        onChange={(e) => setBrand(e.target.value)}
                        className="border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition"
                    >
                        {marcas.map((marca) => (
                            <option key={marca}>
                                {marca}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Modelo */}
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-700">
                        Modelo
                    </label>

                    <input
                        value={modelo}
                        onChange={(e) => setModelo(e.target.value)}
                        placeholder="Ex: Civic"
                        className="border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition"
                    />
                </div>

                {/* Cor */}
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-700">
                        Cor
                    </label>

                    <select
                        value={cor}
                        onChange={(e) => setCor(e.target.value)}
                        className="border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition"
                    >
                        <option value="">Selecione</option>
                        <option value="branco">Branco</option>
                        <option value="preto">Preto</option>
                    </select>
                </div>

                {/* Placa */}
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-700">
                        Placa
                    </label>

                    <input
                        value={placa}
                        onChange={(e) => setPlaca(formatarPlacaInput(e.target.value))}
                        placeholder="ABC 1234"
                        className="border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition uppercase"
                    />
                </div>
            </div>

            <div className="flex justify-center mt-6">
                <button
                    type="submit"
                    disabled={isPending}
                    onClick={handleRegister}
                    className="
                        w-full max-w-sm
                        bg-blue-600 hover:bg-blue-700
                        text-white font-semibold
                        py-3 px-6
                        rounded-xl
                        transition-all duration-200
                        shadow-md hover:shadow-lg
                        disabled:opacity-50 disabled:cursor-not-allowed
                    "
                >
                    {isPending ? 'Salvando...' : 'Cadastrar Veículo'}
                </button>
            </div>
        </div>
    )
}