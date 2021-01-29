import chalk from 'chalk';
import { COLLECTIONS } from '../config/constant';
import { checkDataIsNotNull, checkInDatabase } from '../functions';
import { IContextDB } from '../interfaces/context-db.interface';
import { IVariables } from '../interfaces/variable.interface';
import { asignacionID } from '../lib/db-operations';
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
            ingrediente: {} || null,
        };

        respuesta.ingrediente = null;
        
        if( ficha.nombre!==undefined && checkDataIsNotNull(ficha.nombre) )
        {
            const nombreIsInDatabase = await checkInDatabase(this.getDb(), COLLECTIONS.INGREDIENTES, 'nombre', ficha.nombre);
            if (nombreIsInDatabase)
            {
                respuesta.message = `El ingrediente ${ficha.nombre} ya existe en la base de datos`;
                respuesta.ingrediente=null;
            }
            else
            {
                // Buscamos el ultimo ID de la BD
                const newID = await asignacionID(this.getDb(), COLLECTIONS.INGREDIENTES, { idIngrediente: -1 }, 'idIngrediente') ;
                ficha.idIngrediente = +newID;     //con el mas lo convierto en entero
                ficha.fecha_alta = new Date().toISOString();

                // PTE de codificar la obtención del usuario logado y su ID
                const UsuarioLogado = '1';
                // FIN PTE

                ficha.usuario_alta = UsuarioLogado;

                const result = await this.add(COLLECTIONS.INGREDIENTES, ficha, 'ingrediente');
                if (result)
                {
                    respuesta.status=result.status;
                    respuesta.message=result.message;
                    respuesta.ingrediente = result.item;
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

        const variables = this.getVariables();
        const id = variables.idIngrediente;
        const datosNuevoRegistro = variables.nuevoRegistro?variables.nuevoRegistro:{} ;
        
        const idIsInDatabase = await checkInDatabase(this.getDb(), COLLECTIONS.INGREDIENTES, 'idIngrediente', String(id),  'number');

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

                const result = await this.update(COLLECTIONS.INGREDIENTES, {idIngrediente: id}, ficha, 'ingrediente');

                if (result)
                {
                    respuesta.status=result.status;
                    respuesta.message=result.message;
                    respuesta.ingrediente = result.item;
                }
            }
        }
        
        // pintamos los datos del resultado en el log
        (respuesta.status)?console.log(chalk.green(respuesta.message)):console.log(chalk.red(respuesta.message));

        return respuesta;
    }

    // D: eliminar
}

export default IngredientesService;