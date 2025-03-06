# Etapa de construcción (build stage)
FROM node:14-alpine as build

# Crea un directorio de trabajo en la imagen
WORKDIR /app

# Copia los archivos necesarios para instalar dependencias
COPY package.json package-lock.json ./

# Instala dependencias
RUN npm install

# Copia el resto del código
COPY . .

# Compila la aplicación (genera la carpeta 'build')
RUN npm run build

# Etapa de producción (production stage)
FROM nginx:alpine

# Copia la configuración personalizada de Nginx
# Asegúrate de tener un archivo "default.conf" en el mismo directorio que este Dockerfile
COPY default.conf /etc/nginx/conf.d/default.conf

# Copia la carpeta 'build' generada en la etapa anterior al directorio donde Nginx sirve los archivos
COPY --from=build /app/build /usr/share/nginx/html

# Expone el puerto 80
EXPOSE 80

# Inicia Nginx
CMD ["nginx", "-g", "daemon off;"]
