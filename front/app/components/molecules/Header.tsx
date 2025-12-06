export default function Header() {
  return (
    <header className="bg-white border-b border-gray-border">
      <div className="max-w-screen-2xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-hard">
              Vista de Enfermer�a - Triage
            </h1>
            <p className="text-sm text-gray-soft mt-1">
              Sistema Inteligente de Clasificaci�n
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-gray-soft">Enfermera</p>
              <p className="text-sm font-medium text-gray-hard">Carmen Silva</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-medium">
              CS
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
