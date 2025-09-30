'use client'
import { Veiculo } from "@/lib/database";
import { verifyToken } from "@/lib/jwt/jwt";
import { setVehicle } from "@/lib/repos/vehicle";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import toast, { Toaster } from "react-hot-toast";

const marcas = [
    'Selecione', 'BMW', 'Citroen', 'Dafra', 'Fiat', 'Harley Davidson', 'Honda', 'Hyundai', 'Jeep',
    'Kawasaki', 'Mercedes-Benz', 'Nissan', 'Peugeot', 'Renault', 'Royal Enfield',
    'Shineray', 'Suzuki', 'Toyota', 'Triumph', 'Volkswagen', 'Yamaha'
];

export default function NewVehicle() {
    const [brand, setBrand] = useState(marcas[0]);
    const [modelo, setModelo] = useState("");
    const [cor, setCor] = useState("");
    const [placa, setPlaca] = useState("");
    const [isPending, startTransition] = useTransition()

    const router = useRouter();
    const handleRegister = async () => {

        startTransition(async () => {

            let toastId: string | null = null

            try {

                toastId = toast.loading("Registando veículo...");

                if (brand === "Selecione") {
                    throw new Error("Selecione uma marca.");
                }

                if (!modelo.trim()) {
                    throw new Error("Insira um modelo.");
                }

                if (cor === "Selecione") {
                    throw new Error("Selecione uma cor.");
                }

                if (!placa.trim()) {
                    throw new Error("Insira uma placa.");
                }

                const placaRegex = /^[A-Z]{3}\s?[0-9][0-9A-Z][0-9]{2}$/i;

                if (!placaRegex.test(placa.toUpperCase())) {
                    throw new Error("Placa inválida. Formato esperado: ABC 1234 ou ABC 1D23");
                }

                const res = await fetch('/api/me', {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                });

                const data = await res.json();

                if (!res.ok) throw new Error(data.erro || 'Erro de autenticação, entre em contato com o suporte.');

                const { usuario_id } = data ?? null;

                const veiculo: Veiculo = {
                    usuario_id: { usuario_id },
                    marca: brand,
                    modelo,
                    cor,
                    placa: placa.toUpperCase().trim().replaceAll(" ", ""),
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
                router.refresh()

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
        <div className="flex flex-col items-center md:flex-row md:flex-wrap md:items-start md:justify-between gap-5">
            <div className="flex-1 flex flex-col gap-1 min-w-[200px]">
                <label className="text-sm">Marca</label>
                <select
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    className="mb-3 text-sm px-4 py-2 border rounded w-full"
                >
                    {marcas.map((marca) => (
                        <option key={marca} value={marca}>
                            {marca}
                        </option>
                    ))}
                </select>
            </div>

            <div className="flex-1 flex flex-col gap-1 min-w-[200px]">
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

            <div className="flex-1 flex flex-col gap-1 min-w-[200px]">
                <label className="text-sm" htmlFor="cor">Cor</label>
                <select
                    className="mb-3 text-sm px-4 py-2 border rounded w-full"
                    onChange={(e) => setCor(e.target.value)}
                    value={cor}
                >
                    <option value="">Selecione</option>
                    <option value="branco">Branco</option>
                    <option value="cinza">Cinza</option>
                    <option value="prata">Prata</option>
                    <option value="preto">Preto</option>
                    <option value="vermelho">Vermelho</option>
                    <option value="fantasia">Fantasia</option>
                </select>
            </div>

            <div className="flex-1 flex flex-col gap-1 min-w-[200px]">
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

            <div className="flex-1 md:w-auto items-center flex justify-center my-auto">
                <button
                    disabled={isPending}
                    onClick={() => startTransition(() => handleRegister())}
                    className="w-full md:w-auto px-4 py-2 rounded cursor-pointer bg-[var(--primary)] text-white hover:opacity-80 disabled:opacity-50"
                >
                    Cadastrar
                </button>
            </div>
        </div>

    );
}