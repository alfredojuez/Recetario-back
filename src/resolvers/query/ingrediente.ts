import { IResolvers } from 'graphql-tools';

const resolversQueryIngredientes: IResolvers = {
  Query: {
    ingredientes()
    {
      return true;
    },
  },
};

export default resolversQueryIngredientes;
