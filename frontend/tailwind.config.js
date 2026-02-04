/** @type {import('tailwindcss').Config} */
export default {
  // --- CONTENT (CONTENIDO) ---
  // Esta sección es CRÍTICA. Le dice a Tailwind: "Busca clases de CSS en estos archivos".
  // Si creas un componente nuevo y sus estilos no salen, es porque la ruta no está aquí.
  content: [
    "./index.html",               // Escanea el HTML principal
    "./src/**/*.{js,ts,jsx,tsx}", // Escanea TODO dentro de la carpeta 'src' (cualquier subcarpeta, cualquier archivo JS/JSX)
  ],

  // --- THEME (TEMA) ---
  // Aquí definimos la apariencia visual personalizada de la app.
  theme: {
    // Usamos 'extend' para AGREGAR cosas nuevas sin borrar las que trae Tailwind por defecto.
    // Si usáramos 'theme' directamente sin 'extend', borraríamos todos los colores originales.
    extend: {
      
      // --- COLORS (COLORES PERSONALIZADOS) ---
      // Aquí definiste la paleta de colores de la UNEXCA.
      // Ahora puedes usarlos en tu HTML como: className="bg-unexca-blue" o "text-unexca-light"
      colors: {
        'unexca-blue': '#003366',  // Azul Oscuro Institucional (Usado en headers)
        'unexca-bg': '#eef1f5',    // Gris muy claro (Usado para el fondo de la pantalla)
        'unexca-light': '#0056b3', // Azul un poco más claro (Para hovers o detalles)
      },
    },
  },

  // --- PLUGINS ---
  // Aquí se agregan extensiones si quisieras usar formularios avanzados o tipografía extra.
  // Por ahora está vacío, lo cual está bien.
  plugins: [],
}