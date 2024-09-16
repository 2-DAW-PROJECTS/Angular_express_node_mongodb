# 🚀 Proyecto JobHunt - ¡El InfoJobs que siempre quisiste!

¡Bienvenido a **JobHunt**! 🎯 Este es un proyecto súper emocionante para crear una plataforma de búsqueda de empleo usando tecnología full-stack. Si te encanta el desarrollo web moderno y quieres ayudar a los usuarios a encontrar el trabajo de sus sueños (o simplemente ganar un poco de dinerillo), ¡este proyecto es para ti!

## 🌟 Tecnologías Utilizadas

Para darle vida a esta maravilla, estamos usando un combo poderoso:

### Backend (El cerebro 🧠)
- **Node.js**: Nuestra base para hacer que el servidor corra como un Ferrari.
- **Express.js**: Para crear APIs RESTful y ser la mente maestra detrás de las rutas.
- **MongoDB**: La base de datos no relacional que guarda toda la info de los usuarios, empleos, y mucho más.
- **Mongoose ODM**: Para que trabajar con MongoDB sea pan comido.

### Frontend (La cara bonita 😎)
- **Angular 17**: Para crear una SPA (Single Page Application) que cargue rapidito y sea súper interactiva.
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
  
### 2. Frontend (Cliente 🌐)
- **Directorio**: `client`
- El lugar donde la magia del diseño y la funcionalidad se encuentran.
- **Responsabilidades**:
  - Mostrar las ofertas de trabajo, permitir a los usuarios crear perfiles y postularse a trabajos.
  - Consumir la API del backend con estilo y frescura.

## 📂 Backend en Detalle

Nuestro backend es como un chef de datos. Así que, ¿qué hay en la cocina?

- `server.js`: El gran jefe que pone en marcha el servidor Express y la conexión a la base de datos.
- `models/`: Donde definimos los esquemas de los datos, como usuarios, ofertas de trabajo, etc., usando Mongoose.
- `routes/`: Aquí están las rutas API que deciden a qué endpoint van los datos y cómo los manejamos.
- `controllers/`: La lógica detrás de cada solicitud, ¡donde hacemos magia con los datos!

## 🎨 Frontend en Detalle

El frontend es donde todo se ve bonito y fluye. Aquí tienes lo que compone nuestro **JobHunt**:

- `src/app/components/`: Componentes Angular como el buscador de empleos, el formulario de registro y la lista de trabajos.
- `src/app/services/`: Servicios que manejan las llamadas HTTP a nuestra API backend. ¡Un servicio para cada operación!
- `src/app/models/`: Definimos las interfaces de TypeScript para que los datos estén bien organizados.

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
- Este proyecto es la mezcla perfecta de tecnología moderna con un propósito noble: ¡ayudar a la gente a encontrar su próximo empleo!

###### ¡Nos vemos en la búsqueda de talento! 🚀💼

