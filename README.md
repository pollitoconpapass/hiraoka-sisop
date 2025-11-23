# Proyecto: Hiraoka Clon

Proyecto final del curso Sistemas Operativos. Para esta segunda parte del curso se desarrollará en NodeJS con Express y usando contenedores de Docker.

## Requisitos
Para que el proyecto funcione, primero se debe tener el contenedor de MongoDB corriendo en Docker y una base de datos ya inicializada.

Todos los scripts de Mongo que hemos utilizado para este proyecto estan dentro de: `/scripts-mongo`.

## Indicaciones
Indicaciones para correr localmente el proyecto y/o construir los contenedores. 
## Localmente
```sh
# Instalar dependencias
npm i 

# Correr el proyecto
npm run dev
```

## Crear Contenedor
```sh
# Construir la Imagen del contenedor
docker build . -t hiraoka

# Construir el contenedor
docker run --name hiraoka -p 3000:5100 hiraoka
```

## Crear Comunicación entre contenedores (Base de Datos, Aplicación)
```sh
# Construir la orquestacion
docker-compose build --no-cache

# Correr todos los contenedores orquestados
docker compose up -d
```


## 🐳 Comandos Docker
Para recordar...

### Comandos basicos
- Correr un contenedor
    ```sh
    docker start <name>
    ```

- Consultar contenedores corriendo
    ```sh
    docker ps
    ```

- Consultar contenedores (todos)
    ```sh
    docker ps -a
    ```

### Comandos Dockerfile
- Construir imagen
    ```sh
    docker build . -t <name>
    ```

- Construir contenedor
    ```sh
    docker run —-name <name> -p port1:port2 <imagename>
    ```

### Comandos DockerCompose
- Inicializar servicios
    ```sh
    docker-compose up -d
    ```

- Ver logs
    ```sh
    docker-compose logs -f
    ```

- Detener servicios
    ```sh
    docker-compose down
    ```

- Detener y eliminar volumenes (borra todo)
    ```sh
    docker-compose down -v
    ```
