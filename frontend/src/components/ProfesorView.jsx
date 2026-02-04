import React, { useState, useMemo } from 'react';

function ProfesorView() {
  // --- DEFINICIÓN DE ESTADOS (Hooks) ---
  
  // Almacenan la información básica del formulario
  const [cedula, setCedula] = useState('');
  const [semestre, setSemestre] = useState('');
  const [materia, setMateria] = useState('');

  // 'notas': Array que gestiona dinámicamente las evaluaciones.
  // IMPORTANTE: Mantenemos las claves 'score', 'weight' y 'description' en inglés
  // para asegurar la compatibilidad con el servidor (Backend) al enviar el JSON.
  const [notas, setNotas] = useState([{ id: 1, score: '', weight: 100, description: 'Examen Final' }]);
  
  // Estados para feedback al usuario y control de carga
  const [mensaje, setMensaje] = useState('');
  const [cargando, setCargando] = useState(false);

  // --- DATOS ESTÁTICOS ---
  // Objeto que mapea cada semestre con sus materias correspondientes.
  // Se usa para llenar el dropdown de materias según el semestre seleccionado.
  const materiasPorSemestre = {
    '1': ['Introducción a la Programación', 'Cálculo I'],
    '2': ['Programación II', 'Cálculo II'],
    '3': ['Estructuras de Datos', 'Física I'],
    '4': ['Bases de Datos', 'Física II'],
    '5': ['Redes de Computadoras', 'Sistemas Operativos'],
    '6': ['Inteligencia Artificial', 'Ingeniería de Software'],
    '7': ['Desarrollo Web Avanzado', 'Seguridad Informática'],
    '8': ['Proyecto de Grado', 'Emprendimiento Tecnológico'],
  };

  // --- LÓGICA DE CÁLCULO (useMemo) ---
  // useMemo optimiza el rendimiento: solo recalcula si el estado 'notas' cambia.
  // Calcula la nota final basada en los pesos y verifica si la suma de pesos es 100%.
  const { notaFinal, pesoTotal, esPesoValido } = useMemo(() => {
    let pesoTotalCalculado = 0;
    let sumaNotaPonderada = 0;

    notas.forEach(nota => {
      const puntaje = parseFloat(nota.score) || 0; // Convierte string a número
      const peso = parseFloat(nota.weight) || 0;
      
      pesoTotalCalculado += peso;
      // Fórmula: Nota * (Porcentaje / 100)
      sumaNotaPonderada += (puntaje * (peso / 100)); 
    });

    // Asegura que la nota no pase de 20 y fija 2 decimales
    const notaFinalCalculada = Math.min(sumaNotaPonderada, 20).toFixed(2);
    
    // Validación estricta: la suma de porcentajes debe ser exactamente 100
    const esValido = pesoTotalCalculado === 100;

    // Retornamos las variables renombradas al español
    return {
      notaFinal: notaFinalCalculada,
      pesoTotal: pesoTotalCalculado,
      esPesoValido: esValido
    };
  }, [notas]);

  // --- FUNCIONES MANEJADORAS (HANDLERS) ---

  // Agrega una nueva fila de evaluación al formulario
  const manejarAgregarCampoNota = () => {
    // Genera un ID único basado en el máximo existente + 1
    const nuevoId = notas.length ? Math.max(...notas.map(n => n.id)) + 1 : 1;
    // Agrega el nuevo objeto al array de notas
    setNotas([...notas, { id: nuevoId, score: '', weight: '', description: `Evaluación ${nuevoId}` }]);
  };

  // Elimina una fila específica de evaluación
  const manejarEliminarCampoNota = (id) => {
    // Evita borrar si solo queda una fila
    if (notas.length > 1) { 
      setNotas(notas.filter(nota => nota.id !== id));
    }
  };

  // Controla los cambios en los inputs de la tabla (Descripción, Peso, Nota)
  const manejarCambioCampo = (id, campo, valor) => {
    const nuevasNotas = notas.map(nota => {
      if (nota.id === id) {
        // Validación para el campo 'weight' (Peso): entre 0 y 100
        if (campo === 'weight') {
          const valorNum = Math.min(Math.max(0, parseFloat(valor || 0)), 100);
          return { ...nota, [campo]: valor === '' ? '' : valorNum };
        }
        // Validación para el campo 'score' (Nota): entre 0 y 20
        if (campo === 'score') {
          const valorNum = Math.min(Math.max(0, parseFloat(valor || 0)), 20);
          return { ...nota, [campo]: valor === '' ? '' : valorNum };
        }
        // Para descripción u otros campos texto
        return { ...nota, [campo]: valor };
      }
      return nota;
    });
    setNotas(nuevasNotas);
  };

  // --- ENVÍO DE DATOS AL SERVIDOR ---
  const manejarEnvio = async (evento) => {
    evento.preventDefault(); // Evita que la página se recargue

    // Validación final antes de enviar
    if (!esPesoValido) {
      setMensaje('Error: La suma de los pesos porcentuales debe ser 100%.');
      return;
    }

    setCargando(true);
    setMensaje('');

    // Prepara el objeto JSON para enviar al backend
    const datosAEnviar = {
      cedula_estudiante: cedula,
      nombre_materia: materia,
      semestre: semestre,
      evaluaciones: notas // Enviamos el array tal cual (keys: score, weight, description)
    };

    try {
      // Petición POST a la API local
      const response = await fetch('http://127.0.0.1:5000/api/guardar_notas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datosAEnviar)
      });

      if (response.ok) {
        // Éxito: Mostrar mensaje y resetear formulario
        setMensaje(`✅ Notas de ${cedula} guardadas. Nota Final: ${notaFinal}`);
        setCedula('');
        setNotas([{ id: 1, score: '', weight: 100, description: 'Examen Final' }]);
      } else {
        // Error del servidor (ej. estudiante no existe)
        const errorData = await response.json();
        setMensaje(`❌ Error: ${errorData.error || 'No se pudo guardar'}`);
      }
    } catch (error) {
      console.error('Error:', error);
      setMensaje('❌ No se pudo conectar con el servidor.');
    } finally {
      // Siempre se ejecuta al final: quita el loading y limpia el mensaje tras 5 seg
      setCargando(false);
      setTimeout(() => setMensaje(''), 5000);
    }
  };

  // Estilos CSS comunes reutilizables para los inputs (Tailwind CSS)
  const claseInputComun = "w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#003366] outline-none transition-all text-sm";

  // --- RENDERIZADO (JSX) ---
  return (
    <section className="max-w-4xl mx-auto bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden my-8">

      {/* Encabezado Visual */}
      <div className="bg-[#003366] p-6 text-center">
        <h2 className="text-2xl font-bold text-white uppercase tracking-wider">
          Carga de Notas (Profesor)
        </h2>
      </div>

      <div className="p-6 md:p-8">

        {/* Sección de Mensajes (Alertas de Éxito o Error) */}
        {mensaje && (
          <div className={`p-3 rounded-md mb-6 text-center font-bold border ${
            mensaje.includes('Error') || mensaje.includes('❌') 
            ? "bg-red-50 text-red-700 border-red-200" 
            : "bg-green-50 text-green-700 border-green-200"
          }`}>
            {mensaje}
          </div>
        )}

        {/* Formulario Principal */}
        <form onSubmit={manejarEnvio} className="space-y-6">

          {/* Primera Fila: Datos del Estudiante y Materia */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4 bg-gray-50 rounded-lg border border-gray-100">
            {/* Input Cédula */}
            <div className="flex flex-col">
              <label htmlFor="cedula" className="text-xs font-bold text-gray-700 mb-1 uppercase">Cédula Estudiante</label>
              <input
                type="text"
                id="cedula"
                placeholder="Ej: 12345678"
                value={cedula}
                className={claseInputComun}
                // Solo permite números y recorta a 8 caracteres
                onChange={(e) => setCedula(e.target.value.replace(/\D/g, '').slice(0, 8))}
                maxLength="8"
                required
              />
            </div>

            {/* Select Semestre */}
            <div className="flex flex-col">
              <label htmlFor="semestre" className="text-xs font-bold text-gray-700 mb-1 uppercase">Semestre</label>
              <select
                id="semestre"
                value={semestre}
                className={`${claseInputComun} bg-white`}
                onChange={(e) => { setSemestre(e.target.value); setMateria(''); }}
                required
              >
                <option value="">Seleccione...</option>
                {/* Genera opciones del 1 al 8 */}
                {[...Array(8).keys()].map(i => (
                  <option key={i + 1} value={String(i + 1)}>Semestre {i + 1}</option>
                ))}
              </select>
            </div>

            {/* Select Materia (Depende del semestre) */}
            <div className="flex flex-col">
              <label htmlFor="materia" className="text-xs font-bold text-gray-700 mb-1 uppercase">Materia</label>
              <select
                id="materia"
                value={materia}
                className={`${claseInputComun} bg-white`}
                onChange={(e) => setMateria(e.target.value)}
                disabled={!semestre}
                required
              >
                <option value="">{semestre ? "Seleccione Materia" : "Primero Semestre"}</option>
                {materiasPorSemestre[semestre]?.map((mat, index) => (
                  <option key={index} value={mat}>{mat}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Sección Dinámica: Tabla de Notas */}
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            {/* Cabecera de la tabla con botón agregar */}
            <div className="bg-gray-100 p-3 border-b border-gray-200 flex justify-between items-center">
              <span className="font-bold text-gray-700 text-sm">EVALUACIONES Y PONDERACIÓN</span>
              <button 
                type="button" 
                onClick={manejarAgregarCampoNota} 
                className="text-xs bg-[#003366] text-white px-3 py-1 rounded hover:bg-blue-800 transition"
              >
                + Agregar Evaluación
              </button>
            </div>

            <div className="p-4 bg-white">
              {/* Títulos de columnas (Visible solo en escritorio) */}
              <div className="hidden md:grid grid-cols-12 gap-4 mb-2 text-xs font-bold text-gray-500 uppercase">
                <div className="col-span-5">Descripción</div>
                <div className="col-span-3">Peso (%)</div>
                <div className="col-span-3">Nota (0-20)</div>
                <div className="col-span-1 text-center">Borrar</div>
              </div>

              {/* Mapeo de filas de notas */}
              {notas.map((notaField) => (
                <div key={notaField.id} className="grid grid-cols-1 md:grid-cols-12 gap-3 mb-3 items-center pb-3 border-b border-gray-100 last:border-0 last:pb-0">

                  {/* Campo Descripción */}
                  <div className="col-span-5">
                    <label className="md:hidden text-xs font-bold text-gray-500">Descripción</label>
                    <input
                      type="text"
                      placeholder="Ej: Examen Final"
                      value={notaField.description}
                      className={claseInputComun}
                      onChange={(e) => manejarCambioCampo(notaField.id, 'description', e.target.value)}
                      required
                    />
                  </div>

                  {/* Campo Peso % */}
                  <div className="col-span-3">
                    <label className="md:hidden text-xs font-bold text-gray-500">Peso %</label>
                    <div className="relative">
                        <input
                            type="number"
                            min="0"
                            max="100"
                            placeholder="%"
                            value={notaField.weight}
                            className={`${claseInputComun} pr-6 text-center`}
                            onChange={(e) => manejarCambioCampo(notaField.id, 'weight', e.target.value)}
                            required
                        />
                        <span className="absolute right-3 top-2 text-gray-400 text-xs">%</span>
                    </div>
                  </div>

                  {/* Campo Nota (Score) */}
                  <div className="col-span-3">
                    <label className="md:hidden text-xs font-bold text-gray-500">Nota</label>
                     <input
                        type="number"
                        min="0"
                        max="20"
                        placeholder="0-20"
                        value={notaField.score}
                        // Cambia color a rojo si está reprobado (<10) o verde si aprobado
                        className={`${claseInputComun} text-center font-bold ${notaField.score >= 10 ? 'text-green-700' : 'text-red-700'}`}
                        onChange={(e) => manejarCambioCampo(notaField.id, 'score', e.target.value)}
                        required
                      />
                  </div>

                  {/* Botón Eliminar Fila */}
                  <div className="col-span-1 text-center mt-4 md:mt-0">
                    {notas.length > 1 && (
                      <button
                        type="button"
                        onClick={() => manejarEliminarCampoNota(notaField.id)}  
                        className="text-red-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-full transition"
                        title="Eliminar"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Pie de Tabla: Resumen de totales */}
            <div className="bg-gray-50 p-4 border-t border-gray-200 flex flex-col md:flex-row justify-end items-center gap-4 text-sm">
                {/* Indicador de Suma de Pesos */}
                <div className={`flex items-center gap-2 ${pesoTotal === 100 ? 'text-green-700' : 'text-red-600 font-bold'}`}>
                    <span>Total Peso:</span>
                    <span className="text-lg">{pesoTotal}%</span>
                    {pesoTotal !== 100 && <span className="text-xs bg-red-100 px-2 py-1 rounded">Debe sumar 100%</span>}
                </div>
                
                <div className="h-6 w-px bg-gray-300 hidden md:block"></div>
                
                {/* Indicador de Nota Final calculada */}
                <div className="flex items-center gap-2 font-bold text-gray-800">
                    <span>Nota Final Ponderada:</span>
                    <span className="text-xl bg-white px-3 py-1 border rounded shadow-sm">{esPesoValido ? notaFinal : '--'}</span>
                </div>
            </div>
          </div>

          {/* Botón Final de Guardar */}
          <button 
            type="submit" 
            className={`w-full font-bold py-4 rounded-md shadow-lg transform active:scale-[0.98] transition-all uppercase tracking-widest ${
                !esPesoValido || cargando 
                ? 'bg-gray-400 cursor-not-allowed text-gray-200' 
                : 'bg-[#003366] hover:bg-blue-900 text-white'
            }`}
            disabled={!esPesoValido || cargando}
          >
            {cargando ? 'Guardando Notas...' : 'Guardar Notas'}
          </button>
        </form>
      </div>
    </section>
  );
}

export default ProfesorView;
