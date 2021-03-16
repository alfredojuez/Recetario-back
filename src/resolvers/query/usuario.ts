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
    
    async ListadoUsuariosCompleto(_, variables, { db })  
    {
      const LOG_NAME = `Ejecución GraphQL -> Listado de ${COLLECTIONS.USUARIOS} COMPLETO`;
      console.time(LOG_NAME);
      console.log(LINEAS.TITULO_X2);
      logTime();
      console.log(`Solicitada búsqueda en la tabla ${COLLECTIONS.USUARIOS}:  ${chalk.yellow(JSON.stringify(variables))} `);

      const respuesta = await new UsuariosService(_, {pagination: variables}, { db }).items(variables.active);
      
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

