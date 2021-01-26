import { IResolvers } from 'graphql-tools';
import NacionalidadesService from '../../services/nacionalidades.service';

const resolversQueryNacionalidades: IResolvers = {
  Query: 
  {
    async ListadoNacionalidades(_, __, { db }) {
      return await new NacionalidadesService(_, __, { db }).items();
    },
    async DetalleNacionalidad(_, { idNacionalidad }, { db }) 
    {
      return await new NacionalidadesService(_, { idNacionalidad } , { db }).details();
    },
  }
};

export default resolversQueryNacionalidades;
