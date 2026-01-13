import { Response, Request } from "../../type";
import { view } from "../services/View";

class Controller {

    public async index (request : Request,response : Response) {
        console.log("masuk sini")
        try {
            const html = view("index.html");
            console.log("view result length:", html?.length);
            return response.type("html").send(html);
        } catch (error) {
            console.error("Error in home controller:", error);
            return response.status(500).send("Internal Server Error");
        }
    }
}

export default new Controller()
