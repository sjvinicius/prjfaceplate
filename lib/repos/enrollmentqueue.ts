import { getDb } from "@/lib/db"

export type AddEnrollmentQueueDTO = {
    usuario_id: number
    image_url: string
    storage_path: string
    criacao_token: string
    label: string
}

export async function addEnrollmentQueue(
    data: AddEnrollmentQueueDTO
) {

    const db = await getDb()

    return await db.SetFilaEmbeddingFaceRecog({
        usuario_id: data.usuario_id,
        image_url: data.image_url,
        storage_path: data.storage_path,
        criacao_token: data.criacao_token,
        status: "P",
    })
}