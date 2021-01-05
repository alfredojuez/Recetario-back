import { IResolvers } from "graphql-tools";

//*********************************************************
// Users(root, args, context, info)
//---------------------------------------------------------
// root:    informacion de raiz
// args:    argumentos que hayamos definido en el tipo raiz
// context: informacion que se comparte en los resolvers
// info:    informacion de la operación ejecutada
//*********************************************************
const resolversQuerys: IResolvers = {
  Query: {
    Users(root, args, context, info) {
      console.log("root: " + root);
      console.log("args: " + args);
      console.log("context: " + context);
      console.log("info: " + info);
      return [
        {
          id: 1,
          email: "alfredo@juez.es",
          nombre: "alfredo",
          apellidos: "juez",
          usuario: "alfredojuez",
          pass: "",
          foto: "",
          nacionalidad: "española",
          perfil: "ADMIN",
          alta: "",
          activo: "true",
        },
      ];
    },
  },
};


export default resolversQuerys;
