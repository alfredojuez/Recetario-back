import { LINEAS } from "../../config/constant";
import logTime from "../../functions";
import chalk from "chalk";
import { IResolvers } from "graphql-tools";
import CategoriasService from "../../services/categorias.service";

//*********************************************************
// Usuarios(root, args, context, info)
//---------------------------------------------------------
// root:    informacion de raiz
// args:    argumentos que hayamos definido en el tipo raiz
// context: informacion que se comparte en los resolvers
// info:    informacion de la operación ejecutada
//*********************************************************
const resolversMutationCategoria: IResolvers = {
  Mutation: {
    async addCategoria(_, variables, contexto) {
      const LOG_NAME = `Ejecución GraphQL -> Creacion de categoria `;
      console.time(LOG_NAME);
      console.log(LINEAS.TITULO_X2);
      logTime();
      console.log(`Solicitada alta de categoria  ${chalk.yellow('"' + variables.categoria.nombre + '"')}`
      );
      const respuesta = await new CategoriasService(_, variables.categoria, contexto).insert();
      if (respuesta.status) {
        console.log(`Asignado ID ${chalk.yellow(variables.categoria.idCategoria)}`);
      }
      console.timeEnd(LOG_NAME);
      return respuesta;
    },
  },
};

export default resolversMutationCategoria;
