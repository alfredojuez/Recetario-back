import chalk from 'chalk';
import { IResolvers } from 'graphql-tools';
import { LINEAS } from '../../config/constant';
import logTime from '../../functions';
import IngredientesService from '../../services/ingredientes.service';

//*********************************************************
// Usuarios(root, args, context, info)
//---------------------------------------------------------
// root:    informacion de raiz
// args:    argumentos que hayamos definido en el tipo raiz
// context: informacion que se comparte en los resolvers
// info:    informacion de la operación ejecutada
//*********************************************************
const resolversMutationIngrediente: IResolvers = {
  Mutation: {
    async addIngrediente(_, variables, contexto) {
      const LOG_NAME = `Ejecución GraphQL -> Creacion de ingrediente `;
      console.time(LOG_NAME);
      console.log(LINEAS.TITULO_X2);
      logTime();
      console.log(
        `Solicitada alta de ingrediente ${chalk.yellow(
          '"' + variables.ingrediente.nombre + '"'
        )} `
      );
      const respuesta = await new IngredientesService(_,variables.ingrediente, contexto).insert();
      if (respuesta.status) {
        console.log(`Asignado ID ${chalk.yellow(variables.ingrediente.idIngrediente)}`);
      }
      console.timeEnd(LOG_NAME);
      return respuesta;
    },
    async updateIngrediente(_, variables, contexto) {
      const LOG_NAME = `Ejecución GraphQL -> Actualización de ingrediente `;
      console.time(LOG_NAME);
      console.log(LINEAS.TITULO_X2);
      logTime();

      console.log(`Solicitada modificación de ingrediente con el ${chalk.yellow('ID: "' + variables.idIngrediente + '"')} con los datos:`);
      console.log(variables.nuevoRegistro);
      
      const respuesta = await new IngredientesService(_, variables, contexto).modify();
      console.timeEnd(LOG_NAME);
      return respuesta;
    },
    async deleteIngrediente(_, variables, contexto) {
      const LOG_NAME = `Ejecución GraphQL -> Eliminación de ingrediente `;
      console.time(LOG_NAME);
      console.log(LINEAS.TITULO_X2);
      logTime();

      console.log(`Solicitada eliminación de ingrediente con el ${chalk.yellow('ID: "' + variables.idIngrediente + '"')} con los datos:`);
      console.log(variables.nuevoRegistro);
      
      const respuesta = await new IngredientesService(_, variables, contexto).delete();
      console.timeEnd(LOG_NAME);
      return respuesta;
    },
  },
};

export default resolversMutationIngrediente;
