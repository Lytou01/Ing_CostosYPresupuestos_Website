export default function Header() {
  return (
    <header className="bg-navy text-white">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <p className="text-center text-orange-200 font-serif text-lg tracking-wide">
          UNIVERSIDAD NACIONAL FEDERICO VILLARREAL
        </p>
        <p className="text-center text-orange-100 text-sm">
          Facultad de Ingeniería Industrial y de Sistemas
        </p>
        <p className="text-center text-orange-100 text-sm">
          Escuela Profesional de Ingeniería de Sistemas
        </p>
        <h1 className="font-serif text-2xl text-center mt-3 tracking-wide">
          Sistema de Costeo ABC
        </h1>
        <p className="text-center text-orange-200 text-sm">Costeo Basado en Actividades</p>
        <p className="text-center text-orange-100 text-xs mt-3">
          Docente: Ing. Jose Orlando Alvarado Alvarado
        </p>

        <div className="mt-3 border-t border-orange-600 pt-3 text-center text-xs text-orange-200 space-x-3">
          <span>Donayre Aguilar, Fabrizio Julio</span>
          <span>&bull;</span>
          <span>Roberto Saavedra Crispín, Leonardo Jesús</span>
          <span>&bull;</span>
          <span>Chávez Curihuamán, Michael Jaren</span>
        </div>
        <div className="text-center text-xs text-orange-200 space-x-3">
          <span>Corimanya Vera, Iro Louis</span>
          <span>&bull;</span>
          <span>Huamantalla Huaranca, John Samuel</span>
        </div>

        <p className="text-center text-orange-100 font-bold text-sm mt-3">EXAMEN FINAL</p>
      </div>
    </header>
  );
}