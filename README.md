# Snail Racing

Aplicación web Full-Stack con temática de carreras de caracoles. Incluye registro e inicio de sesión local, un dashboard con estadísticas simuladas, manejo de saldo y un servicio de pagos ficticio llamado SnailPay.

El proyecto fue desarrollado utilizando React, Express y TypeScript.

## Funcionalidades

- Registro de usuarios.
- Inicio y cierre de sesión.
- Hash de contraseñas.
- Persistencia local de la sesión.
- Dashboard protegido para usuarios autenticados.
- Manejo y persistencia del saldo.
- Interfaz responsive para escritorio, tablet y dispositivos móviles.
- Gráfica tipo donut de apuestas ganadas y perdidas.
- Gráfica de barras con las victorias de los caracoles.
- Servicio de pagos simulado SnailPay.
- Simulación de pagos aprobados y rechazados.
- Simulación de errores internos del servicio.
- Manejo de timeout en las solicitudes.
- Persistencia de las respuestas de SnailPay en LocalStorage.
- Pruebas automatizadas del API.

## Tecnologías utilizadas

### Frontend

- React
- TypeScript
- Vite
- Material UI
- Material Icons
- Emotion
- Recharts

### Backend

- Node.js
- Express
- TypeScript
- CORS

### Pruebas

- Vitest
- Supertest

## Estructura del proyecto

```text
edwin-4827/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── data/
│   │   ├── pages/
│   │   ├── types/
│   │   └── utils/
│   └── package.json
│
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   ├── tests/
│   │   ├── app.ts
│   │   └── index.ts
│   └── package.json
│
└── README.md
```

## Requisitos

Para ejecutar el proyecto es necesario tener instalado:

- Node.js
- npm

## Instalación

Clonar el repositorio:

```bash
git clone https://github.com/EdwinGuerreroCortez/edwin-4827.git
cd edwin-4827
```

Instalar las dependencias del frontend:

```bash
cd frontend
npm install
```

Instalar las dependencias del backend:

```bash
cd ../backend
npm install
```

## Ejecución de la aplicación

El frontend y el backend deben ejecutarse al mismo tiempo.

### Backend

Desde la carpeta `backend`:

```bash
npm run dev
```

### Frontend

Abrir otra terminal y, desde la carpeta `frontend`, ejecutar:

```bash
npm run dev
```

Después, abrir en el navegador la dirección local mostrada por Vite.

Normalmente:

```text
http://localhost:5173
```

## Registro e inicio de sesión

La aplicación permite crear una cuenta utilizando:

- Nombre completo.
- Correo electrónico.
- Contraseña.
- Confirmación de contraseña.

Las contraseñas se almacenan utilizando hash.

Después del registro, el usuario puede acceder al dashboard, cerrar sesión e iniciar sesión nuevamente utilizando sus credenciales.

La información del usuario y la sesión se mantienen mediante LocalStorage, por lo que permanecen disponibles después de recargar la página.

Los usuarios nuevos comienzan con un saldo de `$0`.

## Dashboard

El dashboard muestra:

- Nombre del usuario registrado.
- Saldo actual.
- Estadísticas de apuestas ganadas y perdidas.
- Victorias de seis caracoles.
- Seis carreras simuladas durante el día.
- Acceso a la recarga de saldo mediante SnailPay.
- Opción para cerrar sesión.

Los datos de apuestas y carreras son completamente simulados. La aplicación no ejecuta carreras ni permite realizar apuestas reales.

## SnailPay

SnailPay es un servicio de pagos simulado desarrollado en Express.

No se conecta con ninguna pasarela de pagos real y todos los datos de tarjeta utilizados en la aplicación deben ser ficticios.

### Pago aprobado

Para simular una operación aprobada se deben utilizar los siguientes datos ficticios:

| Campo | Valor |
| --- | --- |
| Número de tarjeta | `1234123412341234` |
| Fecha de vencimiento | `12/26` |
| CVV | `543` |
| Nombre completo | Cualquier valor no vacío |
| Monto | Cualquier cantidad mayor que `0` |

Cuando la operación es aprobada:

- SnailPay devuelve una respuesta exitosa.
- El saldo del usuario aumenta.
- El nuevo saldo se guarda en LocalStorage.
- El dashboard muestra inmediatamente el saldo actualizado.
- La respuesta de la transacción se almacena en LocalStorage.

### Tarjeta rechazada

Para simular una tarjeta rechazada puede utilizarse una tarjeta ficticia diferente de la tarjeta aprobada y de las tarjetas reservadas para otros escenarios.

Ejemplo:

```text
1111111111111111
```

La operación será rechazada y el saldo del usuario no será modificado.

### Datos de tarjeta inválidos

También es posible utilizar el número de tarjeta válido:

```text
1234123412341234
```

con una fecha de vencimiento o CVV incorrectos.

SnailPay rechazará la operación y el saldo permanecerá sin cambios.

### Información de pago inválida

El servicio también rechaza solicitudes con información inválida, por ejemplo:

- Nombre completo vacío.
- Monto igual o menor que cero.

En estos casos no se realiza ninguna recarga.

### Error interno de SnailPay

Para simular un problema interno del servicio se utiliza la siguiente tarjeta ficticia:

```text
9999999999999999
```

SnailPay responde con un error interno y la recarga no se aplica.

El saldo del usuario permanece sin cambios.

### Timeout

Para simular una respuesta lenta del servicio se utiliza la siguiente tarjeta ficticia:

```text
8888888888888888
```

El backend retrasa intencionalmente la respuesta.

El frontend tiene configurado un tiempo máximo de espera y cancela la solicitud cuando este tiempo es superado, mostrando un mensaje de timeout al usuario.

El saldo no se modifica.

## Respuestas de SnailPay

Las respuestas generadas por SnailPay contienen información como:

- Identificador de la operación.
- Estado de la operación.
- Detalle del estado.
- Monto solicitado.
- Fecha de creación.
- Código de autorización cuando corresponde.
- Referencia de la operación.
- Identificador del usuario.
- Correo electrónico del usuario.
- Número de tarjeta ficticio.
- CVV ficticio.

El número de tarjeta y el CVV también se almacenan dentro de la información de la transacción en LocalStorage.

> Todos los números de tarjeta y CVV utilizados en este proyecto son ficticios y se utilizan únicamente para simular el comportamiento del servicio.

## LocalStorage

La aplicación utiliza LocalStorage como mecanismo de persistencia local.

Se almacena principalmente:

- Información de los usuarios registrados.
- Saldo de cada usuario.
- Identificador de la sesión activa.
- Respuestas de las transacciones realizadas mediante SnailPay.

Esto permite conservar el perfil, la sesión y el saldo después de recargar la aplicación.

## Pruebas automatizadas

Las pruebas automatizadas del API de SnailPay fueron desarrolladas utilizando Vitest y Supertest.

Actualmente se prueban los siguientes escenarios:

- Pago aprobado.
- Tarjeta rechazada.
- Datos de tarjeta incorrectos.
- Error interno de SnailPay.
- Monto de pago inválido.
- Nombre completo vacío.

Para ejecutar las pruebas:

```bash
cd backend
npm test
```

Resultado esperado:

```text
Test Files  1 passed
Tests       6 passed
```

## Build de producción

Para comprobar el build del frontend:

```bash
cd frontend
npm run build
```

Para compilar el backend:

```bash
cd backend
npm run build
```

## Diseño responsive

La interfaz fue diseñada para adaptarse a diferentes tamaños de pantalla, incluyendo escritorio, tablet y dispositivos móviles.

Se utilizó Material UI como librería de componentes y sistema visual, junto con un tema personalizado para mantener consistencia en colores, tipografía, componentes y estados de interacción.

Para las gráficas del dashboard se utilizó Recharts.

## Consideraciones

La aplicación utiliza LocalStorage de manera intencional como mecanismo de persistencia.

SnailPay es completamente simulado y no procesa pagos reales. Los datos relacionados con tarjetas y CVV deben ser siempre ficticios.