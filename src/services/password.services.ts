import chalk from 'chalk';
import { COLLECTIONS, EXPIRATION_TIME, LINEAS, MAIL_TYPES } from '../config/constant';
import { IContextDB } from '../interfaces/context-db.interface';
import { findOneElement, updateOneElement } from '../lib/db-operations';
import JWT from '../lib/jwt';
import MailService from './mail.service';
import ResolversOperationsService from './resolvers-operations.service';
import bcrypt from 'bcrypt';
import { JWT_LENGTH } from '../functions';

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

    async change()
    {
      // en las variables viene el ID del usuario y la nueva password
      // en el contexto, tenemos el token y en el token
      // tenemos el tipo de mail que se ha enviado, para
      // saber lo que tenemos que hacer, y el id y mail del 
      // usuario, para verificar que es quien dice ser.
      let respuesta = {
        status: false,
        message: 'Error al cambiar la contraseña ha expirado.'
      };

      const context = Object(this.getContext());
      const variables = Object(this.getVariables()).usuario;

      //verificamos que el token no ha expirado
      const checkToken = new JWT().verify(context.token);
      if (checkToken.status)
      {
        const datosToken = Object(checkToken)['usuario'];
        console.log(`Usuario solicitante con ID: ${chalk.yellow(datosToken.id)}`);
        const filtro = {id: variables.id };
        const newPass = bcrypt.hashSync(variables.pass, JWT_LENGTH);    
        console.log('Encriptado de contraseña');
        const updateData = {pass: newPass};

        //verificaciones extra
        
        //const res = await updateOneElement(context.db, COLLECTIONS.USUARIOS, filtro, updateData);
        const res = await this.update(COLLECTIONS.USUARIOS, filtro, updateData, 'usuario');
        if (res.status)
        {
            respuesta.status = res.status;
            console.log(res.message);
            respuesta.message = 'Contraseña actualizada.';
        }
        else
        {
            respuesta.status = res.status;
            respuesta.message = res.message;
        }
      }
      else
      {
        respuesta.message = 'El periodo para activar el usuario ha expirado.';
      }

      return respuesta;
    }



}

export default PasswordService;
