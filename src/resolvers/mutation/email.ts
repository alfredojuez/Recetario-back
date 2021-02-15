import { EXPIRATION_TIME, LINEAS, MAIL_TYPES, MENSAJES } from '../../config/constant';
import { logTime, logResponse } from '../../functions';
import chalk from 'chalk';
import { IResolvers } from 'graphql-tools';
import { transport } from '../../config/mailer';
import JWT from '../../lib/jwt';
import UsuariosService from '../../services/usuarios.service';

//*********************************************************
// Usuarios(root, args, context, info)
//---------------------------------------------------------
// root:    informacion de raiz
// args:    argumentos que hayamos definido en el tipo raiz
// context: informacion que se comparte en los resolvers
// info:    informacion de la operación ejecutada
//*********************************************************
const resolversMutationMails: IResolvers = {
  Mutation: 
  {
    async sendEmail(_, variables) {
      const LOG_NAME = `Ejecución Mailer ->  Envio de mail automático`;
      console.time(LOG_NAME);
      console.log(LINEAS.TITULO_X2);
      logTime();

      const mail = variables.mail;
      
      console.log(`Solicitado envio de mail para ${chalk.yellow(mail.to)} con el asunto  ${chalk.yellow(mail.subject)}`);
      
    return new Promise((resolve, reject) => {
      let info = transport.sendMail(
        {
          from: '"Recetario online" <mailerviaweb@gmail.com>', // sender address
          to: mail.to,
          subject: mail.subject,
          html: mail.html,
        },
        (error, _) => {

          if (error) {
            reject({
              status: false,
              message: error,
            });
          } else {
            resolve({
              status: true,
              message: `Email enviado correctamente a ${mail.to}`,
              mail,
            });
          }

          console.timeEnd(LOG_NAME);
        }
      );      
    });
    },

    async activateUserEmail(_, variables)
    {
      const LOG_NAME = `Ejecución Mailer ->  Envio de mail automático para reactivacion de usuario`;
      console.time(LOG_NAME);
      console.log(LINEAS.TITULO_X2);
      logTime();

      const mail = variables.mail;
      const tipo_mail = MAIL_TYPES.LINK_ACTIVACION;

      console.log(`Solicitado link de reactivación de usuario`);
      console.log('Generando token de validación');

      const id = variables.id;
      const email = variables.email;
      const usuario = variables.usuario;

      const iData = {usuario: {id, usuario, email, tipo_mail}};

      const token = new JWT().sign(iData, EXPIRATION_TIME.D1);
      const html = `Buenos días
                    <br><br> 
                    Este es un mail automático no responda a este correo.
                    Ha recibido este correo porque se ha registrado un usuario en nuestra web con este correo.
                    <br><br>
                    Para activar la cuenta deberá seguir este enlace:
                    <br><br>
                    <a href="${process.env.CLIENT_URL}#/active/${token}">Click aquí para solicitar activación de usuario</a>
                    <br><br>
                    Que tenga un buen día
                    <br><br>`;
      
    return new Promise((resolve, reject) => 
    {
      let info = transport.sendMail(
        {
          from: '"Recetario online" <mailerviaweb@gmail.com>', // sender address
          to: email,
          subject: tipo_mail,
          html,
        },
        (error, _) => 
        {
          if (error) 
          {
            console.timeEnd(LOG_NAME);
            reject({
                    status: false,
                    message: error,
                  });
          } 
          else 
          {
            console.timeEnd(LOG_NAME);
            resolve ({
                      status: true,
                      message: `Email enviado correctamente a ${email}`,
                      mail,
                    });
          }
        }
      );
    });
    },

    async activateUserAction(_, variables, context)
    {
      const LOG_NAME = `Ejecución Mailer -> Activación de usuario mediante link`;
      console.time(LOG_NAME);
      console.log(LINEAS.TITULO_X2);
      logTime();
      console.log(`Solicitada activación de usuario mediante link`);

      // en las variables viene la nueva password
      // en el contexto, tenemos el token y en el token
      // tenemos el tipo de mail que se ha enviado, para
      // saber lo que tenemos que hacer, y el id y mail del 
      // usuario, para verificar que es quien dice ser.
      let respuesta = {
        status: false,
        message: 'El periodo para activar el usuario ha expirado.'
      };

      //verificamos que el token no ha expirado
      const checkToken = new JWT().verify(context.token);
      if (checkToken.status)
      {
        const datosToken = Object(checkToken)['usuario'];
        console.log(`Usuario solicitante con ID: ${chalk.yellow(datosToken.id)}`);
        const res = await new UsuariosService(_, variables, context).logicalUndelete();
        respuesta.status = res.status;
        respuesta.message = res.message;
      }
      else
      {
        respuesta.message = 'El periodo para activar el usuario ha expirado.';
      }

      logResponse(respuesta.status, respuesta.message);
      console.timeEnd(LOG_NAME);
      return respuesta;
    }



  }
};

export default resolversMutationMails;
