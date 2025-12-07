export default function Header() {
  return (
    <header className="bg-gray-800 border-b border-gray-700">
      <div className="max-w-[1600px] mx-auto flex items-center justify-between px-6 py-4">
        {/* Título */}
        <div>
          <h1 className="text-[1.75rem] font-bold text-white -tracking-[0.5px]">
            Vista de Enfermería - Triage
          </h1>
          <p className="text-[0.875rem] text-white/90 mt-1 font-normal">
            Sistema Inteligente de Clasificación
          </p>
        </div>

        {/* Usuario */}
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm text-white/90">Enfermera</p>
            <p className="text-sm font-medium text-white">Carmen Silva</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium">
            CS
          </div>
        </div>
      </div>
    </header>
  );
}
