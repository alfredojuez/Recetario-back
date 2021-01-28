import chalk from 'chalk';
import { COLLECTIONS } from '../config/constant';
import { checkDataIsNotNull, checkInDatabase } from '../functions';
import { IContextDB } from '../interfaces/context-db.interface';
import { IVariables } from '../interfaces/variable.interface';
import ResolversOperationsService from './resolvers-operations.service';

class IngredientesService extends ResolversOperationsService
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
            message: 'La información para el ingrediente no es correcta.',
            ingrediente: {}
        };
        
        if(ficha.idIngrediente!==undefined && !isNaN(ficha.idIngrediente)
        && ficha.nombre!==undefined && checkDataIsNotNull(ficha.nombre))
        {
            const nombreIsInDatabase = await checkInDatabase(this.getDb(), COLLECTIONS.INGREDIENTES, 'nombre', ficha.nombre);
            if (nombreIsInDatabase)
            {
                respuesta.message = `El ingrediente ${ficha.nombre} ya existe en la base de datos`;
            }
            else
            {
                ficha.fecha_alta = new Date().toISOString();

                // PTE de codificar la obtención del usuario logado y su ID
                const UsuarioLogado = '1';
                // FIN PTE

                ficha.usuario_alta = UsuarioLogado;

                const result = await this.add(COLLECTIONS.INGREDIENTES, ficha, 'ingrediente');
                if (result)
                {
                    respuesta = 
                        {   status: true, 
                            message: 'Ingrediente guardado correctamente',
                            ingrediente: result.item
                        };
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
        const result = await this.list(COLLECTIONS.INGREDIENTES, 'ingredientes');
        return {status: result.status, message: result.message, ingredientes: result.items};
    }

    // R: detalles
    async details()
    {
        const result = await this.get(COLLECTIONS.INGREDIENTES);
        return {status: result.status, message: result.message, ingrediente: result.item};
    }
    // U: modificar

    // D: eliminar
}

export default IngredientesService;