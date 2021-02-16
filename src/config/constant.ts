import environment from './environments';

if(process.env.NODE_ENV !== 'production')
{
    const env=environment;
}

export const SECRET_KEY = process.env.SECRET || '3n un lug4r d3 l4 M4nch4';

export enum COLLECTIONS{
    USUARIOS='usuarios',
    CATEGORIAS='categorias',
    INGREDIENTES='ingredientes',
    NACIONALIDADES='nacionalidades',
}

//Mensaje para mostrar en las funciones que queremos evaluar su tiempo de ejecición
//export const LOG_TIME_NAME = 'Tiempo de ejecución';

export enum MENSAJES
{
    LOGIN_OK='Usuario verificado.',
    LOGIN_KO='Usuario-contraseña incorrectos.',
    LOGIN_ERROR ='No se han podido comprobar las credenciales del usuario.',
    LOGIN_VERIFICATION_OK ='Verificacion de usuario realizada correctamente.',
    LOGIN_VERIFICATION_KO = 'token no válido, inicia sesión de nuevo.',    
    USER_NO_REGISTERED ='El usuario que está usando no está registrado.',
}

export enum MAIL_TYPES
{
    PRUEBA='Mail de prueba',
    BIENVENIDA='Mail de bienvenida',
    LINK_ACTIVACION='Activación de usuario',
    RESET_PASSWORD='Reseteo de contraseña',
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
    S1 = D1*7,
 }

 export enum LINEAS
 {
    IMPORTANTE_X2 = '#############################################################################################',
    IMPORTANTE    = '#######################################',
    BLOQUE_X2     = '=============================================================================================',
    BLOQUE        = '=======================================',
    TITULO_X2     = '---------------------------------------------------------------------------------------------',
    TITULO        = '---------------------------------------',
    SEPARADOR_X2  = '- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -',
    SEPARADOR     = '- - - - - - - - - - - - - - - - - ',
 }
