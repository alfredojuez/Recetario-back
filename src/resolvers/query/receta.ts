import chalk from 'chalk';
import { IResolvers } from 'graphql-tools';
import { COLLECTIONS, LINEAS } from '../../config/constant';
import { logResponse, logTime } from '../../functions';
import RecetasService from '../../services/recetas.service';

const resolversQueryRecetas: IResolvers = {
  Query: {
    async ListadoRecetas(_, variables, { db }) 
    {
      const LOG_NAME = `Ejecución GraphQL -> Listado de ${COLLECTIONS.RECETAS}`;
      console.time(LOG_NAME);
      console.log(LINEAS.TITULO_X2);
      logTime();
      console.log(`Solicitada búsqueda en la tabla ${COLLECTIONS.RECETAS}:  ${chalk.yellow(JSON.stringify(variables))} `);

      const respuesta = await new RecetasService(_, {pagination: variables}, { db }).items();
      
      // pintamos los datos del resultado en el log
      logResponse(respuesta.status, respuesta.message);
      console.timeEnd(LOG_NAME);

      return respuesta;
    },

    async DetalleReceta(_, { idReceta }, { db }) 
    {
      return await new RecetasService(_, { idReceta } , { db }).details();
    },
  },
};

export default resolversQueryRecetas;

