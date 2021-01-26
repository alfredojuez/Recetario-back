import chalk from 'chalk';
import { IResolvers } from 'graphql-tools';
import { COLLECTIONS, LINEAS } from '../../config/constant';
import logTime from '../../functions';
import bcrypt from 'bcrypt';
import { asignacionID, findOneElement, insertOneElement } from '../../lib/db-operations';


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
      const LOG_NAME = 'Ejecución GraphQL -> Registro de usuario';
      console.time(LOG_NAME);

      console.log(LINEAS.TITULO_X2);
      logTime();

      //vamos a verificar si el usuario existe antes de crearlo
      //hay que verificar que no existe ni el mail, ni el usuario
      console.log(chalk.blueBright('SOLICITADA ALTA DE USUARIO'));
      console.log(`Datos - email: ${RegistroBD.email}`);
      const userCheckEmail = await findOneElement(db, COLLECTIONS.USUARIOS, {email:RegistroBD.email});      
      console.log('Verificando la existencia del email: ' + RegistroBD.email);
      if (userCheckEmail!== null)
      {
          console.log('Email encontrado');
          console.log(chalk.red('ALTA DE USUARIO CANCELADA'));
          console.log(LINEAS.TITULO_X2);
          console.timeEnd(LOG_NAME);
          return {
            status: false,
            message:`El email ${RegistroBD.email} ya está registrado, si no recuerdas la contraseña, solicita que te la recordemos`,
            usuario: null
          };
      }
      console.log('Email NO encontrado');

      //verificamos si existe el nombre de usuario 
      const userCheckUsuario = await findOneElement(db, COLLECTIONS.USUARIOS, {usuario:RegistroBD.usuario});
      console.log('Verificando la existencia del usuario: ' + RegistroBD.usuario);
      console.log(userCheckUsuario);
      if (userCheckUsuario!== null)
      {
          console.log('Usuario encontrado');
          console.log(chalk.red('ALTA DE USUARIO CANCELADA'));
          console.log(LINEAS.TITULO_X2);
          console.timeEnd(LOG_NAME);
          return {
            status: false,
            message:`El usuario ${RegistroBD.usuario} ya está en uso.`,
            usuario: null
          };
      }

      console.log('Usuario NO encontrado');
      let nuevoUsuario = RegistroBD;
      nuevoUsuario.id = await asignacionID(db, COLLECTIONS.USUARIOS, {fecha_alta: -1});

       // Fecha actual en formato ISO
      const now = new Date().toISOString();

      //Añadimos los campos que son automáticos para el usuario
      nuevoUsuario.fecha_alta = now;
      nuevoUsuario.ultimoLogin = now;
      nuevoUsuario.activo = true;                 

      const longitud = 10;
      nuevoUsuario.pass = bcrypt.hashSync(nuevoUsuario.pass, longitud);

      //guardar el registro
      return await insertOneElement(db, COLLECTIONS.USUARIOS, nuevoUsuario)
        .then(async () => {          
          console.log('Usuario dado de alta: ' );
          console.log(nuevoUsuario);
          console.log(chalk.green('ALTA DE USUARIO REALIZADA CORRECTAMENTE'));
          console.log(LINEAS.TITULO_X2);
          console.timeEnd(LOG_NAME);
          return {
            status: true,
            message: `El usuario ${nuevoUsuario.usuario} se ha registrado correctamente.`,
            usuario: nuevoUsuario
          };
        })
        .catch((err: Error) => {
          console.log(chalk.red('ALTA DE USUARIO CANCELADA'));
          console.log(chalk.red(err.message));
          console.log(LINEAS.TITULO_X2);
          console.timeEnd(LOG_NAME);
          return {
            status: false,
            message: `El usuario ${nuevoUsuario.usuario} NO ha podido ser dado de alta. Error inesperado.`,
            usuario: null
          };
        });
    },
  },
};

export default resolversMutationUsuario;
