import chalk from 'chalk';
import { IResolvers } from 'graphql-tools';

import { COLLECTIONS, LINEAS, MENSAJES } from '../../config/constant';
import { logTime, logResponse } from '../../functions';
import UsuariosService from '../../services/usuarios.service';

//*********************************************************
// ListadoUsuarios(root, args, context, info)
//---------------------------------------------------------
// root:    informacion de raiz
// args:    argumentos que hayamos definido en el tipo raiz
// context: informacion que se comparte en los resolvers
// info:    informacion de la operación ejecutada
//*********************************************************
const resolversQueryUsuarios: IResolvers = {
  Query: {
    // async ListadoUsuarios(_, __, { db }) {
    //   // para el calculo del tiempo de ejecución
    //   const LOG_NAME = 'Ejecución GraphQL -> Listado de usuarios';
    //   console.time(LOG_NAME);

    //   console.log(LINEAS.TITULO_X2);
    //   logTime();

    //   console.log(`-Solicitado listado de usuarios`);
    //   const arrayVacio : string[] = [];

    //   //por defecto la respuesta es que no se ha podido hacer, salvo que obtengamos datos
    //   let respuesta = {
    //     status: false,
    //     message: 'No se han podido leer usuarios de la base de datos',
    //     usuarios: arrayVacio,
    //   };

    //   try {
    //     const resultado = await findElements(db, COLLECTIONS.USUARIOS);

    //     let mensaje = 'No hay ningún registro en la base de datos';
    //     if (resultado.length > 0) {
    //       mensaje =
    //         'Lista de usuarios leida correctamente, total de registros: ' +
    //         resultado.length;
    //     }

    //     respuesta = {
    //       status: true,
    //       message: mensaje,
    //       usuarios: resultado,
    //     };

    //   } catch (err) {
    //     console.log(err);
    //   }

    //   // Nos muestra el tiempo transcurrido finalmente
    //   console.log(`Recuperados ${respuesta.usuarios.length} registros`);
    //   console.timeEnd(LOG_NAME);
    //   return respuesta;
    // },

    //Con esta función hacemos lo mismo que con la funcion anterior que se queda comentada.
    async ListadoUsuarios(_, variables, { db })  
    {
      const LOG_NAME = `Ejecución GraphQL -> Listado de ${COLLECTIONS.USUARIOS} ACTIVOS`;
      console.time(LOG_NAME);
      console.log(LINEAS.TITULO_X2);
      logTime();
      console.log(`Solicitada búsqueda en la tabla ${COLLECTIONS.USUARIOS}:  ${chalk.yellow(JSON.stringify(variables))} `);


      const respuesta = await new UsuariosService(_, {pagination: variables}, { db }).items();
      
      // pintamos los datos del resultado en el log
      logResponse(respuesta.status, respuesta.message);
      console.timeEnd(LOG_NAME);

      return respuesta;
    },

    async ListadoUsuariosInactivos(_, variables, { db })  
    {
      const LOG_NAME = `Ejecución GraphQL -> Listado de ${COLLECTIONS.USUARIOS} INACTIVOS`;
      console.time(LOG_NAME);
      console.log(LINEAS.TITULO_X2);
      logTime();
      console.log(`Solicitada búsqueda en la tabla ${COLLECTIONS.USUARIOS}:  ${chalk.yellow(JSON.stringify(variables))} `);

      const respuesta = await new UsuariosService(_, {pagination: variables}, { db }).inactiveItems();
      
      // pintamos los datos del resultado en el log
      logResponse(respuesta.status, respuesta.message);
      console.timeEnd(LOG_NAME);

      return respuesta;
    },

    async ListadoUsuariosCompleto(_, variables, { db })  
    {
      const LOG_NAME = `Ejecución GraphQL -> Listado de ${COLLECTIONS.USUARIOS} COMPLETO`;
      console.time(LOG_NAME);
      console.log(LINEAS.TITULO_X2);
      logTime();
      console.log(`Solicitada búsqueda en la tabla ${COLLECTIONS.USUARIOS}:  ${chalk.yellow(JSON.stringify(variables))} `);

      const respuesta = await new UsuariosService(_, {pagination: variables}, { db }).allItems();
      
      // pintamos los datos del resultado en el log
      logResponse(respuesta.status, respuesta.message);
      console.timeEnd(LOG_NAME);

      return respuesta;
    },

    async login(_, { email, pass }, { db }) {
      return await new UsuariosService(_, { usuario: {email, pass} }, { db }).login();
    },

    me(_,__,{ token })
    {
      return new UsuariosService(_,__,{token}).info();
    },
    
  },
};

export default resolversQueryUsuarios;

