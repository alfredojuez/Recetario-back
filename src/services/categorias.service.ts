import chalk from 'chalk';
import { COLLECTIONS } from '../config/constant';
import { checkDataIsNotNull, checkInDatabase } from '../functions';
import { ICategoria } from '../interfaces/categoria.interface';
import { IContextDB } from '../interfaces/context-db.interface';
import { IVariables } from '../interfaces/variable.interface';
import { asignacionID } from '../lib/db-operations';
import ResolversOperationsService from './resolvers-operations.service';

class CategoriasService extends ResolversOperationsService
{    
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
            const nombreIsInDatabase = await checkInDatabase(this.getDb(), COLLECTIONS.CATEGORIAS, 'nombre', ficha.nombre);
            if (nombreIsInDatabase)
            {
                respuesta.message = `La categoria ${ficha.nombre} ya existe en la base de datos`;
            }
            else
            {
                // Buscamos el ultimo ID de la BD
                const newID = await asignacionID(this.getDb(), COLLECTIONS.CATEGORIAS, { idCategoria: -1 }, 'idCategoria') ;
                ficha.idCategoria = +newID;     //con el mas lo convierto en entero
                ficha.fecha_alta = new Date().toISOString();

                // PTE de codificar la obtención del usuario logado y su ID
                const UsuarioLogado = '1';
                // FIN PTE

                ficha.usuario_alta = UsuarioLogado;

                const result = await this.add(COLLECTIONS.CATEGORIAS, ficha, 'ingrediente');
                
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
        const result = await this.list(COLLECTIONS.CATEGORIAS, 'categorias');
        return {status: result.status, message: result.message, categorias: result.items};
    }
        
    // R: detalles
    async details()
    {
        const result = await this.get(COLLECTIONS.CATEGORIAS);
        return {status: result.status, message: result.message, categoria: result.item};
    }
    // U: modificar

    // D: eliminar
}

export default CategoriasService;