import { GetAllVehicles } from "@/lib/repos/vehicle";
import { encrypt } from "@/lib/utils/crypto";

export async function GET() {
    const plates = await GetAllVehicles();

    const encrypted = plates.map(p => encrypt(p));

    return Response.json(encrypted);
}