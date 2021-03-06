export interface IUsuario{
    id?: String;
    email: String;
    nombre: String;
    apellidos:  String;
    usuario: String;
    pass: String;
    fecha_nacimiento: String;
    foto: String;
    nacionalidad: String;
    perfil: String;
    fecha_alta: String;
    ultimo_login: String;
    activo: Boolean;
}

export interface IUserId4email
{
    id: String;
    usuario: String;
    email: String;
    tipo_mail: String;
}