# SOC-PYME

Prototipo web de un Centro de Operaciones de Ciberseguridad para pequenas y medianas empresas.

El proyecto presenta una experiencia simulada de monitoreo SOC, autenticacion por roles y paneles operativos para administrador, usuario/cliente y desarrollador.

## Funcionalidades

- Pagina principal con propuesta de valor, servicios, explicacion del sistema y formulario de contacto.
- Simulador de alertas SOC con eventos de seguridad y contador de ataques bloqueados.
- Login y registro simulados con credenciales de prueba.
- Dashboard por roles con metricas, mapa de calor, reportes, escaneo local, telemetria y generacion de token.

## Estructura

- `index.html`: pagina principal del proyecto.
- `style.css`: estilos de la pagina principal.
- `script.js`: menu movil y simulador de alertas.
- `login.html`: pantalla de autenticacion y registro.
- `login-style.css`: estilos de autenticacion.
- `login-script.js`: validacion simulada y cambio de modo login/registro.
- `dashboard.html`: panel principal por roles.
- `dashboard-style.css`: estilos del dashboard.
- `dashboard.js`: interacciones del panel operativo.

## Credenciales de prueba

| Rol | Correo | Contrasena |
| --- | --- | --- |
| Administrador | `admin@socpyme.com` | `SocAdmin#2026` |
| Desarrollador | `dev@socpyme.com` | `SocDev#2026` |
| Usuario / Cliente | `usuario@socpyme.com` | `SocUser#2026` |

## Ejecutar localmente

Instala dependencias:

```bash
npm install
```

Inicia el servidor local:

```bash
npm run dev
```

Revisa la sintaxis de los archivos JavaScript:

```bash
npm run check
```

## Estado

Este repositorio funciona como demo educativa y de presentacion. La autenticacion, los reportes, el monitoreo y las respuestas de seguridad son simulados en el navegador.
