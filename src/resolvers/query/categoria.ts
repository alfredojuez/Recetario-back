import { IResolvers } from 'graphql-tools';
import CategoriasService from '../../services/categorias.service';

const resolversQueryCategorias: IResolvers = {
  Query: 
  {
    async ListadoCategorias(_, __, { db }) 
    {
      return await new CategoriasService(_, __, { db }).items();
    },
    async DetalleCategoria(_, { idCategoria }, { db }) 
    {
      return await new CategoriasService(_, { idCategoria } , { db }).details();
    },
  }
};

export default resolversQueryCategorias;
