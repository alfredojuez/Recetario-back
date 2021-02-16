import { COLLECTIONS, EXPIRATION_TIME, LINEAS, MAIL_TYPES } from '../config/constant';
import { logResponse, logTime } from '../functions';
import { IContextDB } from '../interfaces/context-db.interface';
import IContext from '../interfaces/context.interface';
import { findOneElement } from '../lib/db-operations';
import JWT from '../lib/jwt';
import MailService from './mail.service';
import ResolversOperationsService from './resolvers-operations.service';

class PasswordService extends ResolversOperationsService
{
    constructor(root: object, variables: object, context: IContextDB)
    {
        //llamamos al constructor del padre
        super(root, variables, context);
    }

    async sendMail()
    {
        let respuesta = {
          status: false,
          message: `Error al resetear el password`,
          mail: {} || null,
        };

        respuesta.mail = null;  //para que no lo muestre en el graphql
  
        // Primero debemos saber si hay algún usuario con ese correo electrónico
        const user = await findOneElement(  this.getDb(), 
                                            COLLECTIONS.USUARIOS, 
                                            { email: this.getVariables().usuario?.email }
                                         );
  
        if(user === undefined || user === null)
        {
          respuesta.message = `Correo ${this.getVariables().usuario?.email} NO ENCONTRADO`;
          console.log(respuesta.message);
        }
        else
        {
          // Campos para el token
          const id = user.id;
          const email = user.email;
          const usuario = user.usuario;
          const tipo_mail = MAIL_TYPES.RESET_PASSWORD;
          
          const iData = {usuario: {id, usuario, email, tipo_mail}};
  
          const token = new JWT().sign(iData, EXPIRATION_TIME.M15);
          const html = `Buenos días
                        <br><br> 
                        Este es un mail automático no responda a este correo.
                        Ha recibido este correo porque se ha solicitado el reseteo del password asociado a este correo.
                        <br><br>
                        Por favor, siga este enlace:
                        <br><br>
                        <a href="${process.env.CLIENT_URL}#/reset/${token}">Click aquí para solicitar el cambio de password de este usuario</a>
                        <br><br>
                        Recuerda que el link es válido durante 15 minutos.
                        <br><br>
                        Que tenga un buen día
                        <br><br>`;
          
  
          const emailData = {
            to: email,
            subject: tipo_mail,
            html
          };
        
          respuesta = Object(await new MailService().send(emailData));
        }
        return respuesta;
    }





}

export default PasswordService;
