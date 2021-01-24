import { COLLECTIONS } from '../config/constant';
import { IContextDB } from '../interfaces/context-db.interface';
import ResolversOperationsService from './resolvers-operations.service';

class NacionalidadesService extends ResolversOperationsService
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
        const result = await this.list(COLLECTIONS.NACIONALIDADES, 'nacionalidades');
        return {status: result.status, message: result.message, nacionalidades: result.items};
    }
    
    // R: detalles

    // U: modificar

    // D: eliminar
}

export default NacionalidadesService;