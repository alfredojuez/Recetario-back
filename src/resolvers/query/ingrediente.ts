import chalk from 'chalk';
import { IResolvers } from 'graphql-tools';
import { COLLECTIONS, LINEAS } from '../../config/constant';
import { logResponse, logTime } from '../../functions';
import IngredientesService from '../../services/ingredientes.service';

const resolversQueryIngredientes: IResolvers = {
  Query: {
    async ListadoIngredientes(_, variables, { db }) 
    {
      const LOG_NAME = `Ejecución GraphQL -> Listado de ${COLLECTIONS.INGREDIENTES}`;
      console.time(LOG_NAME);
      console.log(LINEAS.TITULO_X2);
      logTime();
      console.log(`Solicitada búsqueda en la tabla ${COLLECTIONS.INGREDIENTES}:  ${chalk.yellow(JSON.stringify(variables))} `);

      const respuesta = await new IngredientesService(_, {pagination: variables}, { db }).items();
      
      // pintamos los datos del resultado en el log
      logResponse(respuesta.status, respuesta.message);
      console.timeEnd(LOG_NAME);

      return respuesta;
    },
    async DetalleIngrediente(_, { idIngrediente }, { db }) 
    {
      return await new IngredientesService(_, { idIngrediente } , { db }).details();
    },
  },
};

export default resolversQueryIngredientes;

