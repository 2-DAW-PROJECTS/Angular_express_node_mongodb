# 🚀 Proyecto JobHunt - ¡El InfoJobs que siempre quisiste!

¡Bienvenido a **JobHunt**! 🎯 Este es un proyecto súper emocionante para crear una plataforma de búsqueda de empleo usando tecnología full-stack. Si te encanta el desarrollo web moderno y quieres ayudar a los usuarios a encontrar el trabajo de sus sueños (o simplemente ganar un poco de dinerillo), ¡este proyecto es para ti!

## 🌟 Tecnologías Utilizadas

Para darle vida a esta maravilla, estamos usando un combo poderoso:

### Backend (El cerebro 🧠)
- **Node.js**: Nuestra base para hacer que el servidor corra como un Ferrari.
- **Express.js**: Para crear APIs RESTful y ser la mente maestra detrás de las rutas.
- **MongoDB**: La base de datos no relacional que guarda toda la info de los usuarios, empleos, y mucho más.
- **Mongoose ODM**: Para que trabajar con MongoDB sea pan comido.
- **JWT (JSON Web Tokens):** Implementación de tokens para la autenticación de usuarios de forma segura y eficiente.
- **Argon2:** Para el hashing seguro de contraseñas. Es la alternativa moderna y más segura que bcrypt, asegurando que las contraseñas estén bien protegidas.

### Frontend (La cara bonita 😎)
- **Angular 18**: Para crear una SPA (Single Page Application) que cargue rapidito y sea súper interactiva.
- **TypeScript**: Para que el código sea elegante y menos propenso a errores.
- **HTML/CSS**: Porque, aunque todo sea magia JavaScript, ¡todavía necesitamos ver algo bonito en el navegador!

## 🎨 Estructura del Proyecto

Este proyecto está dividido en dos bloques:

### 1. Backend (Servidor 🚀)
- **Directorio**: `server`
- Aquí es donde construimos la API que maneja los datos de ofertas de empleo, perfiles de usuario, ¡y todo lo demás! 
- **Responsabilidades**:
  - Gestionar las operaciones CRUD (Crear, Leer, Actualizar, Eliminar) de los trabajos.
  - Conectar con MongoDB para guardar toda la info sobre usuarios y trabajos.
  - Autenticar usuarios de manera segura usando JWT.
  - Proteger las contraseñas con Argon2 para un almacenamiento seguro.
  
### 2. Frontend (Cliente 🌐)
- **Directorio**: `client`
- El lugar donde la magia del diseño y la funcionalidad se encuentran.
- **Responsabilidades**:
  - Mostrar las ofertas de trabajo, permitir a los usuarios crear perfiles y postularse a trabajos.
  - Consumir la API del backend con estilo y frescura.
  - Manejar la autenticación de usuarios utilizando JWT para sesiones seguras.

## 📂 Backend en Detalle

Nuestro backend es como un chef de datos. Así que, ¿qué hay en la cocina?

- `server.js`: El gran jefe que pone en marcha el servidor Express y la conexión a la base de datos.
- `models/`: Donde definimos los esquemas de los datos, como usuarios, ofertas de trabajo, etc., usando Mongoose.
- `routes/`: Aquí están las rutas API que deciden a qué endpoint van los datos y cómo los manejamos.
- `controllers/`: La lógica detrás de cada solicitud, ¡donde hacemos magia con los datos!
### Autenticación y Seguridad 🔒

¡Porque no queremos que nadie entre sin permiso! Aquí es donde Argon2 y JWT se unen para proteger tus rutas privadas como si fuera una bóveda.

#### Argon2 🛡️
Cuando creamos o actualizamos usuarios, sus contraseñas se encierran bajo siete llaves con **Argon2**, un algoritmo de hashing tan robusto que haría sudar hasta al más astuto hacker.

#### JWT 🎫
Para mantener el control en las rutas privadas, generamos y validamos tokens **JWT** (el pase VIP de las sesiones de usuario). Sin este ticket, nadie entra.

#### Flujo de Autenticación 🌀
Aquí te cuento cómo funciona todo esto:

##### Registro de usuario 📝
1. El usuario se registra con su correo y una contraseña (original, ¿no? 😜).
2. Antes de guardar la contraseña, la pasamos por Argon2 para que quede súper protegida.

##### Login de usuario 🔑
1. El usuario ingresa sus credenciales.
2. Si la contraseña es válida (gracias, Argon2 👏), se genera un **JWT**.
3. A partir de aquí, el JWT es el pasaporte que el usuario usará en cada solicitud posterior. ¡Acceso garantizado!

##### Protección de rutas 🚧
Algunas rutas son sensibles (como crear o eliminar empleos). Solo se puede acceder si el usuario tiene un **JWT** válido. ¡Es como un código secreto para abrir puertas!






## 🎨 Frontend en Detalle

El frontend es donde todo se ve bonito y fluye. Aquí tienes lo que compone nuestro **JobHunt**:

- `src/app/components/`: Componentes Angular como el buscador de empleos, el formulario de registro y la lista de trabajos.
- `src/app/services/`: Servicios que manejan las llamadas HTTP a nuestra API backend. ¡Un servicio para cada operación!
- `src/app/models/`: Definimos las interfaces de TypeScript para que los datos estén bien organizados.

### Autenticación en el Frontend 🖥️

¡Ahora es turno del **frontend** de entrar en acción y trabajar en equipo con el **backend**!

1. **Implementación de login y registro.**  
   Es lo básico: un buen formulario de inicio de sesión y registro donde el usuario deja sus datos. Sin dramas, pero con estilo. 😎

2. **Almacenar el token JWT** en el LocalStorage o SessionStorage del navegador.  
   Piensa en el **JWT** como el pase dorado del usuario, que debes guardar en un lugar seguro (LocalStorage o SessionStorage). ¡No lo pierdas! 🏆

3. **Enviar el JWT** en cada petición HTTP para acceder a las rutas protegidas en el backend.  
   Cada vez que el usuario quiera hacer algo importante, envía el **JWT** junto con la solicitud, como si estuvieras mostrando el boleto en la entrada de un concierto exclusivo. 🎟️ ¡Solo los que tienen el pase entran!



## 🛠️ Cómo Ejecutar el Proyecto (¡Rápido y fácil! 🏃‍♂️💨)

### 1. Iniciar el backend:

```bash
cd server
npm install
node server.js
```

### 2. Iniciar el frontend de Angular:

```bash
cd client
npm install
ng serve --port 8081
```

### 3. Abrir el navegador:
Ve a http://localhost:8081 y ¡disfruta buscando o publicando empleos!

### 🚀 *Funcionalidades Épicas*
- 🔍 `Búsqueda de empleos:` Encuentra ofertas de trabajo según tu ubicación, categoría, o nivel de experiencia.
- 💼 `Publicar empleos:` Si eres reclutador, ¡puedes publicar nuevas ofertas y gestionar tus candidatos!
- 📝 `Editar y actualizar empleos:` Porque a veces los detalles de un empleo cambian.
- 🗑️ `Eliminar empleos:` Adiós a esas ofertas que ya no sirven.
- 👤 `Registro y perfil de usuario:` Los usuarios pueden crear perfiles, subir currículums y postularse a empleos.
- 🔐 `Seguridad:` Autenticación robusta con JWT y almacenamiento seguro de contraseñas con Argon2.
  
- Este proyecto es la mezcla perfecta de tecnología moderna con un propósito noble: ¡ayudar a la gente a encontrar su próximo empleo!

###### ¡Nos vemos en la búsqueda de talento! 🚀💼

