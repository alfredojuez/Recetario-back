import chalk from 'chalk';
import { IResolvers } from 'graphql-tools';
import { LINEAS } from '../../config/constant';
import { logTime } from '../../functions';
import UsuariosService from '../../services/usuarios.service';


//*********************************************************
// Usuarios(root, args, context, info)
//---------------------------------------------------------
// root:    informacion de raiz
// args:    argumentos que hayamos definido en el tipo raiz
// context: informacion que se comparte en los resolvers
// info:    informacion de la operación ejecutada
//*********************************************************
const resolversMutationUsuario: IResolvers = {
  Mutation: {
    async addUsuario(_, variables, contexto) {
      const LOG_NAME = `Ejecución GraphQL -> Alta de usuario `;
      console.time(LOG_NAME);
      console.log(LINEAS.TITULO_X2);
      logTime();
      console.log(`Solicitado alta de usuario  ${ chalk.yellow('"' + variables.usuario.usuario + '"') } `);
      const respuesta = new UsuariosService(_, variables , contexto ).insert();
      console.timeEnd(LOG_NAME);
      return respuesta;
    },
    async updateUsuario(_, variables, contexto) {        
      const LOG_NAME = `Ejecución GraphQL -> Actualización de usuario `;
      console.time(LOG_NAME);
      console.log(LINEAS.TITULO_X2);
      logTime();
      console.log(`Solicitada actualización de usuario  ${ chalk.yellow('"' + variables.usuario.usuario + '"') } con código ${ chalk.yellow('"' + variables.usuario.id + '"')}`);        
      const respuesta = new UsuariosService(_, variables, contexto ).modify();
      console.timeEnd(LOG_NAME);
      return respuesta;
    },
    async deleteUsuario(_, variables, contexto) {  
      const LOG_NAME = `Ejecución GraphQL -> Borrado de usuario `;
      console.time(LOG_NAME);
      console.log(LINEAS.TITULO_X2);
      logTime();
      console.log(`Solicitado borrado de usuario  ${ chalk.yellow('"' + variables.usuario.usuario + '"') } con código ${ chalk.yellow('"' + variables.usuario.id + '"')}`);        
      const respuesta = new UsuariosService(_, variables, contexto ).delete();
      console.timeEnd(LOG_NAME);
      return respuesta;
    },
    async blockUsuario(_, variables, contexto) {           
      const LOG_NAME = `Ejecución GraphQL -> Bloqueo de usuario `;
      console.time(LOG_NAME);
      console.log(LINEAS.TITULO_X2);
      logTime();
      console.log(`Solicitado bloqueo de usuario  ${ chalk.yellow('"' + variables.usuario.usuario + '"') } con código ${ chalk.yellow('"' + variables.usuario.id + '"')}`);        
      const respuesta = new UsuariosService(_, variables, contexto ).logicalDelete();
      console.timeEnd(LOG_NAME);
      return respuesta;
    },
    async unblockUsuario(_, variables, contexto) {     
      const LOG_NAME = `Ejecución GraphQL -> Desbloqueo de usuario `;
      console.time(LOG_NAME);
      console.log(LINEAS.TITULO_X2);
      logTime();
      console.log(`Solicitado desbloqueo de usuario  ${ chalk.yellow('"' + variables.usuario.usuario + '"') } con código ${ chalk.yellow('"' + variables.usuario.id + '"')}`);        
      const respuesta = new UsuariosService(_, variables, contexto ).logicalUndelete();
      console.timeEnd(LOG_NAME);
      return respuesta;
    },

  },  // fin del mutation
};

export default resolversMutationUsuario;
