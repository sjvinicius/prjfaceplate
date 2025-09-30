import ContainerVehicle from "@/components/ContainerVehicle";
import NewVehicle from "@/components/newvehicle";

export default function Vehicles() {
    return (
        <div className="flex flex-col items-center min-h-screen px-4 sm:px-6 lg:px-8 gap-5">
            <div
                className="w-full pt-20 max-w-7xl flex flex-col rounded-md py-6 bg-[var(--background)] gap-10"
                style={{
                    filter: "drop-shadow(-6px 4px 6.8px rgba(0, 0, 0, 0.25))"
                }}
            >
                <div className="py-3 px-6 text-2xl md:text-4xl rounded-r-lg border border-l-0 border-[var(--primary)] border-solid w-full sm:w-[80%] md:w-[60%] lg:w-[40%]">
                    <h1 className="text-[var(--primary)]">Novo Veículo</h1>
                </div>

                <div className="w-full max-w-6xl mx-auto px-2 sm:px-4">
                    <NewVehicle />
                </div>
            </div>

            <div
                className="w-full pt-20 max-w-7xl flex flex-col rounded-md py-6 bg-[var(--background)] gap-10 mb-20"
                style={{
                    filter: "drop-shadow(-6px 4px 6.8px rgba(0, 0, 0, 0.25))"
                }}
            >
                <div className="py-3 px-6 text-2xl md:text-4xl rounded-r-lg border border-l-0 border-[var(--primary)] border-solid w-full sm:w-[80%] md:w-[60%] lg:w-[40%]">
                    <h1 className="text-[var(--primary)]">Veículos</h1>
                </div>
                <div className="w-full max-w-6xl mx-auto px-2 sm:px-4">
                    <ContainerVehicle />
                </div>
            </div>
        </div>
    )
}