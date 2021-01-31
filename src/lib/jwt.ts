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

    verify(token:string)
    {
        let respuesta = {
            status: false,
            message:  MENSAJES.LOGIN_VERIFICATION_KO,
            usuario: {} || null
        }
        respuesta.usuario = null;

        try{
            let datos = jwt.verify(token, this.secretKey);
            //convertimos lo devuelto por verufy en un objeto recorrible
            datos = JSON.parse(JSON.stringify(Object.values(datos)[0]));
            respuesta = {
                status: true,
                message: MENSAJES.LOGIN_VERIFICATION_OK,
                usuario: datos
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