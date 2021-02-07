import { COLLECTIONS } from '../config/constant';
import { checkDataIsNotNull, checkInDatabase, logResponse, PERFILES, tegoPermisos } from '../functions';
import { IContextDB } from '../interfaces/context-db.interface';
import { IVariables } from '../interfaces/variable.interface';
import { asignacionID } from '../lib/db-operations';
import ResolversOperationsService from './resolvers-operations.service';

class IngredientesService extends ResolversOperationsService
{    

    collection = COLLECTIONS.INGREDIENTES;

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
        //valor por defecto.
        let respuesta = 
        {
            status: false, 
            message: 'La información para el ingrediente no es correcta.',
            ingrediente: {} || null,
        };
        respuesta.ingrediente = null;

        //Los usuarios no tienen permisos, solo los administradores y cocineros.
        const datosAcceso = tegoPermisos(this.getContext().token!, PERFILES.USER);
        if(!datosAcceso.status)
        {

            const ficha = this.getVariables();

        
            if( ficha.nombre!==undefined && checkDataIsNotNull(ficha.nombre) )
            {
                const nombreIsInDatabase = await checkInDatabase(this.getDb(), this.collection, 'nombre', ficha.nombre);
                if (nombreIsInDatabase)
                {
                    respuesta.message = `El ingrediente ${ficha.nombre} ya existe en la base de datos`;
                    respuesta.ingrediente=null;
                }
                else
                {
                    // Buscamos el ultimo ID de la BD
                    const newID = await asignacionID(this.getDb(), this.collection, { idIngrediente: -1 }, 'idIngrediente') ;
                    ficha.idIngrediente = +newID;     //con el mas lo convierto en entero
                    ficha.fecha_alta = new Date().toISOString();

                    // PTE de codificar la obtención del usuario logado y su ID
                    const UsuarioLogado = '1';
                    // FIN PTE

                    ficha.usuario_alta = UsuarioLogado;

                    const result = await this.add(this.collection, ficha, 'ingrediente');
                    if (result)
                    {
                        respuesta.status=result.status;
                        respuesta.message=result.message;
                        respuesta.ingrediente = result.item;
                    }
                }            
            }

        }
        else
        {
            console.log('No se puede proceder al registro ');
            respuesta.message = datosAcceso.message;
        }
        // pintamos los datos del resultado en el log
        logResponse(respuesta.status, respuesta.message);

        return respuesta;
    }

    // R: listar
    async items()
    {        
        const page = this.getVariables().pagination?.page;
        const itemsPage = this.getVariables().pagination?.itemsPage;

        const result = await this.list(this.collection, 'ingredientes', {}, page, itemsPage);

        return {info: result.info, status: result.status, message: result.message, ingredientes: result.items};
    }

    // R: detalles
    async details()
    {
        const result = await this.get(this.collection);
        return {status: result.status, message: result.message, ingrediente: result.item};
    }
    
    // U: modificar
    async modify()
    {
        //valor por defecto.
        let respuesta = 
        {
            status: false, 
            message: 'La información el ingrediente no es correcta.',
            ingrediente:  {} || null,
        };
        respuesta.ingrediente = null;
        
        //Sólo admin
        const datosAcceso = tegoPermisos(this.getContext().token!, PERFILES.ADMIN);
        if(datosAcceso.status)
        {

            const variables = this.getVariables();
            const id = variables.idIngrediente;
            const datosNuevoRegistro = variables.nuevoRegistro?variables.nuevoRegistro:{} ;
            
            const idIsInDatabase = await checkInDatabase(this.getDb(), this.collection, 'idIngrediente', String(id),  'number');

            if (!idIsInDatabase)
            {
                respuesta.message = `El ingrediente no existe en la base de datos, no se puede modificar`;
            }
            else
            {
                console.log('Registro encontrado en BD');
                let ficha = idIsInDatabase;

                let campoValido = false;
                
                //campos modificables
                // nombre, familia, descripcion, foto, calorias
                const camposModificables = ['nombre', 'familia', 'descripcion', 'foto', 'calorias'];

                // actualizamos los campos que nos vengan con contenido.
                camposModificables.forEach( function(campo) 
                {
                    const valor = Object(datosNuevoRegistro)[campo];

                    if( valor!==undefined && checkDataIsNotNull(valor) )
                    {
                        campoValido = true;
                        console.log(`Cambiamos el valor ${ficha[campo]} por ${valor}`);
                        ficha[campo] = valor;
                    }
                });

                if(campoValido)
                {
                    // PTE de codificar la obtención del usuario logado y su ID
                    const UsuarioLogado = '1';
                    // FIN PTE

                    ficha.usuario_modificacion = UsuarioLogado;
                    ficha.fecha_modificacion = new Date().toISOString();

                    const result = await this.update(this.collection, {idIngrediente: id}, ficha, 'ingrediente');

                    if (result)
                    {
                        respuesta.status=result.status;
                        respuesta.message=result.message;
                        respuesta.ingrediente = result.item;
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
            message: 'La información para el borrado del ingrediente no es correcta.',
            ingrediente:  {} || null,
        };
        respuesta.ingrediente = null;

        // solo los administradores .
        const datosAcceso = tegoPermisos(this.getContext().token!, PERFILES.ADMIN);
        if(datosAcceso.status)
        {
            const id = this.getVariables().idIngrediente;        
            const idIsInDatabase = await checkInDatabase(this.getDb(), this.collection, 'idIngrediente', String(id),  'number');

            if (!idIsInDatabase)
            {
                respuesta.message = `El ingrediente no existe en la base de datos, no se puede eliminar`;
            }
            else
            {
                console.log('Registro encontrado en BD');
                const result = await this.del(this.collection, {idIngrediente: id}, 'ingrediente');

                    if (result)
                    {
                        respuesta.status=result.status;
                        respuesta.message=result.message;
                        respuesta.ingrediente = idIsInDatabase;
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

export default IngredientesService;