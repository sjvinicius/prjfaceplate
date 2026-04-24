'use client'

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

type CreateVehicleDTO = {
    usuario_id: number
    marca: string
    modelo: string
    cor: string
    placa: string
    status: "P"
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
        let placa = value.toUpperCase().replace(/[^A-Z0-9]/g, "")
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
        <div className="flex flex-col md:flex-row flex-wrap gap-5">
            
            <select value={brand} onChange={(e) => setBrand(e.target.value)} className="input">
                {marcas.map((marca) => (
                    <option key={marca}>{marca}</option>
                ))}
            </select>

            <input value={modelo} onChange={(e) => setModelo(e.target.value)} placeholder="Modelo" className="input" />

            <select value={cor} onChange={(e) => setCor(e.target.value)} className="input">
                <option value="">Selecione</option>
                <option value="branco">Branco</option>
                <option value="preto">Preto</option>
            </select>

            <input
                value={placa}
                onChange={(e) => setPlaca(formatarPlacaInput(e.target.value))}
                placeholder="ABC 1234"
                className="input"
            />

            <button
                disabled={isPending}
                onClick={handleRegister}
                className="px-4 py-2 bg-[var(--primary)] text-white rounded"
            >
                Cadastrar
            </button>
        </div>
    )
}
