import chalk from 'chalk';
import { COLLECTIONS, LINEAS, MAIL_TYPES, MENSAJES } from '../config/constant';
import logTime, {
  checkInDatabase,
  JWT_LENGTH,
  logResponse,
  tengoPermisos,
  TIPO_CAMPO,
} from '../functions';
import { IContextDB } from '../interfaces/context-db.interface';
import {
  asignacionID,
  findOneElement,
} from '../lib/db-operations';
import JWT from '../lib/jwt';
import bcrypt from 'bcrypt';
import ResolversOperationsService from './resolvers-operations.service';
import { PERFILES } from '../functions';

class UsuariosService extends ResolversOperationsService {
  collection = COLLECTIONS.USUARIOS;

  constructor(
    root: object,
    variables: object, //tiene que ser así y no IVariable, para el login
    context: IContextDB
  ) {
    //llamamos al constructor del padre
    super(root, variables, context);
  }

  // Autenticarnos
  async login() {
    // para el calculo del tiempo de ejecución
    const LOG_NAME = 'Ejecución GraphQL -> Validación de usuario';
    console.time(LOG_NAME);

    console.log(LINEAS.TITULO_X2);
    logTime();

    const email = this.getVariables().usuario?.email;
    const pass = this.getVariables().usuario?.pass;

    //por defecto la respuesta es que no se ha podido hacer, salvo que obtengamos datos
    var respuesta = null;
    let buscamosXEmail = null;
    let buscamosXUsuario = null;

    //Por defecto, presuponemos el error, así sabemos que llegamos al return con datos.
    respuesta = {
      status: false,
      message: MENSAJES.LOGIN_ERROR,
      token: null,
    };

    try {
      console.log(
        '· Solicitud de login con valor de email/usuario: ' +
          chalk.yellow(email)
      );

      buscamosXEmail = await findOneElement(this.getDb(), this.collection, {
        email: email,
      });
      //Si el usuario existe, verificamos la pass
      if (buscamosXEmail !== null) {
        console.log(
          `· E-mail ${email} localizado, verificamos credenciales...`
        );
        // verificamos la contraseña
        if (bcrypt.compareSync(pass, buscamosXEmail.pass)) {
          let txt = `· Usuario ${chalk.green(
            buscamosXEmail.usuario
          )} ${chalk.green('validado')}, tiene perfil de ${chalk.yellow(
            buscamosXEmail.perfil
          )}`;
          let txtPlano = `· Usuario ${
            buscamosXEmail.usuario
          } ${'validado'}, tiene perfil de ${buscamosXEmail.perfil}`;

          console.log(txt);
          respuesta = {
            status: true,
            message: txtPlano,
            token: new JWT().sign({ usuario: buscamosXEmail }),
            usuario: buscamosXEmail,
          };
        } else {
          let txt = `· Usuario ${email}, ${chalk.red(
            'no tiene acceso'
          )} usuario/contraseñas incorrectos.`;
          let txtPlano = `· Usuario ${email}, ${'no tiene acceso'} usuario/contraseñas incorrectos.`;
          console.log(txt);
          respuesta = {
            status: false,
            message: txtPlano,
            token: null,
          };
        }
      } //si el email no loga, lo probamos con usuario
      else {
        console.log(
          `· E-mail ${email} ${chalk.red(
            'no encontrado'
          )}, comprobamos acceso con usuario.`
        );
        buscamosXUsuario = await findOneElement(this.getDb(), this.collection, {
          usuario: email,
        });
        if (buscamosXUsuario !== null) {
          console.log(
            `· Usuario ${email} localizado, verificamos credenciales`
          );
          if (bcrypt.compareSync(pass, buscamosXUsuario.pass)) {
            let txt = `· Usuario ${chalk.green(
              buscamosXUsuario.usuario
            )} localizado, tiene perfil de ${chalk.yellow(
              buscamosXUsuario.perfil
            )}`;
            let txtPlano = `· Usuario ${buscamosXUsuario.usuario} localizado, tiene perfil de ${buscamosXUsuario.perfil}`;
            console.log(txt);
            respuesta = {
              status: true,
              message: txtPlano,
              token: new JWT().sign({ usuario: buscamosXUsuario }),
              usuario: buscamosXUsuario,
            };
          } else {
            let txt = `· Usuario ${email}, ${chalk.red(
              'no tiene acceso'
            )} usuario/contraseñas incorrectos.`;
            let txtPlano = `· Usuario ${email}, ${'no tiene acceso'} usuario/contraseñas incorrectos.`;
            console.log(txt);
            respuesta = {
              status: false,
              message: txtPlano,
              token: null,
            };
          }
        } else {
          let txt = `· Usuario ${email}, ${chalk.red(
            'no tiene acceso'
          )} no está registrado.`;
          let txtPlano = `· Usuario ${email}, ${'no tiene acceso'} no está registrado.`;
          console.log(txt);
          respuesta = {
            status: false,
            message: txtPlano,
            token: null,
          };
        }
      }
    } catch (err) {
      console.log(err);
    }

    // Nos muestra el tiempo transcurrido finalmente
    console.timeEnd(LOG_NAME);
    return respuesta;
  }

  //Autenticarnos
  async info() {
    const LOG_NAME = 'Ejecución GraphQL -> Registro de usuario';
    console.time(LOG_NAME);
    console.log(LINEAS.TITULO_X2);
    logTime();

    let respuesta = {
      status: false,
      message: `Validación de token incorrecta`,
      usuario: {} || null,
    };
    respuesta.usuario = null;

    //leemos los datos del token del usuario
    let tokenData = new JWT().verify(this.getContext().token!);
    if (tokenData.status) 
    {
      //convertimos el objeto devuelto en uno válido.
      const txt = `${chalk.green('Validación correcta')} del token para el usuario ${tokenData.usuario}`;
      const txtPlano = `Validación correcta del token para el usuario ${tokenData.usuario}`;
      console.log(chalk.greenBright(txt));
      respuesta = {
        status: true,
        message: txtPlano,
        usuario: tokenData.usuario,
      };
    } else {
      respuesta.message = MENSAJES.LOGIN_VERIFICATION_KO;
    }
    
    logResponse(respuesta.status, respuesta.message);
    console.timeEnd(LOG_NAME);
    return respuesta;
  }

  // C: añadir
  async insert() {
    //respuesta por defecto.
    let respuesta = {
      status: false,
      message: 'Datos de registro no válidos',
      usuario: {} || null,
    };
    respuesta.usuario = null;

    const RegistroBD = this.getVariables().usuario!; //para indicar que estamos leyenco los daots
    const db = this.getDb();

    if (RegistroBD !== undefined || null) {
      //vamos a verificar si el usuario existe antes de crearlo
      //hay que verificar que no existe ni el mail, ni el usuario
      console.log(chalk.blueBright('Solicitada alta de usuario'));
      const userCheckEmail = await checkInDatabase(
        this.getDb(),
        this.collection,
        'email',
        RegistroBD.email.toString()
      );
      console.log('Verificando la existencia del email: ' + RegistroBD.email);
      if (userCheckEmail !== null) {
        console.log('Email encontrado');
        console.log(chalk.red('Alta de usuario cancelada'));
        respuesta = {
          status: false,
          message: `El email ${RegistroBD.email} ya está registrado.`,
          usuario: null,
        };
      } else {
        console.log('Email NO encontrado');

        //verificamos si existe el nombre de usuario
        const userCheckUsuario = await checkInDatabase(
          this.getDb(),
          this.collection,
          'usuario',
          RegistroBD.usuario.toString()
        );
        console.log(
          'Verificando la existencia del usuario: ' + RegistroBD.usuario
        );
        if (userCheckUsuario !== null) {
          console.log('Usuario encontrado');
          console.log(chalk.red('Alta de usuario cancelada'));
          respuesta = {
            status: false,
            message: `El usuario ${RegistroBD.usuario} ya está en uso.`,
            usuario: null,
          };
        } else {
          console.log('Usuario NO encontrado');
          let nuevoUsuario = RegistroBD;

          // Verificamos que los datos mínimos necesarios son validos. AQUI
          if (
            nuevoUsuario.email !== undefined &&
            nuevoUsuario.email !== '' &&
            nuevoUsuario.nombre !== undefined &&
            nuevoUsuario.nombre !== '' &&
            nuevoUsuario.usuario !== undefined &&
            nuevoUsuario.usuario !== '' &&
            nuevoUsuario.pass !== undefined &&
            nuevoUsuario.pass !== '' &&
            nuevoUsuario.fecha_nacimiento !== undefined &&
            nuevoUsuario.fecha_nacimiento !== ''
          ) {
            console.log('Verificación de datos correcta');

            nuevoUsuario.id = await asignacionID(db, this.collection, {
              fecha_alta: -1,
            });
            console.log(`Se asigna el ID: ${nuevoUsuario.id} al nuevo usuario`);

            // Fecha actual en formato ISO
            const now = new Date().toISOString();

            //Añadimos los campos que son automáticos para el usuario
            nuevoUsuario.perfil = RegistroBD.perfil
              ? RegistroBD.perfil
              : PERFILES.USER;
            nuevoUsuario.fecha_alta = now;
            nuevoUsuario.ultimo_login = now;
            nuevoUsuario.activo = true;

            nuevoUsuario.pass = bcrypt.hashSync(nuevoUsuario.pass, JWT_LENGTH);

            if (await this.add(this.collection, nuevoUsuario, 'usuario')) {
              respuesta = {
                status: true,
                message: `El usuario ${nuevoUsuario.usuario} se ha registrado correctamente.`,
                usuario: nuevoUsuario,
              };
            } else {
              respuesta = {
                status: false,
                message: `El usuario ${nuevoUsuario.usuario} NO ha podido ser dado de alta. Error inesperado.`,
                usuario: null,
              };
            }
          } else {
            respuesta.message =
              'Revise los campos obligatorios para el registro de un nuevo usuario.';
          }
        }
      }
    }
    return respuesta;
  }

  // R: listar
  async items() {
    const page = this.getVariables().pagination?.page;
    const itemsPage = this.getVariables().pagination?.itemsPage;

    const result = await this.list(
      this.collection,
      'usuarios',
      { activo: true },
      page,
      itemsPage
    );
    return {
      info: result.info,
      status: result.status,
      message: result.message,
      usuarios: result.items,
    };
  }

  async inactiveItems() {
    const page = this.getVariables().pagination?.page!;
    const itemsPage = this.getVariables().pagination?.itemsPage;

    const result = await this.list(
      this.collection,
      'usuarios',
      { activo: false },
      page,
      itemsPage
    );

    return {
      info: result.info,
      status: result.status,
      message: result.message,
      usuarios: result.items,
    };
  }

  async allItems() {
    const page = this.getVariables().pagination?.page!;
    const itemsPage = this.getVariables().pagination?.itemsPage;

    const result = await this.list(
      this.collection,
      'usuarios',
      {},
      page,
      itemsPage
    );

    return {
      info: result.info,
      status: result.status,
      message: result.message,
      usuarios: result.items,
    };
  }

  // R: detalles
  async details() {
    const result = await this.get(this.collection);
    return {
      status: result.status,
      message: result.message,
      usuario: result.item,
    };
  }

  // U: modificar
  /**
   * Solo deberían modificar un usuario los ADMINs o el usuario sobre su propio registro.
   */
  async modify() 
  {
    const LOG_NAME = 'Ejecución GraphQL -> Actualización de usuario';
    console.time(LOG_NAME);
    console.log(LINEAS.TITULO_X2);
    logTime();
    console.log(chalk.blueBright(`Solicitada actualización de datos del usuario !`));

    //respuesta por defecto.
    let respuesta = 
    {
      status: false,
      message: 'Datos de usuario no válidos!',
      usuario: {} || null,
    };
    respuesta.usuario = null;

    const datos = this.getVariables();  //id y usuario {}
    const id = datos.id;
    const nuevoRegistro = datos.usuario!; //para indicar que estamos leyendo los datos
    
    if ((nuevoRegistro !== undefined || null) && id !== undefined ) 
    {
        const token = this.getContext().token?.toString();        
        
        if(token!== undefined)
        {
            const datosAcceso = tengoPermisos(token, PERFILES.ADMIN);  
            const UsuarioLogado = JSON.parse(JSON.stringify(datosAcceso.usuario)); 
            if(datosAcceso.status || (UsuarioLogado!== null  && UsuarioLogado.id === id))  //soy admin
            {
                console.log('Permisos verificados, procedemos con la actualización'); 
                //vamos a verificar si el registro existe antes
                //hay que verificar que no existe ni el mail, ni el usuario
                const userCheckID = await checkInDatabase(this.getDb(), this.collection, 'id', id.toString(),TIPO_CAMPO.NUMBER);
    
                if (userCheckID) 
                {
                        console.log(`Usuario con ${chalk.yellow('id ' + id)} encontrado`);
    
                        //Seleccionamos el filtro para la actualización
                        const filter = { id };
    
                        if (nuevoRegistro.pass !== undefined && nuevoRegistro.pass !== '') 
                        {
                          nuevoRegistro.pass = bcrypt.hashSync(nuevoRegistro.pass, JWT_LENGTH);
                        }
    
                        const resultado = await this.update( this.collection, filter, nuevoRegistro, 'usuario');
                        if (resultado) 
                        {
                          respuesta = {
                            status: true,
                            message: 'Usuario actualizado correctamente',
                            usuario: resultado.item,
                          };
                        } 
                        else 
                        {
                          respuesta.message = 'No se ha podido realizar la actualización de los datos de usuario.';
                        }
                  } 
                  else
                  {
                    respuesta.message ='No existe el registro indicado';
                  }
            }
            else
            {
              console.log(datosAcceso.message + ' y no está intentando modificar sus propios datos');
              respuesta.message = 'El usuario no tiene permisos suficientes para realizar la modificación solicitada.';
            }

        }
        else
        {
            respuesta.message = 'Necesita un token, por valor lóguese en la aplicación';
        }
    }

    logResponse(respuesta.status, respuesta.message);
    console.timeEnd(LOG_NAME);

    return respuesta;
  }

  // D: eliminar
  async delete() {
    const verbo = 'ELIMINACIÓN' ;
    //respuesta por defecto.
    let respuesta = {
      status: false,
      message: 'Datos de usuario no válidos',
      usuario: {} || null,
    };
    respuesta.usuario = null;

    const idRegistro = this.getVariables().id!; //para indicar que estamos leyendo los datos
    const datosAcceso = tengoPermisos(this.getContext().token!, PERFILES.ADMIN);

    const UsuarioLogado = JSON.parse(JSON.stringify(datosAcceso.usuario));
    if(UsuarioLogado!== null )  // tenemos token
    {
      // Solo si soy ADMIN o el usuario en si puedo hacer el borrado del usuario
      if(datosAcceso.status || UsuarioLogado.id === idRegistro)  //soy admin
      {
        console.log('Permisos verificados, procedemos con la actualización'); 
        const db = this.getDb();

        const userCheckID = await checkInDatabase(db, this.collection, 'id', idRegistro.toString(), TIPO_CAMPO.NUMBER);
        if (userCheckID) {
          console.log(`Usuario con ${chalk.yellow('ID ' + idRegistro)}  ${chalk.green('encontrado')}`);
          console.log(userCheckID);
          const result = await this.del(this.collection, { id: idRegistro }, 'usuario');

          if (result !== null && result.status) {
            respuesta = {
              status: true,
              message: `${verbo} de usuario realizada correctamente`,
              usuario: userCheckID,
            };
          }
        }
        else
        {
          respuesta.message = `Usuario no localizado en la base de datos`;
        }
      }
      else
      {
        respuesta.message ='No tiene permisos para eliminar la información de este usuario';
      }
    }
    else
    {
      respuesta.message ='No estás logado o el token no es válido.';
    }

    return respuesta;
  }

  async logicalDelete() {
    const verbo = 'DESACTIVACION';

    //respuesta por defecto.
    let respuesta = {
      status: false,
      message: 'Datos de usuario no válidos',
      usuario: {} || null,
    };
    respuesta.usuario = null;

    const idRegistro = this.getVariables().id!; //para indicar que estamos leyendo los datos
    const datosAcceso = tengoPermisos(this.getContext().token!, PERFILES.ADMIN);
    const UsuarioLogado = JSON.parse(JSON.stringify(datosAcceso.usuario));

    // Solo si soy ADMIN o el usuario en si puedo hacer el borrado del usuario
    if(UsuarioLogado)
    {
      if(datosAcceso.status || UsuarioLogado.id === idRegistro)  //soy admin
      {
        console.log('Permisos verificados, procedemos con la actualización'); 
        //desactivamos el usuario si le encontramos
        const db = this.getDb();

        const userCheckID = await checkInDatabase(db, this.collection, 'id', idRegistro.toString(), TIPO_CAMPO.NUMBER);
        if (userCheckID) 
        {
          console.log(`Usuario con ${chalk.yellow('id ' + idRegistro)} encontrado`);

          // procedemos a borrar el registro de manera logica
          let result = null;
          result = await this.block( this.collection, { id: idRegistro }, 'usuario');

          if (result.status) {
            respuesta = {
              status: true,
              message: `${verbo} de usuario realizada correctamente`,
              usuario: userCheckID,
            };
          }
          else
          {
            respuesta.message = result.message;
          }
        }
        else
        {
          respuesta.message ='El usuario no se ha podido encontrar en la BD';
        }
      }
      else
      {
        respuesta.message ='No tiene permisos para eliminar la información de este usuario';
      }
    }
    else
    {
      respuesta.message = 'No se dispone de token válido, autentíquese.';
    }

    return respuesta;
  }

  async logicalUndelete() {
    const verbo = 'ACTIVACION';

    //respuesta por defecto.
    let respuesta = {
      status: false,
      message: 'Datos de usuario no válidos',
      usuario: {} || null,
    };
    respuesta.usuario = null;
    
    const variables = this.getVariables(); //para indicar que estamos leyendo los datos
    const idRegistro = variables.id!; //para indicar que estamos leyendo los datos
    const checkToken = new JWT().verify(this.getContext().token!.toString());
    const datosToken = Object(checkToken)['usuario'];

    //dependiendo del tipo de acceso, permitiremos entrar
    let UsuarioLogado = { id:0, usuario: ''};
    let datosAcceso = false;
    // VERIFICACION DE ACCESO
    if (datosToken.tipo_mail !== undefined)
    {
      // verificacion parcial, el token viene de un mail con valor temporal
      if(datosToken.tipo_mail === MAIL_TYPES.LINK_ACTIVACION)
      {
        console.log('Verificación de token mediante LINK TOKEN');
        if (variables.id === datosToken.id)
        {
          //los datos que vienen son   id, usuario, email
          datosAcceso = true;
          UsuarioLogado.id = datosToken.id;
          console.log('Datos verificados')
        }
        else
        {
          console.log('Datos erroneos');
          //si el usuario a desbloquear no es el mismo que el que viene en el token....
          respuesta.message = 'Los datos del usuario que se desea desbloquear no han pasado la validación correctamente';
        }
      }
    }
    else
    {
      // verificación normal del token
      const soyAdmin = tengoPermisos(this.getContext().token!, PERFILES.ADMIN);
      datosAcceso = (soyAdmin.status) ? true : false;
      UsuarioLogado = JSON.parse(JSON.stringify(soyAdmin.usuario));
      console.log('Verificación de token completada correctamente');
    }

    // Solo si soy ADMIN o el usuario en si puedo hacer el borrado del usuario
      if(datosAcceso || UsuarioLogado.id === idRegistro)  //soy admin
      {
        console.log('Permisos verificados, procedemos con la actualización'); 
        //desactivamos el usuario si le encontramos
        const db = this.getDb();
        // console.log(`Buscamos en la base de datos el ID ${idRegistro} en la tabla ${this.collection}`);

        const userCheckID = await checkInDatabase(db, this.collection, 'id', idRegistro.toString(), TIPO_CAMPO.NUMBER);
        if (userCheckID) 
        {
          console.log(`Usuario con ${chalk.yellow('id ' + idRegistro)} encontrado`);

          // procedemos a borrar el registro de manera logica
          let result = null;
          result = await this.unblock( this.collection, { id: idRegistro }, 'usuario');
          if (result.status) {
            respuesta = {
              status: true,
              message: `${verbo} de usuario realizada correctamente`,
              usuario: userCheckID,
            };
          }
          else
          {
            respuesta.message = result.message;
          }
        }
        else
        {
          respuesta.message ='El usuario no se ha podido encontrar en la BD';
        }
      }
      else
      {
        respuesta.message ='No tiene permisos para eliminar la información de este usuario';
      }
    return respuesta;
  }
}

export default UsuariosService;
