# 🚀 TypeORM Prisma Express Dashboard-POSTMAN 🎉

¡Bienvenido a tu increíble proyecto de Dashboard con TypeORM, Express y Postman! Este README te guiará a través de cómo funciona todo, cómo ponerlo en marcha y cómo testearlo en Postman. ¡Vamos allá! 🎢

## 📚 Descripción del Proyecto

Este proyecto es una API RESTful construida con Express y TypeORM, que te permite gestionar publicaciones y administradores de usuarios. Utiliza MongoDB como base de datos y está configurado para ser fácil de extender y mantener. ¡Perfecto para tus aventuras de desarrollo! 🛠️

## 🏗️ Estructura del Proyecto

Aquí tienes una visión general de la estructura del proyecto:

```bash
📁 
├── 📄 .env
├── 📄 .gitignore
├── 📄 ormconfig.json
├── 📄 package.json
├── 📄 save_ormconf.txt
├── 📁 src
│   ├── 📄 app.ts
│   ├── 📁 config
│   │   ├── 📄 database.ts
│   ├── 📁 Post
│   │   ├── 📁 dto
│   │   │   ├── 📄 createPost.dto.ts
│   │   ├── 📄 Post.controller.ts
│   │   ├── 📄 post.entity.ts
│   │   ├── 📄 Post.routes.ts
│   │   ├── 📄 Post.service.ts
│   ├── 📁 userAdmin
│   │   ├── 📁 dto
│   │   │   ├── 📄 createUserAdmin.dto.ts
│   │   │   ├── 📄 login-user.dto.ts
│   │   │   ├── 📄 update-user.dto.ts
│   │   │   ├── 📄 index.ts
│   │   ├── 📄 userAdmin.controller.ts
│   │   ├── 📄 userAdmin.entity.ts
│   │   ├── 📄 userAdmin.routes.ts
│   │   ├── 📄 userAdmin.service.ts
├── 📄 tsconfig.json
```

## 🚀 Puesta en Marcha

¡Vamos a poner esto en marcha! Sigue estos sencillos pasos:

1. **Clona el repositorio:**

    ```sh
    git clone https://github.com/JavierTomasTormo/TypeORM_Express_Dashboard-POSTMAN
    cd tu-repositorio
    ```

2. **Instala las dependencias:**

    ```sh
    npm install
    ```

3. **Configura las variables de entorno:**

    Crea un archivo [`.env`](command:_github.copilot.openRelativePath?%5B%7B%22scheme%22%3A%22file%22%2C%22authority%22%3A%22%22%2C%22path%22%3A%22%2FC%3A%2FUsers%2Fjavie%2FDesktop%2FTypeORM_Prisma_Express_Dashboard-POSTMAN%2F.env%22%2C%22query%22%3A%22%22%2C%22fragment%22%3A%22%22%7D%2C%221d25945e-12c0-4f90-b913-68f280c2d8f3%22%5D "c:\Users\javie\Desktop\TypeORM_Prisma_Express_Dashboard-POSTMAN\.env") en la raíz del proyecto y añade tus variables de entorno:

    ```env
    DB_TYPE=mongodb
    DATABASE_URL=mongodb://localhost:27017/mydatabase
    ```

4. **Inicia la aplicación:**

    ```sh
    npm start
    ```

    ¡Y voilà! Tu servidor debería estar corriendo en `http://localhost:3000`. 🎉

## 🧪 Testeando con Postman

¡Ahora viene la parte divertida! Vamos a testear nuestra API con Postman. Aquí tienes las rutas disponibles:

### 📬 Rutas de Publicaciones

- **Crear una publicación:**

    `POST /posts`

    ```json
    {
        "title": "Mi primera publicación",
        "content": "¡Hola mundo!"
    }
    ```

- **Obtener todas las publicaciones:**

    `GET /posts`

- **Obtener una publicación por ID:**

    `GET /posts/:id`

- **Actualizar una publicación por ID:**

    `PUT /posts/:id`

    ```json
    {
        "title": "Título actualizado",
        "content": "Contenido actualizado"
    }
    ```

- **Eliminar una publicación por ID:**

    `DELETE /posts/:id`

### 👥 Rutas de Administradores de Usuarios

- **Crear un administrador de usuario:**

    `POST /users`

    ```json
    {
        "name": "Admin",
        "email": "admin@example.com"
    }
    ```

- **Obtener todos los administradores de usuarios:**

    `GET /users`

- **Obtener un administrador de usuario por ID:**

    `GET /users/:id`

- **Actualizar un administrador de usuario por ID:**

    `PUT /users/:id`

    ```json
    {
        "name": "Admin Actualizado",
        "email": "admin.actualizado@example.com"
    }
    ```

- **Eliminar un administrador de usuario por ID:**

    `DELETE /users/:id`

## 🛠️ Tecnologías Utilizadas

- **Express:** Framework de Node.js para construir APIs.
- **TypeORM:** ORM para manejar la base de datos.
- **MongoDB:** Base de datos NoSQL.
- **TypeScript:** Superconjunto de JavaScript que añade tipos estáticos.
- **Postman:** Herramienta para testear APIs.

## 🎉 Contribuciones

¡Las contribuciones son bienvenidas! Siéntete libre de abrir issues o pull requests. ¡Vamos a hacer este proyecto aún más increíble juntos! 🚀

---
#### En el caso de dockerizar esto enviamelo, asi no tengo que hacerlo yo ;-)
¡Gracias por usar este proyecto! Si tienes alguna pregunta, no dudes en abrir un issue. ¡Feliz dia! 😄
