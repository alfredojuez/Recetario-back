import chalk from 'chalk';
import { count } from 'console';
import { Db } from 'mongodb';
import { countElements } from './db-operations';

export  async function pagination(db: Db, collection:string, filtro: object = {}, page: number = 1, itemsPage:number=20)
{
    const MAX=50;
    //comprobar el numero de items por página
    if(itemsPage<1 ||itemsPage > MAX)
    {
        itemsPage=MAX;
        console.log(chalk.yellow(`Se cambia limite de registros por página a ${MAX}, por estar fuera de los rangos permitidos`));
    }
    if(page<1)
    {
        page=1;
        console.log(chalk.yellow(`Se cambia la página solicitada por la primera por estar fuera de los rangos permitidos`));
    }

    const totalItems =await countElements(db, collection, filtro);
    const totalPages  =  Math.ceil(totalItems /itemsPage);

    const respuesta =  {
        page, 
        skip: (page -1) * itemsPage,
        itemsPage,
        totalItems,
        totalPages
    };

    return respuesta;
}