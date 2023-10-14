import Cookie from "../services/Cookie";

class Controller {
    
  public async index (ctx) { 
     
    return new Response("Hello World");
  }

  public async create () {
  }

  public async store () {
  }

  public async show () {
    return new Response("Hello World");
  }

  public async edit () {
  }

  public async update () {
  }

  public async destroy () {
  }

}

export default new Controller()
  