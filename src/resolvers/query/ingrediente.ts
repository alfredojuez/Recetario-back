import { IResolvers } from 'graphql-tools';
import IngredientesService from '../../services/ingredientes.service';

const resolversQueryIngredientes: IResolvers = {
  Query: {
    async ListadoIngredientes(_, {page, itemsPage }, { db }) 
    {
      return await new IngredientesService(_, {}, { db }).items();
    },
    async DetalleIngrediente(_, { idIngrediente }, { db }) 
    {
      return await new IngredientesService(_, { idIngrediente } , { db }).details();
    },
  },
};

export default resolversQueryIngredientes;

