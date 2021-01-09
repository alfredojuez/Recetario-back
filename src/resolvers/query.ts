import { Console } from 'console';
import { IResolvers } from 'graphql-tools';
import { KnownArgumentNamesOnDirectivesRule } from 'graphql/validation/rules/KnownArgumentNamesRule';
import { userInfo } from 'os';
import { createLogicalNot } from 'typescript';
import { COLLECTIONS, MENSAJES } from '../config/constant';
import JWT from '../lib/jwt';

//*********************************************************
// ListadoUsuarios(root, args, context, info)
//---------------------------------------------------------
// root:    informacion de raiz
// args:    argumentos que hayamos definido en el tipo raiz
// context: informacion que se comparte en los resolvers
// info:    informacion de la operación ejecutada
//*********************************************************
const resolversQuerys: IResolvers = {
  Query: {
    async ListadoUsuarios(_, __, { db }) {
      // para el calculo del tiempo de ejecución
      console.time('Ejecución GraphQL');

      //por defecto la respuesta es que no se ha podido hacer, salvo que obtengamos datos
      let respuesta = {
        status: false,
        message: 'No se han podido leer usuarios de la base de datos',
        Usuarios: [],
      };

      try {
        const resultado = await db
          .collection(COLLECTIONS.USERS)
          .find()
          .toArray();
        let mensaje = 'No hay ningún registro en la base de datos';
        if (resultado.length > 0) {
          mensaje =
            'Lista de usuarios leida correctamente, total de registros: ' +
            resultado.length;
        }

        respuesta = {
          status: true,
          message: mensaje,
          Usuarios: resultado,
        };
      } catch (err) {
        console.log(err);
      }

      // Nos muestra el tiempo transcurrido finalmente
      console.timeEnd('Ejecución GraphQL');
      return respuesta;
    },

    async login(_, { email, pass }, { db }) {
      // para el calculo del tiempo de ejecución
      console.time('Login');
      console.log('####################################################');
      console.log('#');

      //por defecto la respuesta es que no se ha podido hacer, salvo que obtengamos datos
      var respuesta = null;
      
      //Por defecto, presuponemos el error, así sabemos que llegamos al return con datos.
      respuesta = {
        status: false,
        message: MENSAJES.LOGIN_ERROR,
        token: null
      };

      try 
      {
        console.log('# Verificamos si existe el mail');
        let usuarioVerification =null;
        const emailVerification = await db
          .collection(COLLECTIONS.USERS)
          .findOne({ email });

        //Si el usuario no es el correo, miramos si es el usuario en si
        if (emailVerification === null) 
        {

          usuarioVerification = await db
          .collection(COLLECTIONS.USERS)
          .findOne({ usuario: email });

          if (usuarioVerification === null)
          {            
            respuesta = {
              status: false,
              message: MENSAJES.LOGIN_VERIFICATION_NO_MAIL,
              token: null,
            };
          }
          else
          {
            //Como la validación la hacemos siempre con el mail, si el usuario 
            //nos facilita el nombre de usuario en lugar del mail, despues de 
            //localizarle, hacemos uso de su mail, con la pass que nos dió
            email=usuarioVerification.email;
            console.log('# No encontrado el email, pero si el usuario.');
          }
        } 

        if(emailVerification!==null || usuarioVerification!==null) {
          console.log('# Realizando verificacion de credenciales.');
          //luego realizamos el login real
          const resultado = await db
            .collection(COLLECTIONS.USERS)
            .findOne({ email, pass });

          console.log('# Usuario ' + resultado.usuario +   ' localizado, tiene perfil de ' + resultado.perfil);
          
          if (resultado === null) {            
            respuesta = {
              status: true,
              message: MENSAJES.LOGIN_KO,
              token: null
            };
          }
          else{
            //eliminamos campos sensibles...
            delete resultado.pass;
            delete resultado.ultimoLogin;
            //ahora si, almacenamos los datos que hemos recibido
            respuesta = {
              status: true,
              message: MENSAJES.LOGIN_OK,
              token: new JWT().sign({ usuario: resultado })
            };
          }
        }
      } catch (err) {
        console.log(err);
      }
      // Nos muestra el tiempo transcurrido finalmente
      console.log('# ' + respuesta.message);
      console.log('#')
      console.log('####################################################')
      console.timeEnd('Login');
      return respuesta;
    },
  },
};

export default resolversQuerys;
