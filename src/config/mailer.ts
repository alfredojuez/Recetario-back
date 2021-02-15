import chalk from 'chalk';
import nodemailer from 'nodemailer';
import { LINEAS } from './constant';

export const transport = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: process.env.USER_EMAIL, 
      pass: process.env.USER_PASSWORD, 
    },
});

transport.verify().then(() => {
    console.log(LINEAS.IMPORTANTE_X2);
    console.log(`# ${chalk.blueBright('Conexión con servidor de correo...')}`);
    console.log(`# ${LINEAS.SEPARADOR}`)
    console.log(`# STATUS: ${chalk.green('ONLINE')}`);
    console.log(`# MESSAGE: ${chalk.green('Mailer conectado y a la espera de contenido.')}`);
    console.log(LINEAS.IMPORTANTE_X2);
}).catch( error => {
    console.log(LINEAS.IMPORTANTE_X2);
    console.log(`# ${chalk.blueBright('Conexión con servidor de correo...')}`);
    console.log(`# ${LINEAS.SEPARADOR}`)
    console.log(`# STATUS: ${chalk.red('OFFLINE')}`);
    console.log(`# MESSAGE: ${chalk.red(error)}`);
    console.log(LINEAS.IMPORTANTE_X2);
});