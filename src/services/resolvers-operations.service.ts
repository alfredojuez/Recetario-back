import { LINEAS } from '../config/constant';
import logTime from '../functions';
import { IContextDB } from '../interfaces/context-db.interface';
import { findElements } from '../lib/db-operations';

class ResolversOperationsService
{
    private root: object;
    private variables: object;
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

    // C: añadir

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

    // U: modificar

    // D: eliminar
}

export default ResolversOperationsService;