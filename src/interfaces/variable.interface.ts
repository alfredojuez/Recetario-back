//Listado de variables que queremos usar en el Servicio de resolver-operations
export interface IVariables{    
    // Categoria
    idCategoria?: number;    
    // Ingrediente{
    idIngrediente?: number;    
    // Nacinalidad
    idNacionalidad?: string;
    // Comun a los tres...
    nombre?: string;
    //otros campos
    foto?: string;
    icono?: string;
    descripcion?: string;

    //comun a todo perro pichichi
    fecha_alta?: string;
    usuario_alta?: string;
    fecha_modificacion?: string;
    usuario_modificacion?: string;

    nuevoRegistro?: IVariables;
}