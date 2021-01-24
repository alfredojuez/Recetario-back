import { IResolvers } from 'graphql-tools';
import NacionalidadesService from '../../services/nacionalidades.service';

const resolversQueryNacionalidades: IResolvers = {
  Query: 
  {
    async ListadoNacionalidades(_, __, { db }) {
      return await new NacionalidadesService(_, __, { db }).items();
    },
  }
};

export default resolversQueryNacionalidades;
