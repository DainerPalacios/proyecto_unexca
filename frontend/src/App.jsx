import React, { useState } from 'react';
import './index.css';
// Importamos los dos componentes principales que ya modificamos anteriormente
import ProfesorView from './components/ProfesorView';
import StudentView from './components/StudentView';

function App() {
  // --- ESTADO DE LA APLICACIÓN ---
  // 'tipoUsuario' controla qué pantalla se está viendo actualmente.
  // Puede ser 'profesor' o 'estudiante'. Inicia por defecto en 'profesor'.
  const [tipoUsuario, setTipoUsuario] = useState('profesor');

  return (
    // Contenedor principal que ocupa toda la altura de la pantalla (min-h-screen)
    // Fondo gris claro (#eef1f5) para dar contraste con el contenido blanco
    <div className="min-h-screen bg-[#eef1f5]">
      
      {/* --- ENCABEZADO (HEADER) --- */}
      <header className="bg-[#003366] text-white shadow-lg p-6 mb-8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          
          {/* Título del sistema */}
          <h1 className="text-xl md:text-2xl font-bold tracking-tight">
            UNEXCA - Gestión de Notas
          </h1>
          
          {/* --- BARRA DE NAVEGACIÓN (BOTONES) --- */}
          <nav className="flex bg-blue-900/50 p-1 rounded-lg">
            
            {/* Botón para activar la vista de PROFESOR */}
            <button 
              // Lógica de estilos: Si tipoUsuario es 'profesor', el botón se pone blanco (activo).
              // Si no, se pone transparente con texto azul claro (inactivo).
              className={`px-6 py-2 rounded-md font-semibold transition-all ${
                tipoUsuario === 'profesor' 
                ? 'bg-white text-[#003366] shadow-md' 
                : 'text-blue-100 hover:text-white'
              }`} 
              // Al hacer clic, cambiamos el estado a 'profesor'
              onClick={() => setTipoUsuario('profesor')}
            >
              Vista Profesor
            </button>

            {/* Botón para activar la vista de ESTUDIANTE */}
            <button
              // Misma lógica de estilos pero verificando si es 'estudiante'
              className={`px-6 py-2 rounded-md font-semibold transition-all ${
                tipoUsuario === 'estudiante' 
                ? 'bg-white text-[#003366] shadow-md' 
                : 'text-blue-100 hover:text-white'
              }`}
              // Al hacer clic, cambiamos el estado a 'estudiante'
              onClick={() => setTipoUsuario('estudiante')}
            >
              Vista Estudiante
            </button>
          </nav>
        </div>
      </header>

      {/* --- CONTENIDO PRINCIPAL (MAIN) --- */}
      <main className="container mx-auto px-4 pb-12">
        {/* RENDERIZADO CONDICIONAL (Operador Ternario):
          Aquí ocurre la "magia" del cambio de pantallas.
          
          ¿tipoUsuario es igual a 'profesor'?
          - SI: Muestra <ProfesorView />
          - NO: Muestra <StudentView />
        */}
        {tipoUsuario === 'profesor' ? <ProfesorView /> : <StudentView />}
      </main>
      
    </div>
  );
}

export default App;