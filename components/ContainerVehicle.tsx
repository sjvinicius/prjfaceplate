'use client'

import { getVehicles } from "@/lib/repos/vehicle"
import { useTransition, useState, useEffect, useRef } from "react"
import toast from "react-hot-toast"
import CardVehicle from "./cardvehicle"
import type { PendingVehicle } from "/lib/supabaseClient"

type Vehicle = {
  usuarioveiculo_id: string
  placa: string
  modelo: string
}

type MeResponse = {
  realm: string
  usuario_id: string
}

export default function ContainerVehicle() {
    
    const [vehicles, setVehicles] = useState<Vehicle[]>([])
    const fetchedRef = useRef(false)

    const GetVehicles = async () => {
        let toastId: string | null = null

        try {
            toastId = toast.loading("Buscando veículos...")

            const res = await fetch('/api/me')

            const data: MeResponse = await res.json()

            if (!res.ok) {
                throw new Error('Erro ao buscar usuário')
            }

            const { realm, usuario_id } = data

            let userid = ""

            if (!realm.includes("admin") && !realm.includes("gerente")) {
                userid = usuario_id
            }

            const vehiclesData = await getVehicles(userid)

            if (!vehiclesData?.length) {
                throw new Error("Nenhum veículo encontrado.")
            }
            
            const normalized: Vehicle[] = vehiclesData
              .filter((v) => v.usuarioveiculo_id !== undefined)
              .map((v) => ({
                usuarioveiculo_id: String(v.usuarioveiculo_id),
                placa: v.placa ?? "",
                modelo: v.modelo ?? "",
              }))
            
            setVehicles(normalized)
        } catch (error) {
            const err = error as Error
            toast.error(err.message || 'Ocorreu um erro inesperado.')
        } finally {
            if (toastId) toast.dismiss(toastId)
        }
    }

    useEffect(() => {
        if (fetchedRef.current) return
        fetchedRef.current = true
        GetVehicles()
    }, [])

    return (
        <div>
            {vehicles.map((veiculo) => (
                <CardVehicle 
                  veiculo={veiculo} 
                  key={veiculo.usuarioveiculo_id} 
                />
            ))}
        </div>
    )
}
