import { IResolvers } from "graphql-tools";
import { COLLECTIONS } from "../config/constant";

//*********************************************************
// Usuarios(root, args, context, info)
//---------------------------------------------------------
// root:    informacion de raiz
// args:    argumentos que hayamos definido en el tipo raiz
// context: informacion que se comparte en los resolvers
// info:    informacion de la operación ejecutada
//*********************************************************
const resolversQuerys: IResolvers = {
  Query: {
    async Usuarios(_, __, {db}) {
      console.log("Ejecucion GraphQL...")
      try{
        return await db.collection(COLLECTIONS.USERS).find().toArray();
      }
      catch(err){
          console.log(err);
        return [];
      }
    },
  },
};


export default resolversQuerys;
