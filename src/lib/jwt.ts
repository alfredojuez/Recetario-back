import { EXPIRATION_TIME, MENSAJES, SECRET_KEY } from '../config/constant';
import jwt from 'jsonwebtoken';
import { IJwt } from '../interfaces/jwt.interface';
import chalk from 'chalk';

class JWT{
    private secretKey = SECRET_KEY as string;

    //Hacemos que caduquen los token cada 6 horas
    sign(data: IJwt, expiresIn: number = EXPIRATION_TIME.D1)
    {
        return jwt.sign(
            { usuario: data.usuario },
            this.secretKey,
            { expiresIn } 
        );
    }

    getInfo(token: string)
    {
        let respuesta = {
            status: false,
            message:  MENSAJES.LOGIN_VERIFICATION_KO,
            usuario: {} || null
        };
        respuesta.usuario = null;
        
        try
        {
            const datos = jwt.verify(token, this.secretKey);
            //convertimos lo devuelto por verify en un objeto recorrible
            const datosToken = JSON.parse(JSON.stringify(Object.values(datos)[0]));            
            console.log(`Usuario solicitante: ${chalk.yellow(datosToken.usuario)} con el ID: ${chalk.yellow(datosToken.id)}`);
            respuesta = {
                status: true,
                message: MENSAJES.LOGIN_VERIFICATION_OK,
                usuario: datosToken
            };
        }
        catch
        {
                console.log('Validación de token incorrecta');
        }
        return respuesta;
    }

    verify(token:string)
    {
        let respuesta = {
            status: false,
            message:  MENSAJES.LOGIN_VERIFICATION_KO,
            usuario: {} || null
        };
        respuesta.usuario = null;

        try{
            let datos = jwt.verify(token, this.secretKey);            
            //convertimos lo devuelto por verify en un objeto recorrible
            datos = JSON.parse(JSON.stringify(Object.values(datos)[0]));
            respuesta = {
                status: true,
                message: MENSAJES.LOGIN_VERIFICATION_OK,
                usuario: JSON.parse(JSON.stringify(datos))
            };
        }
        catch
        {
                console.log('Validación de token incorrecta');
        }
        return respuesta;
    }
}

export default JWT;