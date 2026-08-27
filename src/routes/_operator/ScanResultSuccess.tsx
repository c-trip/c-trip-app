import { useLocation, useNavigate } from "react-router";
import { IconArrowLeft } from "@tabler/icons-react";

interface ScannedTicket extends Record<string, unknown> {
  passengerName?: string;
  seat?: number;
  route?: string;
}

export default function ScanResultSuccess() {
  const navigate = useNavigate();
  const location = useLocation();
  const ticket = (location.state as ScannedTicket | null) ?? null;

  const goBack = () => navigate("/operator/scan");
  const goToPanel = () => navigate("/operator");

  return (
    <div className="min-h-screen bg-black font-outfit">
      <header className="sticky top-0 z-50 bg-black px-5 pt-3 pb-4">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={goBack}
            aria-label="Voltar ao scanner"
            className="p-1 rounded-full hover:bg-white/10"
          >
            <IconArrowLeft className="size-5 text-white" />
          </button>
          <h1 className="text-[22px] font-bold text-white text-center flex-1">
            Bilhete Scanado
          </h1>
          <span className="text-[10px] font-bold uppercase tracking-wide text-white/60 bg-white/10 rounded-full px-2 py-1">
            Protótipo
          </span>
        </div>
      </header>

      <main className="px-5 pb-8">
        {ticket ? (
          <div className="w-full max-w-xs mx-auto">
            <p className="text-white font-semibold text-center">
              Passageiro: {ticket.passengerName ?? "—"}
            </p>
            <p className="text-gray-400 text-sm text-center mt-1">
              Lugar: {ticket.seat ?? "—"} · Rota: {ticket.route ?? "—"}
            </p>
          </div>
        ) : (
          <p className="text-gray-400 text-sm text-center py-16">
            Sem informação do bilhete. Escaneie novamente.
          </p>
        )}

        <button
          type="button"
          onClick={goToPanel}
          className="w-full max-w-xs mx-auto block py-3 bg-white/10 text-white font-semibold rounded-xl hover:bg-white/20 transition-colors mt-8"
        >
          Voltar ao painel
        </button>
      </main>
    </div>
  );
}