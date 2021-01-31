import chalk from 'chalk';
import { COLLECTIONS } from '../config/constant';
import { checkDataIsNotNull, checkInDatabase } from '../functions';
import { ICategoria } from '../interfaces/categoria.interface';
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
        const ficha = this.getVariables();

        //valor por defecto.
        let respuesta = 
        {
            status: false, 
            message: 'La información para la categoria no es correcta.',
            categoria:  {} || null,
        };

        respuesta.categoria = null;
        
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

                ficha.usuario_alta = UsuarioLogado;

                const result = await this.add(this.collection, ficha, 'ingrediente');
                
                if (result)
                {
                    respuesta.status=result.status;
                    respuesta.message=result.message;
                    respuesta.categoria = result.item;
                }
            }
        }

        // pintamos los datos del resultado en el log
        (respuesta.status)?console.log(chalk.green(respuesta.message)):console.log(chalk.red(respuesta.message));

        return respuesta;
    }

    // R: listar
    async items()
    {
        const result = await this.list(this.collection, 'categorias');
        return {status: result.status, message: result.message, categorias: result.items};
    }
        
    // R: detalles
    async details()
    {
        const result = await this.get(this.collection);
        return {status: result.status, message: result.message, categoria: result.item};
    }

    // U: modificar
    async modify()
    {
        //valor por defecto.
        let respuesta = 
        {
            status: false, 
            message: 'La información para la categoria no es correcta.',
            categoria:  {} || null,
        };
        respuesta.categoria = null;

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

            //campos modificables
            // nombre, familia, descripcion, foto, calorias
            const camposModificables = ['nombre', 'descripcion', 'foto'];

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
                console.log('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXxxx');
                let info = new JWT().verify(this.getContext().token!);
                if (info.status)
                {
                    console.log('· Usuario válido');
                    const datos = info.usuario;
                    console.log(typeof  datos);
                    console.log(datos!);

                    const UsuarioLogado = 2;
     
                    ficha.usuario_modificacion = UsuarioLogado;
                    ficha.fecha_modificacion = new Date().toISOString();
    
                    const result = await this.update(this.collection, {idCategoria: id}, ficha, 'categoria');
    
                    if (result)
                    {
                        respuesta.status=result.status;
                        respuesta.message=result.message;
                        respuesta.categoria = result.item;
                    }
                }
                else
                {
                    console.log(info);
                    respuesta.message = 'TOKEN de seguridad no válido.';
                }
            }
        }
        
        // pintamos los datos del resultado en el log
        (respuesta.status)?console.log(chalk.green(respuesta.message)):console.log(chalk.red(respuesta.message));

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
        
        // pintamos los datos del resultado en el log
        (respuesta.status)?console.log(chalk.green(respuesta.message)):console.log(chalk.red(respuesta.message));

        return respuesta;
    }
}

export default CategoriasService;