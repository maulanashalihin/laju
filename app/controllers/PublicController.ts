import { Response, Request } from "../../type";
import { view } from "../services/View";

class Controller {

    public async index (request : Request,response : Response) {
       
        try {
            const html = view("index.html"); 
            return response.type("html").send(html);
        } catch (error) {
            console.error("Error in home controller:", error);
            return response.status(500).send("Internal Server Error");
        }
    }

    public async test (request : Request,response : Response) {
 
        return response.send("test");
    }

    public async test2 (request : Request,response : Response) {
 
        return    response.type("html").send(view("test.html"));
    }
}

export default new Controller()
