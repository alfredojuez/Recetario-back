import { COLLECTIONS } from '../config/constant';
import { checkDataIsNotNull, checkInDatabase, logResponse, PERFILES, tegoPermisos } from '../functions';
//import { ICategoria } from '../interfaces/categoria.interface';
import { IContextDB } from '../interfaces/context-db.interface';
import { IVariables } from '../interfaces/variable.interface';
import { asignacionID } from '../lib/db-operations';
import JWT from '../lib/jwt';
import ResolversOperationsService from './resolvers-operations.service';

class CategoriasService extends ResolversOperationsService
{    

    collection = COLLECTIONS.CATEGORIAS;

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
            message: 'La información para la categoria no es correcta.',
            categoria:  {} || null,
        };
        respuesta.categoria = null;

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
                    respuesta.message = `La categoria ${ficha.nombre} ya existe en la base de datos`;
                }
                else
                {
                    // Buscamos el ultimo ID de la BD
                    const newID = await asignacionID(this.getDb(), this.collection, { idCategoria: -1 }, 'idCategoria') ;
                    ficha.idCategoria = +newID;     //con el mas lo convierto en entero
                    ficha.fecha_alta = new Date().toISOString();

                    // PTE de codificar la obtención del usuario logado y su ID
                    const UsuarioLogado = '1';
                    // FIN PTE

                    ficha.usuario_alta = Number.parseInt(UsuarioLogado, 10);

                    const result = await this.add(this.collection, ficha, 'ingrediente');
                    
                    if (result)
                    {
                        respuesta.status=result.status;
                        respuesta.message=result.message;
                        respuesta.categoria = result.item;
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
        logResponse(respuesta.status, respuesta.message);

        return respuesta;
    }

    // R: listar
    async items()
    {
        const page = this.getVariables().pagination?.page!;
        const itemsPage = this.getVariables().pagination?.itemsPage;
        const respuesta = await this.list(this.collection, 'categorias', {}, page, itemsPage);

        return {info: respuesta.info, status: respuesta.status, message: respuesta.message, categorias: respuesta.items};
    }
        
    // R: detalles
    async details()
    {
        const respuesta = await this.get(this.collection);        
        return {status: respuesta.status, message: respuesta.message, categoria: respuesta.item};
    }

    // U: modificar
    async modify()
    {
        //valor por defecto.
        let respuesta = 
        {
            status: false, 
            message: 'La información para la categoria no es correcta.',
            categoria: {} || null,
        };
        respuesta.categoria = null;

        // solo los administradores pueden modificar categorias.
        const datosAcceso = tegoPermisos(this.getContext().token!, PERFILES.ADMIN);
        if(datosAcceso.status)
        {
            console.log('Permisos verificados, procedemos con la actualización');
            const UsuarioLogado = JSON.parse(JSON.stringify(datosAcceso.usuario));
            const variables = this.getVariables();
            const id = variables.idCategoria;
            const datosNuevoRegistro = variables.nuevoRegistro?variables.nuevoRegistro:{} ;
            
            const idIsInDatabase = await checkInDatabase(this.getDb(), this.collection, 'idCategoria', String(id),  'number');
            if (!idIsInDatabase)
            {
                respuesta.message = `La categoria no existe en la base de datos, no se puede modificar`;
            }
            else
            {
                console.log('Registro encontrado en BD');
                let ficha = idIsInDatabase;
                let campoValido = false;

                //campos modificables  (Actualizamos los campos que nos vengan con contenido).
                const camposModificables = ['nombre', 'descripcion', 'foto'];
                camposModificables.forEach( function(campo) 
                {
                    const valor = Object(datosNuevoRegistro)[campo];
                    if( valor!==undefined && checkDataIsNotNull(valor) )
                    {
                        campoValido = true;     //indicamos que al menos un campo se ha actualizado
                        // console.log(`Cambiamos el valor ${ficha[campo]} por ${valor}`);
                        ficha[campo] = valor;
                    }
                });
    
                if(campoValido)
                {
                    ficha.usuario_modificacion = Number.parseInt(UsuarioLogado.id, 10);
                    ficha.fecha_modificacion = new Date().toISOString();
    
                    const result = await this.update(this.collection, {idCategoria: id}, ficha, 'categoria');
                    if (result)
                    {
                        respuesta.status=result.status;
                        respuesta.message=result.message;
                        respuesta.categoria = result.item;
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
            message: 'La información para el borrado de la categoria no es correcta.',
            categoria:  {} || null,
        };
        respuesta.categoria = null;

         //Sólo el usuario admin puede borrar cosas.
         const datosAcceso = tegoPermisos(this.getContext().token!, PERFILES.ADMIN);
         if(datosAcceso.status)
         {
            const id = this.getVariables().idCategoria;
            
            const idIsInDatabase = await checkInDatabase(this.getDb(), this.collection, 'idCategoria', String(id),  'number');

            if (!idIsInDatabase)
            {
                respuesta.message = `La categoria no existe en la base de datos, no se puede eliminar`;
            }
            else
            {
                console.log('Registro encontrado en BD');
                const result = await this.del(this.collection, {idCategoria: id}, 'categoria');

                if (result)
                {
                    respuesta.status=result.status;
                    respuesta.message=result.message;
                    respuesta.categoria = idIsInDatabase;
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

export default CategoriasService;