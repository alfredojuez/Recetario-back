import { COLLECTIONS } from '../config/constant';
import { IContextDB } from '../interfaces/context-db.interface';
import { IVariables } from '../interfaces/variable.interface';
import ResolversOperationsService from './resolvers-operations.service';
import {checkDataIsNotNull, checkInDatabase} from '../functions';
import chalk from 'chalk';
import slugify from 'slugify';

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
            message: 'La información para la nacionalidad no es correcta. ',
            nacionalidad:  {} || null,
        };

        respuesta.nacionalidad = null;

        let txtResumen = '';
        
        //Si los campos son correctos.
        if(ficha.idNacionalidad!==undefined && checkDataIsNotNull(ficha.idNacionalidad)
        && ficha.nombre!==undefined && checkDataIsNotNull(ficha.nombre))
        {
            //Comprobamos si existen en la BD
            const idIsInDatabase = await checkInDatabase(this.getDb(), COLLECTIONS.NACIONALIDADES, 'idNacionalidad', ficha.idNacionalidad);
            const nombreIsInDatabase = await checkInDatabase(this.getDb(), COLLECTIONS.NACIONALIDADES, 'nombre', ficha.nombre);
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
    
                ficha.usuario_alta = UsuarioLogado;
                const result = await this.add(COLLECTIONS.NACIONALIDADES, ficha, 'nacionalidad');
                
                if (result.status)
                {
                    respuesta.status=result.status;
                    respuesta.message=result.message;
                    respuesta.nacionalidad = result.item;
                }
            }
        }

        // pintamos los datos del resultado en el log
        (respuesta.status)?console.log(chalk.green(respuesta.message)):console.log(chalk.red(respuesta.message) + '\n' + chalk.hex('#FF3333')(txtResumen));

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