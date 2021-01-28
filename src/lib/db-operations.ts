import chalk from 'chalk';
import { Db } from 'mongodb';
import { LINEAS } from '../config/constant';

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
    filter: object = {}
) => {
    return await database.collection(collection).find(filter).toArray();
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

