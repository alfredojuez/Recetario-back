import chalk from 'chalk';
import { Db, Int32 } from 'mongodb';
import { LINEAS } from '../config/constant';
import logTime from '../functions';
import { IContextDB } from '../interfaces/context-db.interface';
import { IVariables } from '../interfaces/variable.interface';
import { findElements, findOneElement, insertOneElement } from '../lib/db-operations';

class ResolversOperationsService
{
    private root: object;
    private variables: IVariables;
    private context: IContextDB;
    //root, vables y contexto
    constructor(root: object, 
                variables: object,
                context: IContextDB)
    {
        this.root = root;
        this.variables = variables;
        this.context = context;
    }

    protected getVariables(): IVariables
    {
        return this.variables;   
    }

    protected getDb(): Db
    {
        return this.context.db;
    }

    
    // C: añadir
    protected async add(collection:string, documento:object, item:string) 
    {
        let respuesta = {
            status: false,
            message: `No se ha insertado el ${item}`,
            item: {},
        };

        try{
            const res = await insertOneElement(this.context.db, collection, documento);
            if (res.result.ok === 1){
                respuesta = {
                    status: true,
                    message: `Registro ${item} añadido correctamente a la base de datos`,
                    item: documento,
                };
            }
        }catch (error)
        {
            respuesta.message = `Error inesperado al insertar el ${item}: ${error}`;
        }
        return respuesta;
    }

    // R: listar  (Esta protegida para que solo se acceda desde los hijos)
    protected async list(collection: string, listElement: string) 
    {
        const LOG_NAME = `Ejecución GraphQL -> Listado de ${ listElement }`;
        console.time(LOG_NAME);

        console.log(LINEAS.TITULO_X2);
        logTime();
        console.log(`Solicitado listado de ${ listElement }`);
        
        const arrayVacio : string[] = [];

        //por defecto la respuesta es que no se ha podido hacer, salvo que obtengamos datos
        let respuesta = {
        status: false,
        message: `No se han podido leer ${ listElement } de la base de datos`,
        items: arrayVacio,
        };

        try 
        {
            const resultado = await findElements(this.context.db, collection);

            let mensaje = `No hay ningún registro de ${ listElement } en la base de datos`;
            if (resultado.length > 0) {
                mensaje = `Lista de ${ listElement } leida correctamente, total de registros: ` +
                resultado.length;
        }

        respuesta = {
            status: true,
            message: mensaje,
            items: resultado,
        };

        } catch (err) {
        console.log(err);
        }

        // Nos muestra el tiempo transcurrido finalmente
        console.log(`Recuperados ${respuesta.items.length} registros`);
        console.timeEnd(LOG_NAME);
        return respuesta;
    }
    // R: detalles

    protected async get(collection: string){
        const LOG_NAME = `Ejecución GraphQL -> Detalle de ${ collection }`;
        console.time(LOG_NAME);

        console.log(LINEAS.TITULO_X2);
        logTime();

        console.log(`Solicitada búsqueda de registro con filtro ${chalk.yellow(JSON.stringify(this.variables))} en la tabla ${chalk.yellow(collection)}`);
        
        let respuesta = {
            status: false,
            message: `Error desconocido en la lectura de ${ collection }.`,
            item: null
            };

        try{
            const result = await findOneElement(this.context.db, collection, this.variables);
            let mensaje = `Registro NO encontrado`;

            if (result)
            {
                mensaje = `Registro encontrado`;
                console.log(chalk.green(mensaje));
                
            }
            else{
                    console.log(chalk.red(mensaje));
                }

            respuesta = {
                status: true,
                message: mensaje,
                item: result,
            };
        }
        catch (error)
        {
            console.log(chalk.red('ERROR DESCONODIDO'));
            console.log(error);
        }

        console.timeEnd(LOG_NAME);
        return respuesta;        
    }
    // U: modificar

    // D: eliminar
}

export default ResolversOperationsService;