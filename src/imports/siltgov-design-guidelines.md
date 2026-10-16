TXT — PROMPT PARA FIGMA MAKE
PROYECTO: SILTGOV — Sistema Integrado de Liquidaciones
Cliente: Gobernación del Valle del Cauca (Colombia)
Tipo: Plataforma web institucional gubernamental
Estilo: Profesional, clásico, sobrio, claro, orientado a adultos

---

1. LINEAMIENTOS GENERALES DE DISEÑO

Estética:

* Diseño limpio, sin exceso de elementos.
* Espacios amplios.
* Tipografía sans-serif profesional (ej. Inter, Roboto o similar).
* Bordes suaves (4–8px).
* Sombras ligeras.
* Iconografía simple tipo outline.
* Sin animaciones llamativas.
* Diseño accesible y legible.

Estándares:

* Seguir principios de Material Design 3 o sistema similar.
* Cumplir buenas prácticas WCAG (contraste alto).
* Usar grid 8px.
* Formularios alineados verticalmente.
* Estados visibles: hover, focus, disabled.
* Indicadores de carga (spinner centrado).
* Notificaciones tipo toast:

  * Verde: éxito
  * Dorado: advertencia
  * Azul: información
  * Rojo tenue: error

Colores institucionales:

* Azul primario: #1C5BB8 (botones principales, navbar, encabezados)
* Verde: #34A853 (estado exitoso, confirmaciones)
* Dorado: #FBBC05 (alertas, pendientes)
* Blanco: #FFFFFF (fondo claro)
* Gris oscuro: #1F2937 (texto principal)
* Gris claro neutro para fondos secundarios

Modo claro por defecto.

---

2. ESTRUCTURA GENERAL

Navbar superior fijo:

* Logo SILTGOV (izquierda)
* Nombre del sistema
* Rol del usuario (visible)
* Ícono de notificaciones
* Ícono de perfil (dropdown: Mi perfil, Cerrar sesión)

Sidebar lateral (según rol):

* Íconos + texto
* Azul institucional
* Sección activa resaltada

Footer:

* FAQ
* Términos y Condiciones (obligatorio aceptar en primer ingreso)
* Manual de Usuario
* Sobre Nosotros
* Línea de Atención Superusuarios
* Enlace a formulario PSQR

---

3. PÁGINAS COMUNES

Pantalla de carga:

* Fondo blanco
* Logo centrado
* Spinner azul
* Texto: “Cargando información…”

Notificaciones:

* Toast superior derecha
* Auto cierre 4 segundos

Perfil (todos los roles):
Campos:

* Nombre completo
* Documento
* Correo institucional
* Número de contacto
* Cargo
* Cambiar contraseña
  Botón Guardar Cambios

---

4. AUTENTICACIÓN

Login:

* Correo
* Contraseña
* Botón Ingresar
* Enlace: Recuperar contraseña
* Aceptar términos (checkbox obligatorio)

Recuperar contraseña:

* Correo
* Botón Enviar enlace
* Confirmación de envío

2FA opcional (campo código TOTP si aplica).

---

5. SUPERUSUARIO

Menú:

* Departamentos
* Entidades
* Oficinas
* Administradores
* Auditoría
* PSQR

Puede:

* Crear/editar/eliminar departamentos
* Crear/editar entidades
* Crear oficinas
* Crear administradores
* Ver logs (solo lectura, filtro por fecha y usuario)

Formularios simples:

* Nombre
* Código interno
* Responsable
* Estado (Activo/Inactivo)

---

6. ADMINISTRADOR

Menú:

* Dashboard
* Sentencias
* Liquidadores
* Pagadores
* Estadísticas

Dashboard:

* Tarjetas:

  * Total Sentencias
  * En Proceso
  * Terminadas
  * Pagadas
* Tabla últimas sentencias

Crear Sentencia:
Campos:

* Número de sentencia
* Fecha fallo
* Juzgado
* Demandante
* Documento demandante
* Valor base
* Intereses
* Observaciones
* Adjuntar fallo (PDF)
* Asignar liquidador
* Asignar pagador
* Estado inicial: En proceso

Crear Liquidador:

* Nombre
* Documento
* Correo
* Oficina
* Estado

Crear Pagador:

* Nombre
* Documento
* Correo
* Oficina
* Estado

Estadísticas:

* Total sentencias mes actual
* Terminadas mes actual
* Pagadas mes actual
* Tiempo promedio:

  * Creación → Terminada
  * Terminada → Pagada
    Gráficos simples (barras).

---

7. LIQUIDADOR

Menú:

* Mis Sentencias
* Procesar Liquidación

Lista:

* Filtro por estado
* Tabla con:

  * Número sentencia
  * Fecha asignación
  * Estado

Procesar Liquidación:
Campos:

* Valor reconocido
* Intereses calculados
* Costas
* Deducciones
* Valor final liquidado
* Observaciones técnicas

Botones:

* Guardar borrador
* Marcar como Terminada
* Generar PDF

Sección Generar PDF:

* Vista previa
* Botón Descargar PDF
* PDF con logo institucional y datos completos

Estado cambia a: Terminada

---

8. PAGADOR

Menú:

* Sentencias Terminadas
* Historial Pagadas

Vista Terminadas:
Tabla:

* Número sentencia
* Liquidador
* Valor final
* Fecha terminada

Acción:

* Subir soporte de pago (PDF)
* Número de comprobante
* Fecha de pago
* Observaciones

Botón:

* Marcar como Pagada

Vista Pagadas:

* Tabla histórica
* Filtros por fecha

Estado cambia a: Pagada

---

9. ESTADOS DE SENTENCIA

* En proceso (azul)
* Terminada (verde)
* Pagada (gris oscuro)
* Pendiente información (dorado)

---

10. SEGURIDAD Y SENSACIÓN VISUAL

El diseño debe transmitir:

* Formalidad gubernamental
* Seguridad
* Orden
* Claridad jerárquica
* Confianza

Evitar:

* Colores saturados
* Elementos decorativos innecesarios
* Ilustraciones informales

Interfaz centrada en productividad.

---

FIN DEL PROMPT
Diseñar todo consistente, modular, reutilizable y escalable.
