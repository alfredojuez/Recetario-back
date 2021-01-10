import chalk from 'chalk';
import { LINEAS } from '../config/constant';

//Función que pinta en el log la fecha y hora actuales
function logTime() {
  const ahora = new Date();
  const options = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };

  console.log(LINEAS.SEPARADOR_X2);
  console.log(chalk.gray(`${ahora.toLocaleDateString('es-ES',options)} ${ahora.toLocaleTimeString()}`));
  
}

export default logTime;

