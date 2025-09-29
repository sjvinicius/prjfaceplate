import NewVehicle from "@/components/newvehicle";

export default function Vehicles() {
    return (
        <div className="flex flex-col items-center min-h-screen">
            <div
                className="w-full pt-20 max-w-7xl my-auto flex flex-col h-full rounded-md py-6 bg-[var(--background)] gap-10 min-h-screen"
                style={{
                    filter: "drop-shadow(-6px 4px 6.8px rgba(0, 0, 0, 0.25))"
                }}
            >
                {/* Título */}
                <div className="py-3 px-6 text-2xl md:text-4xl rounded-r-lg border border-l-0 border-[var(--primary)] border-solid w-full md:w-[60%] lg:w-[40%]">
                    <h1 className="text-[var(--primary)]">Veículos</h1>
                </div>
                <div className="h-[10rem] overflow-y-auto w-full max-w-6xl mx-auto px-2 sm:px-4">
                    <NewVehicle />
                </div>
            </div>
        </div>
    )
}