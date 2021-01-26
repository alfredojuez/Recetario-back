import { IResolvers } from 'graphql-tools';
import IngredientesService from '../../services/ingredientes.service';

const resolversQueryIngredientes: IResolvers = {
  Query: {
    async ListadoIngredientes(_, __, { db }) 
    {
      return await new IngredientesService(_, __, { db }).items();
    },
    async DetalleIngrediente(_, { idIngrediente }, { db }) 
    {
      return await new IngredientesService(_, { idIngrediente } , { db }).details();
    },
  },
};

export default resolversQueryIngredientes;

