export interface IPaginationOptions{
    // Página seleccionada
    page: number;
    // Numero de documentos mostrados por página
    itemsPage:number;   
    // Numero de registros que queremos saltar
    skip:number;
    // Numero total de registos de la búsqueda
    totalItems:number;
    // Páginas que contiene el resultado
    totalPages:number;

}