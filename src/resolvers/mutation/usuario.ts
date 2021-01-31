import { IResolvers } from 'graphql-tools';
import UsuariosService from '../../services/usuarios.service';


//*********************************************************
// Usuarios(root, args, context, info)
//---------------------------------------------------------
// root:    informacion de raiz
// args:    argumentos que hayamos definido en el tipo raiz
// context: informacion que se comparte en los resolvers
// info:    informacion de la operación ejecutada
//*********************************************************
const resolversMutationUsuario: IResolvers = {
  Mutation: {
    async addUsuario(_, { usuario }, { db }) {             
        return new UsuariosService(_, { usuario }, { db } ).insert();
    },
    async updateUsuario(_, { usuario }, { db }) {             
      return new UsuariosService(_, { usuario }, { db } ).modify();
    },
    async deleteUsuario(_, { id }, { db }) {             
      return new UsuariosService(_, { id }, { db } ).delete();
    },

  },  // fin del mutation
};

export default resolversMutationUsuario;
