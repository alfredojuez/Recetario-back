import { Db } from 'mongodb';
import { IPaginationOptions } from '../interfaces/pagination-options.interface';

/**
 * Obtener el ID que vamos a usar a continuación
 * =======================================================================
 * @param database      Base de datos con la que estmos trabajando
 * @param collection    Coleccion donde queremos buscar el último ID
 * @param sort          Como queremos ordenarlo (-1 = Desc)
 */
export const asignacionID = async(
    database: Db,
    collection: string,    
    sort: object = {fecha_alta: -1},
    idField: string = 'id',
) => {
            //sumamos 1 al ID actual
            const lastElement = await database
            .collection(collection)
            .find()
            .limit(1)
            .sort(sort)
            .toArray();
            //si es el primer elemento devolvemos 1 y si no el numero +1
            const respuesta = (lastElement.length === 0)? 1: lastElement[0][idField] + 1;
            return respuesta;
            
};

export const findOneElement = async(
    database: Db,
    collection: string,
    filter: object
) => {
    return await database.collection(collection).findOne(filter);
};

export const findElements = async (
    database: Db,
    collection: string,
    filter: object = {},
    paginationOptions: IPaginationOptions = {
        page:1,
        totalPages:1,
        itemsPage: -1,
        skip:0,
        totalItems: -1
    }
) => {
    let respuesta = [];

    if (paginationOptions.totalItems === -1)
    {
        respuesta = await database.collection(collection).find(filter).toArray();
    }
    else
    {
        respuesta = await database.collection(collection)
                                  .find(filter)
                                  .limit(paginationOptions.itemsPage)
                                  .skip(paginationOptions.skip)
                                  .toArray();
    }
    return respuesta;
};

export const insertOneElement = async(
    database: Db,
    collection: string,
    document: object
)=> {
    return await database.collection(collection).insertOne(document);
};

export const insertManyElement = async(
    database: Db,
    collection: string,
    document: Array<object>
)=> {
    return await database.collection(collection).insertMany(document);
};

export const updateOneElement = async(
    database: Db,
    collection: string,
    filter: object,
    document: object,
    
)=> {
    return await database.collection(collection).updateOne(filter, { $set:document });
};

export const deleteOneElement = async(
    database: Db,
    collection: string,
    filter: object,
)=> {
    return await database.collection(collection).deleteOne(filter);
};


/**
 * Contaremos cuantos registros tenemos para la paginacion de los listados
 * @param database      Base de datos sobre la que trabajaremos 
 * @param collection    Sobre que tabla haremos la lectura
 */
export const countElements = async (
    database: Db,
    collection: string,
    filter: object = {}
) => {
    return await database.collection(collection).countDocuments(filter);
};