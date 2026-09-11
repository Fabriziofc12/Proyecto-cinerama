<img width="1362" height="1166" alt="image" src="https://github.com/user-attachments/assets/d585a43f-7ecf-4243-a184-3a6934243d81" /># Proyecto-cinerama - Web Application

Sistema web completo para una cadena de cines que permite a los usuarios explorar la cartelera de películas, consultar sedes, filtrar funciones por ciudad y fecha, y realizar la reserva e interactuar con el mapa interactivo de asientos en tiempo real.

---

## 🚀 características Principales

* **Cartelera con Filtros Dinámicos:** Búsqueda de películas por ciudad, cine, fecha, género, idioma y formato (2D/3D).
* **Detalle de Película:** Información completa con sinopsis, clasificación por edad, formato de audio y tráiler.
* **Directorio de Cines:** Consulta de sedes disponibles agrupadas por ciudad y formatos habilitados.
* **Gestión de Horarios y Funciones:** Visualización en tiempo real de los bloques de horarios de proyección por película y cine.
* **Selección Interactiva de Asientos:** Mapa visual de la sala con estados en vivo (*Disponible*, *Seleccionado*, *Ocupado*).
* **Cálculo Automático de Precios:** Resumen detallado de la compra antes de confirmar la reserva.

---

## 🛠️ Tecnologías Utilizadas

* **Frontend:** Single Page Application (React / HTML5 / CSS3 / TypeScript / JavaScript).
* **Backend:** REST API (Java con Spring Boot).
* **Base de Datos:** PostgreSQL.

* Requisitos Previos
Antes de ejecutar este proyecto, asegúrate de tener instalado:

- Java JDK 17 o superior
- Node.js (v18+) & npm / yarn
- PostgreSQL (v14+)

🗄️ Estructura de la Base de Datos
ciudades: Almacena las ciudades disponibles.

- cines: Registra los cines asociados a una ciudad (ciudad_id).
- salas: Define las salas de cada cine (cine_id).
- asientos: Contiene las butacas asignadas a cada sala (sala_id).
- peliculas: Información general de las películas (título, sinopsis, tráiler, estreno).
- generos, idiomas, formatos: Tablas maestras para los filtros de búsqueda.
- pelicula_generos, pelicula_idiomas, pelicula_formatos: Tablas intermedias para asociar filtros a películas.
- funciones: Programa los horarios de proyección relacionando película, sala, formato e idioma.
- usuarios: Almacena las cuentas de los usuarios registrados.
- reservas: Registra las compras realizadas por usuarios o invitados (funcion_id, monto_total).
- detalle_reservas: Asigna las asientos específicos comprados dentro de una reserva.

