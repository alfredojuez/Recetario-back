import chalk from 'chalk';
import { Db } from 'mongodb';
import { findOneElement } from '../lib/db-operations';
//import { LINEAS } from '../config/constant';

//Función que pinta en el log la fecha y hora actuales
function logTime() {
  const ahora = new Date();
  const options = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };

  console.log(chalk.gray(`${ahora.toLocaleDateString('es-ES',options)} ${ahora.toLocaleTimeString()}`));
  
}

export default logTime;

export function checkDataIsNotNull(value: string)
{
    return ((value===''||value ===undefined))?false:true;
}

export async function checkInDatabase(db: Db, collection: string, clave: string, valor: string, tipo: string = 'string') 
{  
  // Si es un number va sin comillas, si no con ellas.
  let filtro = (tipo==='number') ? JSON.parse('{"' + clave + '":'+ valor +'}'):JSON.parse('{"' + clave + '":"'+ valor +'"}');
  return  await findOneElement(db, collection, filtro);
}

