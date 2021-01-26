import { COLLECTIONS } from '../config/constant';
import { IContextDB } from '../interfaces/context-db.interface';
import ResolversOperationsService from './resolvers-operations.service';

class UsuariosService extends ResolversOperationsService
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
        const result = await this.list(COLLECTIONS.USUARIOS, 'usuarios');
        return {status: result.status, message: result.message, usuarios: result.items};
    }
        
    // R: detalles
    async details()
    {
        const result = await this.get(COLLECTIONS.USUARIOS);
        return {status: result.status, message: result.message, usuario: result.item};
    }
    // U: modificar

    // D: eliminar
}

export default UsuariosService;