import { supabase } from "@/lib/supabaseCliente"

export type UploadedFaceImage = {
    url: string
    path: string
    label: string
}

const labels = [
    "front",
    "smile",
    "left",
    "right",
    "tilt"
]

export async function uploadFaceImages(
    userId: string | number,
    files: File[]
): Promise<UploadedFaceImage[]> {

    if (files.length !== 5) {
        throw new Error("São necessárias 5 imagens.")
    }

    const uploaded: UploadedFaceImage[] = []

    for (let i = 0; i < files.length; i++) {

        const file = files[i]

        if (!file.type.startsWith("image/")) {
            throw new Error("Arquivo inválido.")
        }

        if (file.size > 5 * 1024 * 1024) {
            throw new Error("Imagem muito grande.")
        }

        const extension = file.name.split(".").pop()

        const fileName =
            `${labels[i]}-${Date.now()}.${extension}`

        const path =
            `${userId}/${fileName}`

        const { error } = await supabase.storage
            .from("faces")
            .upload(path, file, {
                upsert: false
            })

        if (error) {
            throw new Error(error.message)
        }

        const { data } = supabase.storage
            .from("faces")
            .getPublicUrl(path)

        uploaded.push({
            url: data.publicUrl,
            path,
            label: labels[i]
        })
    }

    return uploaded
}