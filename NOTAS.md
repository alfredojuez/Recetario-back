# OPERACIONES CON GRAPHQL
Debido a la potencia que GraphQL nos ofrece, aqui iré incluyendo información de utilidad para aprender a usarlo desde graphiQL, y posteriormente poder llevarlo al front para realizar las consultas.

Antes de aprender a realizar login, deberemos tener algún usuario registrado:
## Registrar usuario 
Vamos a proporcionar un parametro (DatosUsuario) de tipo UsuarioInput y que nos va a devolver un status, un mensaje y los datos del usuario.

En el playground de GraphiQL tenemos que poner esto:
```
mutation addUser($DatosUsuario: UserInput!) {
  register(RegistroBD: $DatosUsuario) {
    status
    message
    Usuario {
   	id
      email
      nombre
      apellidos
      usuario
      pass
      foto
      nacionalidad
      perfil
      fecha_alta
      ultimo_login
      activo  
    }
  }
}
```
Pero así, por si solo, no funciona, tenemos que proporcionar valor a la variable DatosUsuario, para ello, en la parte inferior, tenemos que ir a donde pone "Query variables" y añadir esto:

```
  {
    "DatosUsuario": {
      "email":"demo@gmail.com",
      "nombre": "demo",
      "apellidos":"" ,
      "usuario": "demo",
      "pass": "demo",
      "foto": "",
      "nacionalidad": "",
      "perfil": "USER" 
    }
  }
```
La ejecución de este codigo, nos devolverá algo similar a esto:
```
{
  "data": {
    "register": {
      "status": true,
      "message": "El usuario demo se ha registrado correctamente.",
      "Usuario": {
        "id": "3",
        "email": "demo@gmail.com",
        "nombre": "demo",
        "apellidos": "",
        "usuario": "demo",
        "pass": "$2b$10$R9w9HlgZtPurOxQZdE4lseEa79Or.Omdr16RjQ7zsjKF/ScD4Okwa",
        "foto": "",
        "nacionalidad": "",
        "perfil": "USER",
        "fecha_alta": "2021-01-13T10:25:04.098Z",
        "ultimo_login": "2021-01-13T10:25:04.098Z",
        "activo": true
      }
    }
  }
}
```

## Realizar login para obtener token

En el playground:
``` 
query getLogin($user:String!, 
               $pass: String!)
{
  login(email: $user, 
    pass: $pass)
  {
    status
    message
    token
  }
}
```
Que indica que vamos a proporcionarle dos parametros (user y pass) y que nos va a devolver un status, un mensaje y el token.

Ahora en el apartado Query variables, podemos darle valores a user y pass
```
{
  "user":"alfredojuez",
  "pass":"alfredojuez"
}
```

En este caso obtendremos algo similar a esto:
```
{
  "data": {
    "login": {
      "status": true,
      "message": "Usuario verificado.",
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Il9pZCI6IjVmZmI3YjQzY2Q4MjFiMTUzNDcxZjFkNyIsImVtYWlsIjoiYWxmcmVkb2p1ZXpAaG90bWFpbC5jb20iLCJub21icmUiOiJBbGZyZWRvIiwiYXBlbGxpZG9zIjoiSnVleiIsInVzdWFyaW8iOiJhbGZyZWRvanVleiIsImZvdG8iOiIiLCJuYWNpb25hbGlkYWQiOiIiLCJwZXJmaWwiOiJBRE1JTiIsImFjdGl2byI6dHJ1ZSwiaWQiOjEsImZlY2hhQWx0YSI6IjIwMjEtMDEtMTBUMjI6MTA6MTEuNTI0WiJ9LCJpYXQiOjE2MTA1MzI3NDksImV4cCI6MTYxMDU1NDM0OX0.eRshR1b_5K6I0WodcuuIJMev2tjUJT5NeK56oMMZIac"
    }
  }
}
```

## Obtención de los datos de un usuario
A partir del token, podemos obtener los datos del usuario que se han introducido en el.
En el playground, si ponemos esto, obtendremos el status de la petición, un mensaje y los datos del Usuario:
```
{
  me
  {
    status
    message
    Usuario
    {
      id
      perfil
      email
      usuario
      pass 
      nombre
      apellidos
      foto
      nacionalidad
    }
  }
}
```
Pero esto así por si solo no funciona, tenemos que pasarle el token, y esta vez no va como parametro, sino que irá en la cabecera
```
{
		"authorization": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Il9pZCI6IjVmZmI3YjQzY2Q4MjFiMTUzNDcxZjFkNyIsImVtYWlsIjoiYWxmcmVkb2p1ZXpAaG90bWFpbC5jb20iLCJub21icmUiOiJBbGZyZWRvIiwiYXBlbGxpZG9zIjoiSnVleiIsInVzdWFyaW8iOiJhbGZyZWRvanVleiIsImZvdG8iOiIiLCJuYWNpb25hbGlkYWQiOiIiLCJwZXJmaWwiOiJBRE1JTiIsImFjdGl2byI6dHJ1ZSwiaWQiOjEsImZlY2hhQWx0YSI6IjIwMjEtMDEtMTBUMjI6MTA6MTEuNTI0WiJ9LCJpYXQiOjE2MTA1MzI3NDksImV4cCI6MTYxMDU1NDM0OX0.eRshR1b_5K6I0WodcuuIJMev2tjUJT5NeK56oMMZIac"
}
```
En la respuesta, tendremos los datos del usuario que vengan en el token (que habremos sacado del login), obteniendo como resultado algo como:
```
{
  "data": {
    "me": {
      "status": true,
      "message": "Validación correcta del token para el usuario demo",
      "Usuario": {
        "id": "3",
        "perfil": "USER",
        "email": "demo@gmail.com",
        "usuario": "demo",
        "nombre": "demo",
        "apellidos": "",
        "foto": "",
        "nacionalidad": ""
      }
    }
  }
}
```
Si el token estuviera caducado o hubiera sido modificado, recibiríamos esto como respuesta:
```
{
  "data": {
    "me": {
      "status": false,
      "message": "token no válido, inicia sesión de nuevo.",
      "Usuario": null
    }
  }
}
```
### Controlando la información del token
Puede que no queramos que alguno de los datos sean visibles, por ejemplo, la password, (aunque venga encriptada), para ello, podemos modificar la Query de esta forma, creando un parametro include que nos indica si añadiremos ciertos parametros a la respuesta de la query con el sufijo @include(if: $include):
```
query meData($include: Boolean!)
{
  me
  {
    status
    message
    Usuario
    {
			...UserObject        
    }
  }
}
fragment UserObject on Usuario
{
  id
      perfil
      email
      usuario
      pass @include(if: $include)
      nombre
      apellidos
      foto
      nacionalidad
}
```
A continuación en las Query variables indicaremos con true o false si queremos que se muestre o no dichos campos, en nuestro caso, si queremos que no se vea la password, aunque se pida (o aunque no venga en el token...):
```
{
  "include":false
}
```
* Si se pide un campo que no está en el token, pero que si pertenede al objeto que estamos leyendo, por ejemplo el password, GraphQL nos dará un error indicando que no se puede mostrar un campo null (que no viene en el token).

## Listados de usuarios
Como ya hemos visto con los fragmentos, ahora se simplifica la petición de datos, ya que con la siguiente query obtenemos el status de la petición, el mensaje informativo y una lista de objetos de tipo Usuario:
```
# Write your query or mutation here
  query
  {
     ListadoUsuarios{
      status
      message
      Usuarios
      {
        ...UserObject
      }
    }
  }
fragment UserObject on Usuario
{
    id
    email
    nombre
    apellidos
    usuario
    pass
    foto
    nacionalidad
    perfil
    fecha_alta
    ultimo_login
    activo
}
```

## Otros listados

Se han creado listados generales para obtener todos los registros de una tabla, y se les han nombrado a todos con el comiento "Listado"

Estos se consultan con una query como esta:
```
{
  ListadoCategorias
  {
    status
    message
    categorias
    {
      idCategoria
      nombre
      descripcion
      foto
      fecha_alta
      usuario_alta
      fecha_modificacion
      usuario_modificacion      
    }
  }
}
```

Por otro lado, se permite buscar el detalle de un elemento en concreto, haciendo uso en lugar de los "Listados" en este caso de los "Detalles", por tanto en graphQL quedaría como sigue:
```
{
  DetalleIngrediente(idIngrediente: 167)
  {
    status
    message
    ingrediente
    {
      idIngrediente
      nombre
      descripcion
      foto
      fecha_alta
      usuario_alta
    }
  }
}
```

## Creación de registros
Para poder dar de alta registros, hay que crear una query, y pasarles los parametros del registro a guardar en base de datos en una variable:

QUERY:
```
mutation newCategoria($Datos:	CategoriaInput!)
{
  addCategoria(categoria:$Datos)
  {
    status
    message
    categoria
    {
      idCategoria
      nombre
    }
  }
}
```

VARIABLE:
```
{
  "Datos": {
    "idCategoria": 300,
    "nombre": "Categoria 300"
  }
}
```

## Actualización de registros:

En este caso tenemos que tener en cuenta si la clave primaria es de tipo entero o string (Nacionalidades)

```CODIGO
mutation actNacionalidad($Datos: NacionalidadInput!, $idSearch: String!)
{
  updateNacionalidad(nuevoRegistro:$Datos, idNacionalidad:$idSearch)
  {
    status
    message
    nacionalidad
    {
      idNacionalidad
      nombre
      icono
      fecha_alta
      usuario_alta
      fecha_modificacion
      usuario_modificacion
    }
  }
}
```
Y en este caso hay que pasar dentro de las variables, por un lado el ID del objeto a modificar y por otro los campos que queramos modificar:
```CODIGO
{
  "idSearch": "VDS",
  "Datos": {
    "nombre": "Villarejo de Salvanés"
  }
}
```