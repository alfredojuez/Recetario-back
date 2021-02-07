import chalk from 'chalk';
import { Db } from 'mongodb';
import { findOneElement } from '../lib/db-operations';
import JWT from '../lib/jwt';

/**
 * Función que pinta en el log la fecha y hora actuales
 */
export function logTime() {
  const ahora = new Date();
  const options = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };

  console.log(chalk.gray(`${ahora.toLocaleDateString('es-ES',options)} ${ahora.toLocaleTimeString()}`)); 
}

/**
 * 
 * @param status Pinta de color verde un texto si el estatus es true
 * y de rojo si el status es false
 * @param text 
 */
export function logResponse(status: boolean, text: string)
{
  (status)?console.log(chalk.green(text)):console.log(chalk.red(text));
}

/**
 * Verifica si dentro del token tenemos un determinado perfil
 * @param token 
 * @param opcPerfil 
 */
export function tegoPermisos(token: string, opcPerfil: string)
{
    let  respuesta = {
        status: false,
        message: 'Verificación de permisos no superada',
        usuario: {} || null
    };
    respuesta.usuario = null;

    const datosToken = JSON.parse(JSON.stringify(new JWT().getInfo(token)));

    if(datosToken.status )
    {
        if(datosToken.usuario.perfil === opcPerfil)
        {
                respuesta.status = true;
                respuesta.message = `El usuario tiene permisos de ${datosToken.usuario.perfil}`;
                respuesta.usuario = datosToken.usuario;
        }
        else
        {
          respuesta.message = `El usuario tiene permisos de ${datosToken.usuario.perfil}`;
        }
    }
    else{  respuesta.message = 'TOKEN no válido';}

    return respuesta;
}

/**
 * Comprueba si una variable tiene valor o no
 * @param value       Parametro a evaluar
 */
export function checkDataIsNotNull(value: string)
{
    return ((value===''||value ===undefined))?false:true;
}

/**
 * Comprueba si un registro existe en la base a partir de su ID, siendo este de tipo string o number
 * @param db          instancia de base de datos
 * @param collection  nombre de la tabla que queremos usar
 * @param clave       campo por el que queremos filtrar
 * @param valor       valor del campo a usar
 * @param tipo        tipo del campo, para generar el filtro MongoDB
 */
export async function checkInDatabase(db: Db, collection: string, clave: string, valor: string, tipo: string = 'string') 
{  
  // Si es un number va sin comillas, si no con ellas.
  const debug=false;
  if (debug)
  {
    console.log('== IS IN DATABASE ? ========================================================================');
    console.log('collection: ' + collection);
    console.log('=====================================================');
    console.log('clave: ' + clave);
    console.log('=====================================================');
    console.log('valor:' + valor);
    console.log('=====================================================');
    console.log('tipo:' + tipo);
    console.log('===========================================================================================');
  }

  let filtro = (tipo==='number') ? JSON.parse('{"' + clave + '":'+ valor +'}'):JSON.parse('{"' + clave + '":"'+ valor +'"}');
  return  await findOneElement(db, collection, filtro);
}

export const TIPO_CAMPO =
{
  NUMBER: 'number',
  STRING: 'string'
};

export const PERFILES =
{
    ADMIN:'ADMIN',
    COOKER:'COOKER',
    USER:'USER',
};

export const JWT_LENGTH = 10;

function version()
{

}
export default version;