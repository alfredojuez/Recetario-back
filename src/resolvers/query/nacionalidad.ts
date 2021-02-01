import chalk from 'chalk';
import { IResolvers } from 'graphql-tools';
import { COLLECTIONS, LINEAS } from '../../config/constant';
import { logResponse, logTime } from '../../functions';
import NacionalidadesService from '../../services/nacionalidades.service';

const resolversQueryNacionalidades: IResolvers = {
  Query: 
  {
    async ListadoNacionalidades(_, variables, { db }) 
    {
      const LOG_NAME = `Ejecución GraphQL -> Listado de ${COLLECTIONS.NACIONALIDADES}`;
      console.time(LOG_NAME);
      console.log(LINEAS.TITULO_X2);
      logTime();
      console.log(`Solicitada búsqueda en la tabla ${COLLECTIONS.NACIONALIDADES}:  ${chalk.yellow(JSON.stringify(variables))} `);

      const respuesta = await new NacionalidadesService(_, {pagination: variables}, { db }).items();
      
      // pintamos los datos del resultado en el log
      logResponse(respuesta.status, respuesta.message);
      console.timeEnd(LOG_NAME);

      return respuesta;
    },
    async DetalleNacionalidad(_, { idNacionalidad }, { db }) 
    {
      return await new NacionalidadesService(_, { idNacionalidad } , { db }).details();
    },
  }
};

export default resolversQueryNacionalidades;
