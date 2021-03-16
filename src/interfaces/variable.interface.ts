import { IPaginationOptions } from './pagination-options.interface';
import { IUsuario } from './usuario.interface';

//Listado de variables que queremos usar en el Servicio de resolver-operations
export interface IVariables{
    // Usuario
    id?: number;
    // Categoria
    idCategoria?: number;    
    // Ingrediente{
    idIngrediente?: number;    
    // Nacionalidad
    idNacionalidad?: string;
    //Receta
    idReceta?: number;
    // Comun a los muchos...
    nombre?: string;
    //otros campos
    foto?: string;
    icono?: string;
    descripcion?: string;

    //comun a todo perro pichichi
    fecha_alta?: string;
    usuario_alta?: number;
    fecha_modificacion?: string;
    usuario_modificacion?: number;

    nuevoRegistro?: IVariables;
    usuario?: IUsuario;

    //Opciones para la paginación de los datos. (opcional)
    pagination?: IPaginationOptions;
    page?: number;
    itemsPage?: number;

}