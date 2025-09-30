'use client'

import { getVehicles } from "@/lib/repos/vehicle"
import { useTransition, useState, useEffect } from "react"
import toast from "react-hot-toast"
import CardVehicle from "./cardvehicle"

export default function ContainerVehicle() {
    const [isPending, startTransition] = useTransition()
    const [vehicles, setVehicles] = useState<any[]>([])

    const GetVehicles = async () => {
        let toastId: string | null = null

        try {
            toastId = toast.loading("Buscando veículos...")

            const res = await fetch('/api/me', {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            })

            const data = await res.json()

            if (!res.ok) throw new Error(data.erro || 'Erro de autenticação, entre em contato com o suporte.')

            const { realm, usuario_id } = data ?? {}

            let userid: string = ""

            if (!realm.includes("admin") && !realm.includes("gerente")) {
                userid = usuario_id
            }

            console.log(userid)
            const vehiclesData = await getVehicles(userid)

            if (!vehiclesData || vehiclesData.length === 0) {
                throw new Error("Nenhum veículo encontrado.")
            }

            startTransition(() => {
                setVehicles(vehiclesData)
            })

        } catch (error: any) {
            toast.error(error.message || 'Ocorreu um erro inesperado.')
        } finally {
            if (toastId) toast.dismiss(toastId)
        }
    }

    useEffect(() => {
        GetVehicles()
    }, [])

    return (
        <div>
            {vehicles.map((veiculo: any) => (
                <CardVehicle veiculo={veiculo} />
            ))}
        </div>
    )
}
