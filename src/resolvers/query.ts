import chalk from 'chalk';
import { IResolvers } from 'graphql-tools';
import bcrypt from 'bcrypt';
import { COLLECTIONS, LINEAS, LOG_TIME_NAME, MENSAJES } from '../config/constant';
import logTime from '../functions';
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
      console.time(LOG_TIME_NAME);
      logTime();      
      
      console.log(LINEAS.TITULO_X2);
      console.log('· ');

      //por defecto la respuesta es que no se ha podido hacer, salvo que obtengamos datos
      var respuesta = null;
      var resultado = null;
      
      //Por defecto, presuponemos el error, así sabemos que llegamos al return con datos.
      respuesta = {
        status: false,
        message: MENSAJES.LOGIN_ERROR,
        token: null
      };

      try 
      {
        console.log('· Verificamos si existe el e-mail');
        let accesoCorrecto = false;
        const verificacionEmail = await db
          .collection(COLLECTIONS.USERS)
          .findOne({ email });        

        //Si el usuario existe, verificamos la pass
        if (verificacionEmail !== null) 
        {
          console.log('· Verificamos credenciales');
          accesoCorrecto = bcrypt.compareSync(pass, verificacionEmail.pass);
          if(accesoCorrecto)
          {
            resultado = verificacionEmail;
          }
        }        

        //si el email no loga, lo probamos con usuario
        if(!accesoCorrecto)
        {
          console.log('· e-mail erroneo, comprobamos acceso con usuario.');
          const verificacionUsuario = await db
          .collection(COLLECTIONS.USERS)
          .findOne({ usuario: email });

          if (verificacionUsuario !== null)
          {
            console.log('· Verificamos credenciales');
            accesoCorrecto = bcrypt.compareSync(pass, verificacionUsuario.pass);
            if(accesoCorrecto)
            {
              resultado = verificacionUsuario;
            }
          }
        }
        
        if (accesoCorrecto)
        {
            console.log(`· Usuario ${chalk.yellow(resultado.usuario)} localizado, tiene perfil de ${chalk.yellow(resultado.perfil)}`);
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
        else
        {            
          respuesta = {
            status: false,
            message: MENSAJES.LOGIN_VERIFICATION_NO_MAIL,
            token: null,
          }
        }
        
      } catch (err) {
        console.log(err);
      }
      // Nos muestra el tiempo transcurrido finalmente
      console.log('· ' + respuesta.message);
      console.log('·');
      console.log(LINEAS.TITULO_X2);
      console.timeEnd(LOG_TIME_NAME);
      return respuesta;
    },
  },
};

export default resolversQuerys;
