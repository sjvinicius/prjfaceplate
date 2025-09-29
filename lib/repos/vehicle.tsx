"use server"
import { revalidatePath } from "next/cache";
import { LogUsuarioVeiculo, Usuario, Veiculo } from "../database";
import { getDb } from "../db";

export async function GetPendingVehicle(): Promise<Partial<Veiculo>[] | null> {

    const db = await getDb();
    const user = await db.GetPendingVehicle()

    return user
}

export async function SetUpdateVehicle(veiculo: Partial<Veiculo>) {
    const db = await getDb();
    const user = await db.SetUpdateVehicle(veiculo)

    return user
}

export async function aprovarVeiculo(usuarioveiculo_id: number) {
    await SetUpdateVehicle({ usuarioveiculo_id, status: "A" });
    revalidatePath("/validvehicle");
}

export async function reprovarVeiculo(usuarioveiculo_id: number) {
    await SetUpdateVehicle({ usuarioveiculo_id, status: "R" });
    revalidatePath("/validvehicle");
}

export async function isValidVehicle(veiculo: Partial<Veiculo>) {
    const db = await getDb();
    const vehicle = await db.isValidVehicle(veiculo)

    return vehicle.success ?? false
}

export async function setLogVehicle(logusuarioveiculo: Partial<LogUsuarioVeiculo>) {
    const db = await getDb();
    const vehicle = await db.SetLogVehicle(logusuarioveiculo);

    return vehicle
}

export async function setVehicle(veiculo: Partial<Veiculo>) {
    const db = await getDb();
    const vehicle = await db.SetVehicle(veiculo);

    return vehicle
}