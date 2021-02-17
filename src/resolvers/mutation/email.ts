import { COLLECTIONS, EXPIRATION_TIME, LINEAS, MAIL_TYPES, MENSAJES } from '../../config/constant';
import { logTime, logResponse } from '../../functions';
import chalk from 'chalk';
import { IResolvers } from 'graphql-tools';
import { transport } from '../../config/mailer';
import JWT from '../../lib/jwt';
import UsuariosService from '../../services/usuarios.service';
import { findOneElement, updateOneElement } from '../../lib/db-operations';
import bcrypt from 'bcrypt';
import MailService from '../../services/mail.service';
import PasswordService from '../../services/password.services';

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
      return new MailService().send(variables.mail);
    },

    async activateUserEmail(_, variables)
    {
      const LOG_NAME = `Ejecución Mailer ->  Envio de mail automático para reactivacion de usuario`;
      console.time(LOG_NAME);
      console.log(LINEAS.TITULO_X2);
      logTime();

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
                    Este es un mail automático, no responda a este correo.
                    Ha recibido este correo porque se ha registrado un usuario en nuestra web con este correo.
                    <br><br>
                    Para activar la cuenta deberá seguir este enlace:
                    <br><br>
                    <a href="${process.env.CLIENT_URL}#/active/${token}">Click aquí para solicitar activación de usuario</a>
                    <br><br>
                    Que tenga un buen día
                    <br><br>`;
      
      const emailData = {
        to:email,
        subject: tipo_mail,
        html
      };
      const respuesta =Object(await new MailService().send(emailData));
      logResponse(respuesta.status, respuesta.message);
      console.timeEnd(LOG_NAME);
       return respuesta;
    },

    async activateUserAction(_, variables, context)
    {
      const LOG_NAME = `Ejecución Mailer -> Activación de usuario mediante link`;
      console.time(LOG_NAME);
      console.log(LINEAS.TITULO_X2);
      logTime();
      console.log(`Solicitada activación de usuario mediante link`);

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
    },

    async resetPasswordEmail(_, variables, context)
    {
      const LOG_NAME = `Ejecución Mailer ->  Envio de mail automático para reactivacion de usuario`;
        console.time(LOG_NAME);
        console.log(LINEAS.TITULO_X2);
        logTime();
        
        console.log(`Solicitado link de reseteo de contraseña de usuario`);
        console.log('Generando token de validación');

        const respuesta = Object(await new PasswordService(_, {usuario: {email: variables.mail}}, context).sendMail());

        logResponse(respuesta.status, respuesta.message);
        console.timeEnd(LOG_NAME);
        return respuesta;
    },

    async resetPasswordAction(_, variables, context)
    {
      const LOG_NAME = `Ejecución Mailer -> Reseteo de password mediante link`;
      console.time(LOG_NAME);
      console.log(LINEAS.TITULO_X2);
      logTime();
      console.log(`Solicitado Reseteo de password mediante link`);

      const respuesta =  Object(await new PasswordService(_, {usuario: variables}, context).change());
      //const res = await updateOneElement(context.db, COLLECTIONS.USUARIOS, filtro, updateData);

      logResponse(respuesta.status, respuesta.message);
      console.timeEnd(LOG_NAME);
      return respuesta;
    }


  }
};

export default resolversMutationMails;
