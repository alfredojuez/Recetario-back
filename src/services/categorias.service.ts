import chalk from 'chalk';
import { COLLECTIONS } from '../config/constant';
import { checkData } from '../functions';
import { ICategoria } from '../interfaces/categoria.interface';
import { IContextDB } from '../interfaces/context-db.interface';
import { IVariables } from '../interfaces/variable.interface';
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
            categoria: {}
        };
        
        if(ficha.idCategoria!==undefined && !isNaN(ficha.idCategoria)
        && ficha.nombre!==undefined && checkData(ficha.nombre))
        {
            ficha.fecha_alta = new Date().toISOString();

            // PTE de codificar la obtención del usuario logado y su ID
            const UsuarioLogado = '1';
            // FIN PTE

            ficha.usuario_alta = UsuarioLogado;
            const result = await this.add(COLLECTIONS.CATEGORIAS, ficha, 'categoria');
            if (result)
            {
                respuesta = 
                      {   status: true, 
                          message: 'Categoria guardada correctamente',
                          categoria: result.document
                      };
            }
        }

        if(respuesta.status)
        {
            console.log(chalk.green(respuesta.message));
        }
        else
        {
            console.log(chalk.red(respuesta.message));
        }

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