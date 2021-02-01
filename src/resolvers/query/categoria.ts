import chalk from 'chalk';
import { IResolvers } from 'graphql-tools';
import { COLLECTIONS, LINEAS } from '../../config/constant';
import { logResponse, logTime } from '../../functions';
import CategoriasService from '../../services/categorias.service';

const resolversQueryCategorias: IResolvers = {
  Query: 
  {
    async ListadoCategorias(_, variables , { db }) 
    {            
      const LOG_NAME = `Ejecución GraphQL -> Listado de ${COLLECTIONS.CATEGORIAS}`;
      console.time(LOG_NAME);
      console.log(LINEAS.TITULO_X2);
      logTime();
      console.log(`Solicitada búsqueda en la tabla ${COLLECTIONS.CATEGORIAS}:  ${chalk.yellow(JSON.stringify(variables))} `);


      const respuesta = await new CategoriasService(_, {pagination: variables} , { db }).items();
      

      // pintamos los datos del resultado en el log
      logResponse(respuesta.status, respuesta.message);
      console.timeEnd(LOG_NAME);

      return respuesta;
    },
    async DetalleCategoria(_, { idCategoria }, { db }) 
    {
      const LOG_NAME = `Ejecución GraphQL -> Detalle de ${COLLECTIONS.CATEGORIAS}`;
      console.time(LOG_NAME);
      console.log(LINEAS.TITULO_X2);
      logTime();
      console.log(`Solicitada búsqueda de registro  ${chalk.yellow(idCategoria)} en la tabla ${COLLECTIONS.CATEGORIAS}`);


      const respuesta =  await new CategoriasService(_, { idCategoria } , { db }).details();


      // pintamos los datos del resultado en el log
      logResponse(respuesta.status, respuesta.message);
      console.timeEnd(LOG_NAME);

      return respuesta;
    },
  }
};

export default resolversQueryCategorias;
