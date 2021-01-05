import { IResolvers } from "graphql-tools";
import { COLLECTIONS } from "../config/constant";

//*********************************************************
// Users(root, args, context, info)
//---------------------------------------------------------
// root:    informacion de raiz
// args:    argumentos que hayamos definido en el tipo raiz
// context: informacion que se comparte en los resolvers
// info:    informacion de la operación ejecutada
//*********************************************************
const resolversMutation: IResolvers = {
  Mutation: {
    async register(_, { User }, { db }) {
      let user = User
      //sumamos 1 al ID actual
      const lastUser = await db
        .collection(COLLECTIONS.USER)
        .find()
        .limit(1)
        .sort({ alta: -1 })
        .toArray();

       if (lastUser.length === 0) {
         console.log("Primer registro" );
         user.id = 1;
       } else {
        console.log("Nuevo registro" );
         user.id = lastUser[0].id + 1;
       }

      //asignar la fecha actual en formato ISO

      const now = new Date().toISOString();
      
      user.alta = now;
      user.ultimoLogin = now;
      user.activo = true;

      console.log("user: " );
      console.log(user );

      //guardar el registro
      return await db
        .collection(COLLECTIONS.USER)
        .insertOne(user)
        .then(async () => {
          return user;
        })
        .catch((err: Error) => {
          console.log(err.message);
          return null;
        });
    },
  },
};

export default resolversMutation;


