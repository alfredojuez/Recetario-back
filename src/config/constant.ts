import environment from './environments';

if(process.env.NODE_ENV !== 'production')
{
    const env=environment;
}

export const SECRET_KEY = process.env.SECRET || '3n un lug4r d3 l4 M4nch4';

export enum COLLECTIONS{
    USERS='usuarios'
}

export enum MENSAJES
{
    LOGIN_OK='Usuario verificado.',
    LOGIN_KO='Usuario-contraseña incorrectos.',
    LOGIN_ERROR ='No se han podido comprobar las credenciales del usuario.',
    LOGIN_VERIFICATION_OK ='Verificacion de usuario realizada correctamente.',
    LOGIN_VERIFICATION_KO = 'token no válido, inicia sesión de nuevo.',    
    LOGIN_VERIFICATION_NO_MAIL ='El usuario que está usando no está registrado.',
}

/**
 * M = Minutos
 * H = Horas
 * D = Dias
 */

 export enum EXPIRATION_TIME
 {
    M1 = 1*60,
    M15 = 15*M1,
    M30 = 30*M1,
    H1 = M1*60,
    H6 = 6*H1,
    H12 = 12*H1,
    D1 = H1*24,     
 }


 export enum LINEAS
 {
     INICIO_FIN_BLOQUE  = '############################################',
     INICIO_FIN_BLOQUE_X2  = '################################################################################################',
     TITULO             = '=======================================',
     TITULO_X2 = '===========================================================================================',
     SEPARADOR          = ' - - - - - - - - - - - - - - - - - ',
     SEPARADOR_X2 = ' - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - '
 }