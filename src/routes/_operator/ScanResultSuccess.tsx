import { useLocation, useNavigate } from "react-router";
import { IconCheck } from '@tabler/icons-react';

interface ScannedTicket extends Record<string, unknown> {
  passengerName?: string;
  seat?: number;
  route?: string;
}

export default function ScanResultSuccess() {
  const navigate = useNavigate();
  const location = useLocation();
  const ticket = (location.state as ScannedTicket | null) ?? null;

  return (
    <div className="bg-[#064E3B]">

    <div className="min-h-screen bg-[#064E3B] font-outfit flex flex-col 
    items-center justify-center gap-4">
      <div
        className="h-[100px] w-[100px] bg-[#FFFFFF] rounded-full 
       flex items-center justify-center shadow-[#00000033]"
      >
       <IconCheck className="h-12 w-12 text-[#064E3B]"/>
      </div>
      <div className="flex items-center  justify-center mt-4 flex-col">
        <h1 className="text-[32px] font-black text-white">PERMITIDO</h1>
        <p className="text-sm text-[#A7F3D0] font-semibold">BOARDING PASS VÁLIDO</p>
      </div>
      <div className="bg-white w-[338px] h-[219px] rounded-2xl shadow-[#00000033]
      mt-4 p-6 flex flex-col items-baseline justify-baseline">
        <div className="flex flex-col gap-1">
      <p className="text-[11px] font-semibold text-[#4B5563]">PASSAGEIRO</p>
         <h1 className="text-xl text-[#111827] font-extrabold">{ticket?.passengerName ?? "Manuel D. Santos"}</h1>
        </div>
      <div className="flex justify-baseline items-baseline mb-3 mt-2">
        <div className="flex flex-col w-[139px]">
          <p className="text-[#4B5563] text-[11px] font-extrabold">
            LUGAR
          </p>
          <h1 className="text-[#1B7A3D] text-2xl font-extrabold">{ticket?.seat ?? "12A"}</h1>
        </div>
        <div className="flex flex-col flex-1">
          <p className="text-[#4B5563] text-[11px] font-extrabold">
            CLASSE
          </p>
          <h1 className="text-[#1B7A3D] text-base  font-extrabold">Classe Padrão</h1>
        </div>
      </div>
      <div className="pt-4 flex flex-col gap-1 border-t border-[#E5E7EB] w-full">
        <p className="text-[11px] text-[#4B5563] font-semibold">SERVIÇO MACON</p>
        <span className="text-sm font-bold text-[#111827]">Luanda -&gt; Benguela * 06:00</span>
      </div>
      </div>

    </div>
      <footer className="sticky bottom-0 flex w-full justify-center items-center
      h-[146px] bg-[#064E3B] p-10">
       <button onClick={() => navigate("/operator/scan")}
        className=" w-full  h-12 text-white text-base font-bold
        bg-gradient-to-r from-[#6B9E8C] to-[#3A6356] rounded-xl">
        Escanear Próximo
       </button>
      </footer>
    </div>
  );
}
