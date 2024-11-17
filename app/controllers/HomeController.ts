import { Response, Request } from "../../type"; 
import { view } from "../services/View";

class Controller {
    
    public async index (request : Request,response : Response) { 
        return response.type("html").send(view("index.html"));
    }
}

export default new Controller()
