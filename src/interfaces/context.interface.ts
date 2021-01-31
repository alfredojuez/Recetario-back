interface IRequest {
    headers: {
        authorization: string;
    };
}

interface IConnection
{
    authorization: string;
}

interface IContext {
    req: IRequest;
    connection: IConnection;
}

export default IContext;