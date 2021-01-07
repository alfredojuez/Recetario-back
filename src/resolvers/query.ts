import { IResolvers } from "graphql-tools";
import { COLLECTIONS } from "../config/constant";

//*********************************************************
// ListadoUsuarios(root, args, context, info)
//---------------------------------------------------------
// root:    informacion de raiz
// args:    argumentos que hayamos definido en el tipo raiz
// context: informacion que se comparte en los resolvers
// info:    informacion de la operación ejecutada
//*********************************************************
const resolversQuerys: IResolvers = {
  Query: {
    async ListadoUsuarios(_, __, {db}) {
      // para el calculo del tiempo de ejecución
      console.time('Ejecución GraphQL');

      //por defecto la respuesta es que no se ha podido hacer, salvo que obtengamos datos
      let respuesta = {
        status: false,
        message: "No se han podido leer usuarios de la base de datos",
        Usuarios: []
      };

      try{
        const resultado =  await db.collection(COLLECTIONS.USERS).find().toArray();
        let mensaje = "No hay ningún registro en la base de datos";
        if(resultado.length > 0)
        {
          mensaje = "Lista de usuarios leida correctamente, total de registros: " + resultado.length;
        }

        respuesta = { 
          status: true,
          message: mensaje,
          Usuarios: resultado
        };
      }
      catch(err)
      {
          console.log(err);
      }
      
      // Nos muestra el tiempo transcurrido finalmente
      console.timeEnd('Ejecución GraphQL');
      return respuesta;
    },
  },
};


export default resolversQuerys;
