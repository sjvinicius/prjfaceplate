"use client"

export default function addcar() {

  return (

    <div className="flex flex-col items-center h-screen py-5 px-3">
      <div
        className="w-[70vw] my-auto flex flex-col h-[85vh] rounded-md px-[10vh] py-[3vh] bg-[var(--background)]"
        style={{
          filter: "drop-shadow(-6px 4px 6.8px rgba(0, 0, 0, 0.25))",
        }}
      >

        <div className="flex  items-start mb-5 -mx-[10vh]">
          <img src="/logo.svg" className="h-auto w-auto ml-5" alt="Logo FacePlate" />
        </div>

        <div className="flex flex-col gap-4 w-full items-center">

          <div className="flex flex-col w-3/4">
            <label className="mb-1 text-sm">Marca</label>
            <input type="text" placeholder="Volkswagem, BMW, Fiat, etc..." className="border rounded-md p-2 w-full" />
          </div>
          <div className="flex flex-col w-3/4">
            <label className="mb-1 text-sm">Cor</label>
            <input type="text" placeholder="Azul, Vermelho, Roxo etc..." className="border rounded-md p-2 w-full" />
          </div>
          <div className="flex flex-col w-3/4">
            <label className="mb-1 text-sm">Placa</label>
            <input type="text" placeholder="Exemplo: ABC-1234" className="border rounded-md p-2 w-full" />
          </div>


          <div className="flex justify-between w-3/4 mt-8">
            <button className="bg-gray-400 text-white px-4 py-2 rounded shadow-2xl w-60" style={{
              boxShadow: "-4px 4px 6px rgba(0, 0, 0, 0.3)", // sombra suave à esquerda e embaixo
            }}>
              VOLTAR
            </button>
            <button className="bg-gray-400 text-white px-4 py-2 rounded shadow-2xl w-60" style={{
              boxShadow: "-4px 4px 6px rgba(0, 0, 0, 0.3)", // sombra suave à esquerda e embaixo
            }}>
              ADICIONAR
            </button>
          </div>
        </div>

      </div>
    </div>



  )




}