# TP FullStack

- **Alumno:** Santiago Bozzo - 0101329
- **Cursada:** 2do cuatrimestre 2019
- **Materias:** Técnicas avanzadas de programación y Arquitectura web

## Arquitectura

- **Backend:** nodejs (v12.7.0*)
- **Base de datos:** MongoDB (v4.2.0 Community)
- **Manejador de dependencias:** npm (v6.10.0*)

*Versiones usadas en desarrollo, puede llegar a funcionar con otras.

## Dependencias

- [express (v4.17.1)](https://www.npmjs.com/package/express): Construir y levantar una API REST
- [mongoose (v5.7.0)](https://www.npmjs.com/package/mongoose): ODM para MongoDB
- [jsonwebtoken (v8.5.1)](https://www.npmjs.com/package/jsonwebtoken): Generacion y manipulación de JWT
- [moment (v2.24.0)](https://www.npmjs.com/package/moment): Manipulación de fechas

## Requisitos

### nodejs y npm
Descargarse e instalar nodejs, la versión 12.7.0 ya viene con npm v6.10.0 incluido.

- [nodejs v12.7.0](https://nodejs.org/download/release/v12.7.0/)

### MongoDB

Descargarse e instalar MongoDB Community Server v4.2.0, es muy probable que con otra 
versión no funcione ya que mongoose v5.7.0 hace uso del driver 4.2.0 de MongoDB.

- [MongoDB Community Server](https://www.mongodb.com/download-center/community) 
(elegir la versión 4.2.0)

(OPCIONAL) Para poder visualizar la base con una GUI se puede descargar 
[MongoDB Compass](https://www.mongodb.com/download-center/compass).

## Ambiente local

- Instalar las dependencias (estando parado en backend/):
```
$ npm ci
```

- De ser necesario se pueden cambiar las variables de entorno en 
src/resources/config.json:
```
{
    "server": {
        "port": "3001"
    },
    "dataBase": {
        "host": "localhost",
        "port": "27017",
        "name": "tpFullstack"
    },
    "tokenSecretKey": "secretKey",
    "DBInitializer": {
        "initUsersAmmount": 50,
        "firstDNI": 50000000
    }
}
```

- Antes de levantar el proyecto asegurarse de tener corriendo el MongoDB Community 
Server en el mismo host:port que el configurado en el config.json.

- Levantar el proyecto/backend (estando parado en backend/):
```
$ node server.js
```

## API

### Restlet Client

Es un cliente que te deja documentar y probar APIs rest (como postman). En caso de 
usarlo se puede importar la API entera del proyecto lista para probar con el archivo 
que se encuentra en [src/resources/tpFullStackAPI-v0.1.0.json](https://github.com/santibozzo/TPFullstack/blob/develop/backend/src/resources/tpFullStackAPI-v0.1.0.json.json)

- [Reslet Client (sitio)](https://restlet.com/modules/client/)
- [Reslet Client (extensión chrome)](https://chrome.google.com/webstore/detail/restlet-client-rest-api-t/aejoelaoggembcahagimdiliamlcdmfm)

### General

- La base de todos los endpoints es **/api**.
- Para los endpoints donde se pasa datos por body es necesario agregar el header 
"Content-Type:application/json".
- A los endpoints que son autenticados es necesario pasarles por el header 
"authorization" el token de sesión que se consigue con **/login**.
- Cada sesión dura 1h y dependiendo el usuario se tiene un limite de requests.
- Los ejemplos de la siguiente documentación usan datos que se crean por defecto 
al inicializar la base por primera vez.


### /login

Si el usuario y contraseña son correctos devuelve un token de sesión.
- **Autenticado:** NO
- **Método:** POST
- **PathParams:**
- **QueryParams:**
- **Request body:**
```
{
    "dni": 50000000,
    "password": "123456"
}
```
- **Response body:**
```
{
    "token": "sessionToken"
}
```

### /users

Crea un nuevo usuario.
- **Autenticado:** NO
- **Método:** POST
- **PathParams:**
- **QueryParams:**
- **Request body:**
```
{
    "dni": 40000000,
    "email": "123@prueba.gmail",
    "password": "123456",
    "creditScore": 3
}
```
- **Response body:**
```
User 40000000 created
```

### /users/{dni}

Devuelve la información de un usuario.
- **Autenticado:** SI
- **Método:** POST
- **PathParams:**
    - dni
- **QueryParams:**
- **Request body:**
- **Response body:**
```
{
    "dni": 50000000,
    "email": "50000000@tpfullstack.com",
    "creditScore": 1
}
```

### /users/get

Recive una lista de dni/cuit y devuelve una lista de los usuarios relacionados a 
esos dni/cuit. Si algún dni/cuit no se encuentra en la base se lo saltea.
- **Autenticado:** SI
- **Método:** POST
- **PathParams:**
    - dni
- **QueryParams:**
- **Request body:**
```
[
    {"dni":500000000},
    {"cuit":"23-50000001-9"}
]
```
- **Response body:**
```
[
    {
        "dni": 50000000,
        "creditScore": 1
    },
    {
        "dni": 50000001,
        "creditScore": 4
    }
]
```

### /request-limits/{dni}

Devuelve la información relacionada al limite de requests por hora que tiene el 
usuario. Sólo se puede obtener la información del usuario de la sesión.
- **Autenticado:** SI
- **Método:** GET
- **PathParams:**
    - dni
- **QueryParams:**
- **Request body:**
- **Response body:**
```
{
    "limit": 10,
    "uses": 2,
    "lastRefresh": "21/09-20:35",
    "dni": 50000000
}
```

### /request-limits/{dni}

Cambia el limite de requests por hora del usuario por el limite dado. Sólo se puede 
cambiar el limite del usuario de la sesión.
- **Autenticado:** SI
- **Método:** PATCH
- **PathParams:**
    - dni
- **QueryParams:**
- **Request body:**
```
{
    "limit": 20
}
```
- **Response body:**
```
OK
```