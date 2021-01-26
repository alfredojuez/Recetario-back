import { COLLECTIONS } from '../config/constant';
import { IContextDB } from '../interfaces/context-db.interface';
import ResolversOperationsService from './resolvers-operations.service';

class CategoriasService extends ResolversOperationsService
{    
    constructor(root: object, 
                variables: object,
                context: IContextDB)
    {
        //llamamos al constructor del padre
        super(root, variables, context);
    }

    // C: añadir

    // R: listar
    async items()
    {
        const result = await this.list(COLLECTIONS.CATEGORIAS, 'categorias');
        return {status: result.status, message: result.message, categoria: result.items};
    }
        
    // R: detalles
    async details()
    {
        const result = await this.get(COLLECTIONS.CATEGORIAS);
        console.log('·····································');
        console.log('categorias.service LINEA 30');
        console.log('·····································');
        console.log(result);
        return {status: result.status, message: result.message, categoria: result.item};
    }
    // U: modificar

    // D: eliminar
}

export default CategoriasService;