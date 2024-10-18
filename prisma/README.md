# 🚀 Express-Prisma Dashboard Backend

¡Bienvenido al repositorio más emocionante del lado oscuro del backend! 🌚

## 🎭 ¿Qué es esto?

Este proyecto es como un sándwich de tecnología: una capa crujiente de Express, relleno cremoso de Prisma, y un toque picante de Dashboard. ¡Delicioso para los desarrolladores hambrientos de código!

## 🛠 Características

- Express: Porque a veces, el camino rápido es el mejor camino.
- Prisma: Haciendo que las bases de datos se sientan como mantequilla suave.
- Dashboard: Para que puedas presumir tus datos como todo un jefe.

## 🏃‍♂️ Cómo empezar

1. Clona este repo (si puedes manejarlo 😉)
2. `npm install` (cruza los dedos)
3. Configura tu base de datos (no te preocupes, Prisma hace la magia)
4. `npm run dev` y ¡BOOM! 🎉

## 🧙‍♂️ Comandos mágicos

- `npm run build`: Construye el proyecto más rápido que puedes decir "¡Expecto Patronum!"
- `npm start`: Inicia el servidor. ¡Que la fuerza te acompañe!
- `npm run prisma:generate`: Genera los tipos de Prisma. Es como invocar un hechizo, pero más nerd.

## 🚀 Probando con Postman

1. Abre Postman y crea una nueva solicitud.
2. Configura el método HTTP (GET, POST, PUT, DELETE) según la ruta que quieras probar.
3. Ingresa la URL base de tu servidor local (por ejemplo, `http://localhost:3000`).
4. Añade la ruta específica que deseas probar (por ejemplo, `/users`).
5. Si es necesario, configura los headers (como Content-Type: application/json).
6. Para métodos POST o PUT, añade el body de la solicitud en formato JSON.
7. Haz clic en "Send" y observa la magia suceder en la respuesta.

## 📚 Documentación de la API   

### Usuarios

#### GET /users
- Descripción: Obtiene todos los usuarios
- Respuesta: Array de objetos de usuario

#### GET /users/:id
- Descripción: Obtiene un usuario específico por ID
- Parámetros: 
  - id: ID del usuario
- Respuesta: Objeto de usuario

#### POST /users
- Descripción: Crea un nuevo usuario
- Body: 
  
  {
    "name": "Nombre del usuario",
    "email": "correo@ejemplo.com",
    "password": "contraseña123"
  }
  
- Respuesta: Objeto del usuario creado

#### PUT /users/:id
- Descripción: Actualiza un usuario existente
- Parámetros:
  - id: ID del usuario
- Body: 
  
  {
    "name": "Nuevo nombre",
    "email": "nuevo@correo.com"
  }
  
- Respuesta: Objeto del usuario actualizado

#### DELETE /users/:id
- Descripción: Elimina un usuario
- Parámetros:
  - id: ID del usuario
- Respuesta: Mensaje de confirmación

### Productos

#### GET /products
- Descripción: Obtiene todos los productos
- Respuesta: Array de objetos de producto

#### GET /products/:id
- Descripción: Obtiene un producto específico por ID
- Parámetros:
  - id: ID del producto
- Respuesta: Objeto de producto

#### POST /products
- Descripción: Crea un nuevo producto
- Body:
  
  {
    "name": "Nombre del producto",
    "price": 19.99,
    "description": "Descripción del producto"
  }
  
- Respuesta: Objeto del producto creado

#### PUT /products/:id
- Descripción: Actualiza un producto existente
- Parámetros:
  - id: ID del producto
- Body:
  
  {
    "name": "Nuevo nombre del producto",
    "price": 29.99
  }
  
- Respuesta: Objeto del producto actualizado

#### DELETE /products/:id
- Descripción: Elimina un producto
- Parámetros:
  - id: ID del producto
- Respuesta: Mensaje de confirmación

### Órdenes

#### GET /orders
- Descripción: Obtiene todas las órdenes
- Respuesta: Array de objetos de orden

#### GET /orders/:id
- Descripción: Obtiene una orden específica por ID
- Parámetros:
  - id: ID de la orden
- Respuesta: Objeto de orden

#### POST /orders
- Descripción: Crea una nueva orden
- Body:
  
  {
    "userId": 1,
    "products": [
      { "productId": 1, "quantity": 2 },
      { "productId": 3, "quantity": 1 }
    ]
  }
  
- Respuesta: Objeto de la orden creada

#### PUT /orders/:id
- Descripción: Actualiza el estado de una orden
- Parámetros:
  - id: ID de la orden
- Body:
  
  {
    "status": "enviado"
  }
  
- Respuesta: Objeto de la orden actualizada

#### DELETE /orders/:id
- Descripción: Cancela una orden
- Parámetros:
  - id: ID de la orden
- Respuesta: Mensaje de confirmación


¡Recuerda revisar la documentación de la API para conocer todas las rutas disponibles y sus requerimientos!

## 🐛 Encontraste un bug?

¡Felicidades! Has descubierto una característica no documentada. Abre un issue y te daremos una galleta virtual. 🍪

## 📜 Licencia

Para copiar este proyecto preguntame primero. Básicamente, haz lo que quieras, pero no nos culpes si tu ordenador explota.

¡Tenga usted un buen dia! 💻✨
