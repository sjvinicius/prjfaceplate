'use client'
import { Veiculo } from "@/lib/database";
import { verifyToken } from "@/lib/jwt/jwt";
import { setVehicle } from "@/lib/repos/vehicle";
import { useState, useTransition } from "react";
import toast from "react-hot-toast";

const marcas = [
    'Selecione', 'BMW', 'Citroen', 'Dafra', 'Harley Davidson', 'Honda', 'Hyundai', 'Jeep',
    'Kawasaki', 'Mercedes-Benz', 'Nissan', 'Peugeot', 'Renault', 'Royal Enfield',
    'Shineray', 'Suzuki', 'Toyota', 'Triumph', 'Volkswagen', 'Yamaha'
];

export default function NewVehicle() {
    const [brand, setBrand] = useState(marcas[0]);
    const [modelo, setModelo] = useState("");
    const [cor, setCor] = useState("");
    const [placa, setPlaca] = useState("");
    const [isPending, startTransition] = useTransition()

    const handleRegister = async () => {
        startTransition(async () => {

            let toastId: string | null = null

            try {

                if (brand === "Selecione") {
                    throw new Error("Selecione uma marca.");
                }
                if (!modelo.trim()) {
                    throw new Error("Insira um modelo.");
                }
                if (!cor.trim()) {
                    throw new Error("Selecione uma cor.");
                }
                if (!placa.trim()) {
                    throw new Error("Insira uma placa.");
                }

                const placaRegex = /^[A-Z]{3}-?[0-9][0-9A-Z][0-9]{2}$/;
                if (!placaRegex.test(placa.toUpperCase())) {
                    alert("Placa inválida. Formato esperado: ABC-1234 ou ABC1D23");
                    return;
                }

                const token = document.cookie
                    .split("; ")
                    .find((row) => row.startsWith("nextauthprjfaceplate-token="))
                    ?.split("=")[1];

                if (!token) {
                    throw new Error("Token não encontrado ou expirado.");
                }

                const decoded = await verifyToken(token);

                if (!decoded) {

                    throw new Error("Token não encontrado ou expirado.");
                }

                const { usuario_id } = decoded ?? null;

                const veiculo: Veiculo = {
                    usuario_id: { usuario_id },
                    marca: brand,
                    modelo,
                    cor,
                    placa: placa.toUpperCase(),
                };

                const setvehicle = await setVehicle(veiculo);

                if (!setvehicle) {

                    throw new Error("Houve um erro ao cadastrar veículo.")
                }

                toast.success("Veículo cadastrado!")
                setBrand(marcas[0]);
                setModelo("");
                setCor("");
                setPlaca("");

            } catch (err: any) {
                toast.error(err.message, {
                    style: {
                        borderRadius: "10px",
                        background: "#333",
                        color: "#fff",
                    },
                    duration: 2000,
                });
            } finally {
                if (toastId) {

                    toast.dismiss(toastId);
                }
            }
        })
    };

    const GetVehicles = async () => {
        try {

        } catch (error) {

        } finally {

        }
    }

    const formatarPlaca = (valor: string) => {
        // Remove tudo que não for letra ou número
        valor = valor.toUpperCase().replace(/[^A-Z0-9]/g, "");

        // Antigo: AAA1234
        if (/^[A-Z]{3}[0-9]{4}$/.test(valor)) {
            return valor.replace(/^([A-Z]{3})([0-9]{4})$/, "$1 $2");
        }

        // Mercosul: AAA1A23
        if (/^[A-Z]{3}[0-9][A-Z][0-9]{2}$/.test(valor)) {
            return valor.replace(/^([A-Z]{3})([0-9][A-Z][0-9]{2})$/, "$1 $2");
        }

        return valor;
    };

    return (
        <div className="flex items-center justify-between gap-5">
            <div className="flex-[2] flex flex-col gap-1">
                <label className="text-sm">Marca</label>
                <select
                    className="mb-3 text-sm px-4 py-2 border rounded w-full">
                    {marcas.map((marca) => (
                        <option key={marca} value={marca}>
                            {marca}
                        </option>
                    ))}
                </select>
            </div>

            <div className="flex-[2] flex flex-col gap-1">
                <label className="text-sm" htmlFor="model">Modelo</label>
                <input
                    id="model"
                    type="text"
                    value={modelo}
                    onChange={(e) => setModelo(e.target.value)}
                    className="mb-3 text-sm px-4 py-2 border rounded w-full"
                    required
                />
            </div>

            <div className="flex-[2] flex flex-col gap-1">
                <label className="text-sm" htmlFor="cor">Cor</label>
                <input
                    id="cor"
                    type="text"
                    value={cor}
                    onChange={(e) => setCor(e.target.value)}
                    className="mb-3 text-sm px-4 py-2 border rounded w-full"
                    required
                />
            </div>

            <div className="flex-[2] flex flex-col gap-1">
                <label className="text-sm" htmlFor="placa">Placa</label>
                <input
                    id="placa"
                    type="text"
                    maxLength={8} // AAA 1234
                    value={placa}
                    onChange={(e) => setPlaca(formatarPlaca(e.target.value))}
                    className="mb-3 text-sm px-4 py-2 border rounded w-full"
                    required
                />
            </div>

            <div>
                <button
                    onClick={handleRegister}
                    className="flex-1 md:flex-none px-4 py-2 rounded cursor-pointer bg-[var(--primary)] text-white hover:opacity-80 disabled:opacity-50"
                >
                    Cadastrar
                </button>
            </div>
        </div>
    );
}