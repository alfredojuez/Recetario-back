import chalk from 'chalk';
import { IResolvers } from 'graphql-tools';
import { COLLECTIONS, LINEAS } from '../../config/constant';
import logTime from '../../functions';
import NacionalidadesService from '../../services/nacionalidades.service';


//*********************************************************
// Usuarios(root, args, context, info)
//---------------------------------------------------------
// root:    informacion de raiz
// args:    argumentos que hayamos definido en el tipo raiz
// context: informacion que se comparte en los resolvers
// info:    informacion de la operación ejecutada
//*********************************************************
const  resolversMutationNacionalidad: IResolvers = {
  Mutation: {
    async addNacionalidad(_, variables, contexto){
      const LOG_NAME = `Ejecución GraphQL -> Creacion de nacionalidad `;
      console.time(LOG_NAME);
      console.log(LINEAS.TITULO_X2);
      logTime();
      console.log(`Solicitada alta de nacionalidad  ${ chalk.yellow('"' + variables.nacionalidad.nombre + '"') } con código ${ chalk.yellow('"' + variables.nacionalidad.idNacionalidad + '"')}`);
      const respuesta = await new NacionalidadesService(_, variables.nacionalidad, contexto).insert();
      console.timeEnd(LOG_NAME);
      return respuesta;
    },
    async updateNacionalidad(_, variables, contexto) {
      const LOG_NAME = `Ejecución GraphQL -> Actualización de nacionalidad `;
      
      console.time(LOG_NAME);
      console.log(LINEAS.TITULO_X2);
      logTime();

      console.log(`Solicitada modificación de nacionalidad con el ${chalk.yellow('ID: "' + variables.idNacionalidad + '"')} con los datos:`);
      console.log(variables.nuevoRegistro);
      
      const respuesta = await new NacionalidadesService(_, variables, contexto).modify();
      console.timeEnd(LOG_NAME);
      return respuesta;
    },
    async deleteNacionalidad(_, variables, contexto) {
      const LOG_NAME = `Ejecución GraphQL -> Eliminación de nacionalidad `;
      
      console.time(LOG_NAME);
      console.log(LINEAS.TITULO_X2);
      logTime();

      console.log(`Solicitada eliminación de nacionalidad con el ${chalk.yellow('ID: "' + variables.idNacionalidad + '"')} con los datos:`);
      console.log(variables.nuevoRegistro);
      
      const respuesta = await new NacionalidadesService(_, variables, contexto).delete();
      console.timeEnd(LOG_NAME);
      return respuesta;
    },
  },
};

export default resolversMutationNacionalidad;
