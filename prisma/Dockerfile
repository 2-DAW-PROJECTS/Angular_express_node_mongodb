# Dockerfile de Prisma
FROM node:20

# Establecer el directorio de trabajo
WORKDIR /home/node/app

# Copiar los archivos de configuración de npm primero para aprovechar el cache
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar solo la carpeta de Prisma y generar el cliente
COPY prisma ./prisma
RUN npx prisma generate

# Copiar el resto de los archivos de la aplicación
COPY . .

# Compilar el proyecto si es necesario
RUN npm run build

# Exponer el puerto en el que se ejecutará la aplicación
EXPOSE 3000

# Comando para iniciar la aplicación
CMD ["node", "dist/index.js"]
