import chalk from 'chalk';
import { IResolvers } from 'graphql-tools';
import { COLLECTIONS, LINEAS, LOG_TIME_NAME } from '../../config/constant';
import logTime from '../../functions';
import bcrypt from 'bcrypt';


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
    async register(_, { RegistroBD: RegistroBD }, { db }) {      
      console.time(LOG_TIME_NAME);
      logTime();      
      console.log(LINEAS.TITULO_X2);
      //vamos a verificar si el usuario existe antes de crearlo
      //hay que verificar que no existe ni el mail, ni el usuario
      
      console.log(chalk.blueBright('SOLICITADA ALTA DE USUARIO'));
      const userCheckEmail = await db.collection(COLLECTIONS.USERS).findOne({email:RegistroBD.email});

      console.log('Verificando la existencia del email: ' + RegistroBD.email);
      if (userCheckEmail!== null)
      {
          console.log('Email encontrado');
          console.log(chalk.red('ALTA DE USUARIO CANCELADA'));
          console.log(LINEAS.TITULO_X2);
          console.timeEnd(LOG_TIME_NAME);
          return {
            status: false,
            message:`El email ${RegistroBD.email} ya está registrado, si no recuerdas la contraseña, solicita que te la recordemos`,
            Usuario: null
          };
      }
      console.log('Email NO encontrado');

      //verificamos si existe el nombre de usuario 
      const userCheckUsuario = await db.collection(COLLECTIONS.USERS).findOne({usuario:RegistroBD.usuario});
      console.log('Verificando la existencia del usuario: ' + RegistroBD.usuario);
      if (userCheckUsuario!== null)
      {
          console.log('Usuario encontrado');
          console.log(chalk.red('ALTA DE USUARIO CANCELADA'));
          console.log(LINEAS.TITULO_X2);
          console.timeEnd(LOG_TIME_NAME);
          return {
            status: false,
            message:`El usuario ${RegistroBD.usuario} ya está en uso.`,
            Usuario: null
          };
      }

      console.log('Usuario NO encontrado');
      let nuevoUsuario = RegistroBD;

      //sumamos 1 al ID actual
      const lastUser = await db
        .collection(COLLECTIONS.USERS)
        .find()
        .limit(1)
        .sort({ fechaAlta: -1 })
        .toArray();

       if (lastUser.length === 0) {
         console.log('Es el primer registro de la tabla');
         nuevoUsuario.id = 1;
       } else {
         nuevoUsuario.id = lastUser[0].id + 1;
       }

       // Fecha actual en formato ISO
      const now = new Date().toISOString();

      //Añadimos los campos que son automáticos para el usuario
      nuevoUsuario.fechaAlta = now;
      nuevoUsuario.ultimoLogin = now;
      nuevoUsuario.activo = true;                 

      const longitud = 10;
      nuevoUsuario.pass = bcrypt.hashSync(nuevoUsuario.pass, longitud)

      //guardar el registro
      return await db
        .collection(COLLECTIONS.USERS)
        .insertOne(nuevoUsuario)
        .then(async () => {          
          console.log('Usuario dado de alta: ' );
          console.log(nuevoUsuario);
          console.log(chalk.green('ALTA DE USUARIO REALIZADA CORRECTAMENTE'));
          console.log(LINEAS.TITULO_X2);
          console.timeEnd(LOG_TIME_NAME);
          return {
            status: true,
            message: `El usuario ${nuevoUsuario.usuario} se ha registrado correctamente.`,
            Usuario: nuevoUsuario
          };
        })
        .catch((err: Error) => {
          console.log(chalk.red('ALTA DE USUARIO CANCELADA'));
          console.log(chalk.red(err.message));
          console.log(LINEAS.TITULO_X2);
          console.timeEnd(LOG_TIME_NAME);
          return {
            status: false,
            message: `El usuario ${nuevoUsuario.usuario} NO ha podido ser dado de alta. Error inesperado.`,
            Usuario: null
          };
        });
    },
  },
};

export default resolversMutationUsuario;
