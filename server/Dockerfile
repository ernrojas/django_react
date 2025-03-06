# Usa una imagen base de Python 3.11
FROM python:3.11-slim

# Evita la generación de archivos .pyc y fuerza la salida sin buffer
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Define el directorio de trabajo
WORKDIR /app

# Copia e instala las dependencias
COPY requirements.txt /app/
RUN pip install --upgrade pip && pip install -r requirements.txt

# Copia todo el código de la aplicación al contenedor
COPY . /app/

# Expone el puerto en el que corre Django (normalmente 8000)
EXPOSE 8000

# Comando de inicio, ajusta el nombre al de tu proyecto y su wsgi
CMD ["gunicorn", "core.wsgi:application", "--bind", "0.0.0.0:8000"]
