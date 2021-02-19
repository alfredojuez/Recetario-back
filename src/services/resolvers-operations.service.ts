import chalk from 'chalk';
import { Db, Int32 } from 'mongodb';
import { LINEAS } from '../config/constant';
import { logTime, logResponse } from '../functions';
import { IContextDB } from '../interfaces/context-db.interface';
import { IVariables } from '../interfaces/variable.interface';
import { deleteOneElement, findElements, findOneElement, insertOneElement, updateOneElement  } from '../lib/db-operations';
import { pagination } from '../lib/pagination';

class ResolversOperationsService
{
    private root: object;
    private variables: IVariables;
    private context: IContextDB;
    //root, vables y contexto
    constructor(root: object, 
                variables: IVariables,
                context: IContextDB)
    {
        this.root = root;
        this.variables = variables;
        this.context = context;
    }

    protected getVariables(): IVariables{ return this.variables; }

    protected getContext(): IContextDB  { return this.context; }

    protected getDb(): Db               { return this.context.db!; }
    
    // C: añadir
    protected async add(collection:string, documento:object, item:string) 
    {
        let respuesta = {
            status: false,
            message: `No se ha insertado el ${item}`,
            item: {} || null,
        };
        respuesta.item = null;

        try{
            const res = await insertOneElement(this.getDb(), collection, documento);
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
    protected async list(collection: string, listElement: string, filtro: object = {}, page: number = 1, itemsPage: number = 20) 
    {
        const variables = this.getVariables();
        const paginationData = await pagination(this.getDb(), collection, filtro, variables.pagination?.page, variables.pagination?.itemsPage);

        //por defecto la respuesta es que no se ha podido hacer, salvo que obtengamos datos
        let respuesta = {
            info:{} ||null,
            status: false,
            message: `No se han podido leer ${ listElement } de la base de datos`,
            items: {} || null,
        };
        respuesta.info = null;
        respuesta.items = null;
        let contador = 0;

        try 
        {
            const resultado = await findElements(this.getDb(), collection, filtro, paginationData);
            //paginationData.totalItems = resultado.length;
            let mensaje = `No hay ningún registro de ${ listElement } en la base de datos`;
            contador = resultado.length;

            respuesta = {
                info: paginationData ,
                status: true,
                message: `Lista de ${ listElement } leida correctamente, total de registros: ` + contador,
                items: resultado,
            };

        } catch (err) {
            respuesta.message = 'Error desconocido: ' + err;
        }

        return respuesta;
    }
    // R: detalles

    protected async get(collection: string)
    {
        let respuesta = {
            status: false,
            message: `Error desconocido en la lectura de ${ collection }.`,
            item: null
            };

        try{
            respuesta.message = `Registro NO encontrado`;
            const result = await findOneElement(this.getDb(), collection, this.variables);
            
            if (result)
            {
                respuesta = {
                    status: true,
                    message: `Registro encontrado`,
                    item: result,
                };
            }
        }
        catch (error)
        {
            respuesta.message = 'ERROR DESCONODIDO: ' + error;
        }

        
        return respuesta;        
    }

    // U: modificar
    protected async update(collection:string, filter:object, objUpdate: object, item:string)
    {
        let respuesta = {
            status: false,
            message: `No se ha modificado el ${item}`,
            item: {} || null,
        };
        respuesta.item = null;

        try{
            const res = await  updateOneElement(
                this.getDb(),
                collection,
                filter,
                objUpdate
              );
            if (res.result.nModified === 1){
                respuesta = {
                    status: true,
                    message: `Registro ${item} actualizado correctamente a la base de datos`,
                    item: Object.assign({}, filter, objUpdate),
                };
            }
            else
            {
                respuesta.status = true;    //el trabajo ya estaba hecho.
                respuesta.message = `No había campos que actualizar en la BD, ya eran correctos`;
            }
        }catch (error)
        {
            respuesta.message = `Error inesperado al actualizar ${item}: ${error}`;
        }

        return respuesta;
    }
    
    // D: eliminar
    protected async del(collection:string, filter:object, item:string)
    {
        let respuesta = {
            status: false,
            message: `No se ha eliminado ${item}`,
            item: {} || null,
        };
        respuesta.item = null;

        try{
            const res = await deleteOneElement(
                this.getDb(),
                collection,
                filter,
              );

            if (res.result.ok === 1){
                respuesta = {
                    status: true,
                    message: `Registro ${item} eliminado correctamente`,
                    item: Object.assign({}, filter),
                };
            }
        }catch (error)
        {
            respuesta.message = `Error inesperado al eliminar ${item}: ${error}`;
        }

        return respuesta;
    }

    protected async block(collection:string, filter:object, item:string)
    {
        const respuesta = await this.update(collection, filter, { activo:false }, item);
        return respuesta;
    }

    protected async unblock(collection:string, filter:object, item:string)
    {
        const respuesta = await this.update(collection, filter, { activo:true }, item);
        return respuesta;
    }
}

export default ResolversOperationsService;