import { EXPIRATION_TIME, MENSAJES, SECRET_KEY } from '../config/constant';
import jwt from 'jsonwebtoken';
import { IJwt } from '../interfaces/jwt.interface';

class JWT{
    private secretKey = SECRET_KEY as string;

    //Hacemos que caduquen los token cada 6 horas
    sign(data: IJwt, expiresIn: number = EXPIRATION_TIME.H6)
    {
        return jwt.sign(
            { user: data.usuario },
            this.secretKey,
            { expiresIn } 
        );
    }

    verify(token:string)
    {
        console.log('Verificando validez del token');
        try{
            return  jwt.verify(token,this.secretKey);
        }catch(err){
            console.log(err);
            return MENSAJES.LOGIN_VERIFICATION_KO;
        }
    }
}

export default JWT;