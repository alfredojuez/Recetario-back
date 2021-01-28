import { COLLECTIONS } from '../config/constant';
import { IContextDB } from '../interfaces/context-db.interface';
import { IVariables } from '../interfaces/variable.interface';
import ResolversOperationsService from './resolvers-operations.service';
import {checkDataIsNotNull, checkInDatabase} from '../functions';
import chalk from 'chalk';

class NacionalidadesService extends ResolversOperationsService
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
            message: 'La información para la nacionalidad no es correcta.',
            nacionalidad: {}
        };
        
        //Si los campos son correctos.
        if(ficha.idNacionalidad!==undefined && checkDataIsNotNull(ficha.idNacionalidad)
        && ficha.nombre!==undefined && checkDataIsNotNull(ficha.nombre))
        {
            //Comprobamos si existen en la BD
            const idIsInDatabase = await checkInDatabase(this.getDb(), COLLECTIONS.NACIONALIDADES, 'idNacionalidad', ficha.idNacionalidad);
            const nombreIsInDatabase = await checkInDatabase(this.getDb(), COLLECTIONS.NACIONALIDADES, 'nombre', ficha.nombre);
            if (nombreIsInDatabase!==null || idIsInDatabase!==null)
            {
                respuesta.message = `La nacionalidad ${ficha.nombre} o su codigo ${ficha.idNacionalidad} ya existe en la base de datos`;
            }
            else
            {
                ficha.fecha_alta = new Date().toISOString();

                // PTE de codificar la obtención del usuario logado y su ID
                const UsuarioLogado = '1';
                // FIN PTE
    
                ficha.usuario_alta = UsuarioLogado;
                const result = await this.add(COLLECTIONS.NACIONALIDADES, ficha, 'nacionalidad');
                if (result)
                {
                    respuesta = 
                          {   status: true, 
                              message: 'Nacionalidad guardada correctamente',
                              nacionalidad: result.item
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
        const result = await this.list(COLLECTIONS.NACIONALIDADES, 'nacionalidades');
        return {status: result.status, message: result.message, nacionalidades: result.items};
    }
    
    // R: detalles
    async details()
    {
        const result = await this.get(COLLECTIONS.NACIONALIDADES);
        return {status: result.status, message: result.message, nacionalidad: result.item};
    }
    // U: modificar

    async demoError()
    {
        var respuesta = 
        {
            status: false, 
            message: 'La información para la nacionalidad no es correcta.',
            valor: {}
        };

        if(1===1)
        {
            respuesta =
            {
                status: true, 
                message: 'resultado positivo',
                valor: {dato:'dato'}
            };
        }
        return respuesta;
    }

    // D: eliminar
}

export default NacionalidadesService;