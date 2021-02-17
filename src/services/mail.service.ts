import chalk from 'chalk';
import { LINEAS } from '../config/constant';
import { transport } from '../config/mailer';
import { logTime } from '../functions';
import { IMailOptions } from '../interfaces/email interface';

class MailService
{
    async send(mail: IMailOptions)
    {
      console.log(`Solicitado envio de mail para ${chalk.yellow(mail.to)} con el asunto  ${chalk.yellow(mail.subject)}`);
      let respuesta = {
        status: false,
        message: 'No se pudo enviar el mail',
      };
      return new Promise((resolve, reject) => {
          transport.sendMail(
          {
            from: '"Recetario online" <mailerviaweb@gmail.com>', // sender address
            to: mail.to,
            subject: mail.subject,
            html: mail.html,
          },
          (error, _) => {
            if (error) 
            {
              respuesta.message = (error.message=='No recipients defined') ? 'Destinatarios no válidos': error.message;
            }
            else
            { 
                respuesta.status = true;
                respuesta.message = 'Email correctamente enviado a ' + mail.to;
            }

            resolve(respuesta);
        });
      });
    }
}

export default MailService;
