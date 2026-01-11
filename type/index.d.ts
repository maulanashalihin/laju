import { Request, Response } from "hyper-express";

 interface User {
  id: string;
  name: string;
  email: string;
  is_admin: boolean;
  is_verified: boolean;
}

export interface Response extends Response {
    view(view : string,data? : any) : void,
    inertia(view : string,data? : any) : void,
    flash(message : string, data : any) : Response,
}


export interface Request extends Request {
    user : User,
    share : any,
}
