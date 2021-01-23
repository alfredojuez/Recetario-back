import chalk from 'chalk';
import { IResolvers } from 'graphql-tools';
import bcrypt from 'bcrypt';
import { COLLECTIONS, LINEAS, MENSAJES } from '../../config/constant';
import logTime from '../../functions';
import JWT from '../../lib/jwt';
import { findElements, findOneElement } from '../../lib/db-operations';

//*********************************************************
// ListadoUsuarios(root, args, context, info)
//---------------------------------------------------------
// root:    informacion de raiz
// args:    argumentos que hayamos definido en el tipo raiz
// context: informacion que se comparte en los resolvers
// info:    informacion de la operación ejecutada
//*********************************************************
const resolversQueryUsuarios: IResolvers = {
  Query: {
    async ListadoUsuarios(_, __, { db }) {
      // para el calculo del tiempo de ejecución
      const LOG_NAME = 'Ejecución GraphQL -> Listado de usuarios';
      console.time(LOG_NAME);

      console.log(LINEAS.TITULO_X2);
      logTime();

      console.log(`Solicitado listado de usuarios`);
      const arrayVacio : string[] = [];

      //por defecto la respuesta es que no se ha podido hacer, salvo que obtengamos datos
      let respuesta = {
        status: false,
        message: 'No se han podido leer usuarios de la base de datos',
        usuarios: arrayVacio,
      };

      try {
        const resultado = await findElements(db, COLLECTIONS.USERS);

        let mensaje = 'No hay ningún registro en la base de datos';
        if (resultado.length > 0) {
          mensaje =
            'Lista de usuarios leida correctamente, total de registros: ' +
            resultado.length;
        }

        respuesta = {
          status: true,
          message: mensaje,
          usuarios: resultado,
        };

      } catch (err) {
        console.log(err);
      }

      // Nos muestra el tiempo transcurrido finalmente
      console.log(`Recuperados ${respuesta.usuarios.length} registros`);
      console.timeEnd(LOG_NAME);
      return respuesta;
    },

    async login(_, { email, pass }, { db }) {
      // para el calculo del tiempo de ejecución
      const LOG_NAME = 'Ejecución GraphQL -> Validación de usuario';
      console.time(LOG_NAME);
      
      console.log(LINEAS.TITULO_X2);
      logTime();

      //por defecto la respuesta es que no se ha podido hacer, salvo que obtengamos datos
      var respuesta = null;
      let buscamosXEmail = null;
      let buscamosXUsuario = null;
      
      //Por defecto, presuponemos el error, así sabemos que llegamos al return con datos.
      respuesta = {
        status: false,
        message: MENSAJES.LOGIN_ERROR,
        token: null
      };

      try 
      {
        console.log('· Solicitud de login con valor de email/usuario: ' + chalk.yellow(email));

        buscamosXEmail = await findOneElement(db, COLLECTIONS.USERS, {email: email} );
        //Si el usuario existe, verificamos la pass
        if (buscamosXEmail !== null) 
        {
          console.log(`· E-mail ${email} localizado, verificamos credenciales...`);
          // verificamos la contraseña          
          if(bcrypt.compareSync(pass, buscamosXEmail.pass))
          {
            let txt = `· Usuario ${chalk.green(buscamosXEmail.usuario)} ${chalk.green('validado')}, tiene perfil de ${chalk.yellow(buscamosXEmail.perfil)}`;
            let txtPlano = `· Usuario ${buscamosXEmail.usuario} ${'validado'}, tiene perfil de ${buscamosXEmail.perfil}`;
            
            console.log(txt);
            respuesta = {
              status: true,
              message: txtPlano,
              token: new JWT().sign({ usuario: buscamosXEmail }),
              usuario: buscamosXEmail              
            };
          }
          else{
            let txt = `· Usuario ${email}, ${chalk.red('no tiene acceso')} usuario/contraseñas incorrectos.`;
            let txtPlano = `· Usuario ${email}, ${'no tiene acceso'} usuario/contraseñas incorrectos.`;
                console.log(txt);
                respuesta = {
                  status: false,
                  message: txtPlano,
                  token: null,
                };
          }

        }        
        else        //si el email no loga, lo probamos con usuario
          {
            console.log(`· E-mail ${email} ${chalk.red('no encontrado')}, comprobamos acceso con usuario.`);
            buscamosXUsuario = await findOneElement(db, COLLECTIONS.USERS, {usuario: email} );
            if (buscamosXUsuario !== null)
            {
              console.log(`· Usuario ${email} localizado, verificamos credenciales`);
              if(bcrypt.compareSync(pass, buscamosXUsuario.pass))
              {
                let txt = `· Usuario ${chalk.green(buscamosXUsuario.usuario)} localizado, tiene perfil de ${chalk.yellow(buscamosXUsuario.perfil)}`;
                let txtPlano = `· Usuario ${buscamosXUsuario.usuario} localizado, tiene perfil de ${buscamosXUsuario.perfil}`;
                console.log(txt);
                respuesta = {
                  status: true,
                  message: txtPlano,
                  token: new JWT().sign({ usuario: buscamosXUsuario }),
                  usuario: buscamosXUsuario
                };
              }
              else
              {                
                let txt = `· Usuario ${email}, ${chalk.red('no tiene acceso')} usuario/contraseñas incorrectos.`;
                let txtPlano = `· Usuario ${email}, ${'no tiene acceso'} usuario/contraseñas incorrectos.`;
                console.log(txt);
                respuesta = {
                  status: false,
                  message: txtPlano,
                  token: null,
                };
              }
            }
            else
            {            
              let txt = `· Usuario ${email}, ${chalk.red('no tiene acceso')} no está registrado.`;
              let txtPlano = `· Usuario ${email}, ${'no tiene acceso'} no está registrado.`;
              console.log(txt);
              respuesta = {
                status: false,
                message: txtPlano,
                token: null,
              };
            }
          }
      } catch (err) {
        console.log(err);
      }

      // Nos muestra el tiempo transcurrido finalmente
      console.timeEnd(LOG_NAME);
      return respuesta;
    },

    me(_,__,{ token })
    { 
      let info = new JWT().verify(token);      
      if (info === MENSAJES.LOGIN_VERIFICATION_KO)
      {
        console.log(`${chalk.yellow(MENSAJES.LOGIN_VERIFICATION_KO)}`);
        return {
          status: false,
          message: info,
          usuario: null
        };
      }

      const txt = `${chalk('Validación correcta')} del token para el usuario ${Object.values(info)[0].usuario}`;
      const txtPlano = `Validación correcta del token para el usuario ${Object.values(info)[0].usuario}`;
      console.log(chalk.greenBright(txt));
      return {
          
          status: true,
          message: txtPlano,
          usuario: Object.values(info)[0]
      };
    },
  },
};

export default resolversQueryUsuarios;

