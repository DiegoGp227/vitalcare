export default function Header() {
  return (
   <header className="bg-linear-to-r from-cyan-500 to-blue-500 shadow-md p-6">
  <div className="max-w-[1600px] mx-auto flex justify-between items-center">
    <div>
      <h1 className="text-white text-2xl font-bold">Vista de Enfermería - Triage</h1>
      <p className="text-cyan-100 text-sm">Sistema Inteligente de Clasificación</p>
    </div>

    <div className="flex items-center gap-4">
      <div className="text-right">
        <p className="text-white/80 text-xs uppercase tracking-wide font-semibold">Enfermera</p>
        <p className="text-white text-sm font-semibold">Carmen Silva</p>
      </div>
      <div className="w-11 h-11 rounded-full bg-white text-cyan-500 flex items-center justify-center font-bold text-sm shadow-md">
        CS
      </div>
    </div>
  </div>
</header>

  );
}
