import { COLLECTIONS } from '../config/constant';
import { IContextDB } from '../interfaces/context-db.interface';
import { IVariables } from '../interfaces/variable.interface';
import ResolversOperationsService from './resolvers-operations.service';
import {checkDataIsNotNull, checkInDatabase, logResponse, PERFILES, tegoPermisos} from '../functions';
import chalk from 'chalk';
import slugify from 'slugify';

class NacionalidadesService extends ResolversOperationsService
{    
    collection = COLLECTIONS.NACIONALIDADES;

    constructor(root: object, 
                variables: IVariables,
                context: IContextDB)
    {
        //llamamos al constructor del padre
        super(root, variables, context);
    }

    // C: añadir
    async insert()
    {
        const ficha = this.getVariables();

        //valor por defecto.
        let respuesta = 
        {
            status: false, 
            message: 'La información para la nacionalidad no es correcta. ',
            nacionalidad:  {} || null,
        };

        respuesta.nacionalidad = null;

        let txtResumen = '';
        
        //Los usuarios no tienen permisos, solo los administradores y cocineros.
        const datosAcceso = tegoPermisos(this.getContext().token!, PERFILES.USER);
        if(!datosAcceso.status)
        {
            //Si los campos son correctos.
            if(ficha.idNacionalidad!==undefined && checkDataIsNotNull(ficha.idNacionalidad)
            && ficha.nombre!==undefined && checkDataIsNotNull(ficha.nombre))
            {
                //Comprobamos si existen en la BD
                const idIsInDatabase = await checkInDatabase(this.getDb(), this.collection, 'idNacionalidad', ficha.idNacionalidad);
                const nombreIsInDatabase = await checkInDatabase(this.getDb(), this.collection, 'nombre', ficha.nombre);
                if (nombreIsInDatabase!==null || idIsInDatabase!==null)
                {
                    const txtID =(idIsInDatabase) ? `La nacionalidad ${ficha.nombre} ya existe en la base de datos`: '';
                    const txtNombre = (nombreIsInDatabase) ? `El código ${ficha.idNacionalidad} ya existe en la base de datos`: '';
                    txtResumen += txtID + ' ' + txtNombre;
                }
                else
                {
                    ficha.fecha_alta = new Date().toISOString();
                    ficha.icono= slugify(ficha.nombre,{lower:true}) + '.png';

                    // PTE de codificar la obtención del usuario logado y su ID
                    const UsuarioLogado = '1';
                    // FIN PTE
        
                    ficha.usuario_alta = Number.parseInt(UsuarioLogado, 10);
                    const result = await this.add(this.collection, ficha, 'nacionalidad');
                    
                    if (result.status)
                    {
                        respuesta.status=result.status;
                        respuesta.message=result.message;
                        respuesta.nacionalidad = result.item;
                    }
                }
            }
        }
        else
        {
            console.log('No se puede proceder a la creación del registro');
            respuesta.message = 'No tiene permisos suficientes para realizar esta operación';
        }
        // pintamos los datos del resultado en el log
        (respuesta.status)?console.log(chalk.green(respuesta.message)):console.log(chalk.red(respuesta.message) + '\n' + chalk.hex('#FF3333')(txtResumen));

        return respuesta;
    }

    // R: listar
    async items()
    {
        const page = this.getVariables().pagination?.page;
        const itemsPage = this.getVariables().pagination?.itemsPage;
        
        const result = await this.list(this.collection, 'nacionalidades', {}, page, itemsPage);

        return {info: result.info, status: result.status, message: result.message, nacionalidades: result.items};
    }
    
    // R: detalles
    async details()
    {
        const result = await this.get(this.collection);
        return {status: result.status, message: result.message, nacionalidad: result.item};
    }

    // U: modificar
    async modify()
    {
        //valor por defecto.
        let respuesta = 
        {
            status: false, 
            message: 'La información la nacionalidad no es correcta.',
            nacionalidad:  {} || null,
        };
        respuesta.nacionalidad = null;

        //Los usuarios no tienen permisos, solo los administradores y cocineros.
        const datosAcceso = tegoPermisos(this.getContext().token!, PERFILES.ADMIN);
        if(datosAcceso.status)
        {
            const variables = this.getVariables();
            const id = variables.idNacionalidad;
            const datosNuevoRegistro = variables.nuevoRegistro?variables.nuevoRegistro:{} ;
            
            const idIsInDatabase = await checkInDatabase(this.getDb(), this.collection, 'idNacionalidad', String(id),  'string');

            if (!idIsInDatabase)
            {
                respuesta.message = `La nacionalidad no existe en la base de datos, no se puede modificar`;
            }
            else
            {
                console.log('Registro encontrado en BD');
                let ficha = idIsInDatabase;

                let campoValido = false;
                
                //campos modificables
                // nombre, descripcion, foto, c
                const camposModificables = ['nombre', 'descripcion'];

                // actualizamos los campos que nos vengan con contenido.
                camposModificables.forEach( function(campo) 
                {
                    const valor = Object(datosNuevoRegistro)[campo];

                    if( valor!==undefined && checkDataIsNotNull(valor) )
                    {
                        campoValido = true;
                        ficha[campo] = valor;
                        if(campo === 'nombre')
                        {
                            ficha.icono= slugify(ficha.nombre,{lower:true}) + '.png';
                        }
                    }
                });

                if(campoValido)
                {
                    // PTE de codificar la obtención del usuario logado y su ID
                    const UsuarioLogado = '1';
                    // FIN PTE

                    ficha.usuario_modificacion = Number.parseInt(UsuarioLogado, 10);
                    ficha.fecha_modificacion = new Date().toISOString();

                    const result = await this.update(this.collection, {idNacionalidad: id}, ficha, 'nacionalidad');

                    if (result)
                    {
                        respuesta.status=result.status;
                        respuesta.message=result.message;
                        respuesta.nacionalidad = result.item;
                    }
                }
            }
        }
        else
        {
            console.log('No se puede proceder a la actualización del registro');
            respuesta.message = 'No tiene permisos suficientes para realizar esta operación';
        }

        // pintamos los datos del resultado en el log
        logResponse(respuesta.status, respuesta.message);

        return respuesta;
    }

    // D: eliminar
    async delete()
    {
        //valor por defecto.
        let respuesta = 
        {
            status: false, 
            message: 'La información para el borrado de la nacionalidad no es correcta.',
            nacionalidad:  {} || null,
        };
        respuesta.nacionalidad = null;
        //Los usuarios no tienen permisos, solo los administradores y cocineros.
        const datosAcceso = tegoPermisos(this.getContext().token!, PERFILES.ADMIN);
        if(datosAcceso.status)
        {
            const id = this.getVariables().idNacionalidad;
            
            const idIsInDatabase = await checkInDatabase(this.getDb(), this.collection, 'idNacionalidad', String(id),  'string');

            if (!idIsInDatabase)
            {
                respuesta.message = `La nacionalidad no existe en la base de datos, no se puede eliminar`;
            }
            else
            {
                console.log('Registro encontrado en BD');
                const result = await this.del(this.collection, {idNacionalidad: id}, 'nacionalidad');

                    if (result)
                    {
                        respuesta.status=result.status;
                        respuesta.message=result.message;
                        respuesta.nacionalidad = idIsInDatabase;
                    }
            }
        }
        else
        {
            console.log('No se puede proceder al borrrado del registro');
            respuesta.message = 'No tiene permisos suficientes para realizar esta operación';
        }
        // pintamos los datos del resultado en el log
        logResponse(respuesta.status, respuesta.message);

        return respuesta;
    }
}

export default NacionalidadesService;