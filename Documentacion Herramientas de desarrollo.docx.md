**Link del repositorio:** [https\://github.com/Fabriziofc12/Proyecto-cinerama.git](https://github.com/Fabriziofc12/Proyecto-cinerama.git)

**Problemática que resuelve**

- El sitio web actual es bastante sencillo, consiste en poder mostrar la cartelera por cada cine, sin embargo, es estático, no muestra variaciones ni horarios diferentes, no se puede reservar un asiento, ni comprar entradas.

**Tecnologías utilizadas para el desarrollo del proyecto**

- React (Matheus y Anthony)
- Spring boot (Marcelo y daniela)
- PostgreSQL (fabrizio)
- Docker (fabrizio)
- Hibernate (Marcelo y daniela)

**Alcance del proyecto**

Este proyecto se implementará una sección para ver la cartelera dependiendo del cine o ciudad, otra sección será la compra y reserva de asientos para una función específica.

**Organización para el avance del proyecto**

- **Estructura del nombre para identificar una versión cada que subamos código**\<nombre del que modificó\>: \<qué Tipo de modificación que hizo\>
- **Nombres de las ramas**

| Integrante                                    | Nombre de las ramas |
| --------------------------------------------- | :-----------------: |
| **Salin Fabrizio Flores Condori**       |   **Salin**   |
| **Anthony Carlos De La Cruz**           |  **Anthony**  |
| **Daniela Alejandra Astohuaman Espino** |  **Daniela**  |
| **Marcelo Alessandro Herrera Farfan**   |  **Marcelo**  |
| **Matheus Manolo Chavez Fernandez**     |  **Matheus**  |

**Capturas de pantalla**

1. **El repositorio en GitHub con el nombre del proyecto, la descripción, y los integrantes agregados como colaboradores.**
2. **El archivo README del proyecto está visible en la página del repositorio.![][image4]![][image5]**
3. **El listado de subidas de código (commits), donde se vea que todos los integrantes subieron parte de su proyecto, no sólo uno.**
4. **El listado de ramas del proyecto: la rama principal más las ramas donde cada uno trabajó.![][image8]![][image9]**
5. **La prueba de un conflicto resuelto: una captura donde se vean los símbolos que Git pone cuando dos versiones chocan, y otra captura donde se vea que ya lo arreglaron y unieron el código.**

![][image12]

![][image13]

**Herramientas de colaboración de equipo**

El espacio de comunicación del grupo (Discord, Slack, Microsoft Teams u otro) con canales separados por tema, donde se vea cómo coordinan el trabajo.![][image14]![][image15]

![][image16]

Una solicitud de unión de código (Pull Request) hecha por un integrante y revisada por otro, donde se vea al menos un comentario de revisión y la aprobación antes de unirla a la rama principal.

![][image17]

![][image18]![][image19]

**Herramientas de gestión de actividades**

Las tareas del avance registradas en Jira, tablero Kanban con columnas como Por hacer, En proceso, En revisión y Terminado, y las tareas repartidas entre ellas.

La vista del tablero agrupada por responsable, donde se vea que todos los integrantes tienen tareas asignadas, no sólo uno.

**Herramientas de entrega continua**

La configuración de la publicación automática conectada al repositorio (GitHub Pages, Vercel, Netlify, Render, Railway u otra, según la tecnología del proyecto).

![][image20]

El historial de publicaciones (deploys), donde se vea que el proyecto se publicó solo después de unir cambios a la rama principal.

![][image21]

El proyecto funcionando en internet con su enlace público, por ahora puede ser sólo frontend.

Una versión etiquetada del proyecto (release v0.2.0) con la descripción de lo que cambió en este avance.

README actualizado con el enlace del proyecto publicado y lo que se agregó en este avance.

![][image22]

**Proyecto Final (Avance 3\)**

**Sistemas de seguimiento de incidentes**

* La lista de issues con sus etiquetas de tipo y de prioridad, donde se vea que los responsables son distintos integrantes, no solo uno.![][image23]
* Un issue con la descripción completa y un comentario donde justifiquen por qué le asignaron esa prioridad.![][image24]

  ![][image25]

  ![][image26]
* La plantilla de reporte de error: el archivo dentro del repositorio y el formulario que aparece al pulsar New issue.![][image27]
* El pull request con Closes \#n y el issue cerrado de forma automática y enlazado a ese pull request.
  ![][image28]

  ![][image29]

**Herramientas de integración continua**

* El archivo .yml del workflow dentro del repositorio, con una frase que explique qué hace cada paso.![][image30]
* La pestaña Actions con varias ejecuciones del workflow, disparadas por los push de distintos integrantes.![][image31]
* Una ejecución fallida (en rojo) con el detalle del paso que falló y, luego, la misma ejecución corregida (en verde), para demostrar que el flujo detectó el error a tiempo.![][image32]
* Un pull request donde se vea el check del workflow aprobado antes de unirlo a la rama principal.

![][image33]

**Registro del avance de integración continua y release v0.3.0**

- El PR #26, que habilitó el workflow de calidad en la rama `ANTHONY`, se fusionó en `develop`.
- El PR #27 prepara el README con badges y el resumen del avance v0.3.0, y ajusta los workflows para que verifiquen las ramas del equipo. Está dirigido a `develop`.
- Al integrar los cambios de #26 en la rama del PR #27 aparecieron conflictos en `.github/workflows/frontend-quality.yml` y `FRONTEND/eslint.config.js`. Se resolvieron conservando la ejecución en push, los PR hacia `main`, `master` y `develop`, la ejecución manual y las reglas de ESLint para JavaScript y TypeScript.
- Después de actualizar la rama, se deben volver a ejecutar y revisar los checks de GitHub Actions antes de fusionar el PR #27.
- La etiqueta `v0.3.0` se creó sobre el commit `622e092` del PR #27, antes de integrar los cambios de #26. Para que la release represente exactamente la versión final de `develop`, se debe volver a apuntar la etiqueta al commit integrado después de fusionar #27, especialmente si se utiliza *squash merge*.
