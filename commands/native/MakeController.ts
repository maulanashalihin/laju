import * as fs from "fs";

class Command {
   /**
    * Command name is used to run the command
    */

   public run(filename: string) {
      if (!filename.includes("Controller")) {
         filename = filename + "Controller";
      }

      const path = "./app/controllers/" + filename + ".ts";

      if (fs.existsSync(path)) {
         //file exists

         console.log(`${filename} already exists`);
         return;
      }

      fs.writeFileSync(path, this.getText());

      console.log(`Controller ${filename} created`);
   }

   getText() {
      return ` 
class Controller {
    
  public async index () { 
  }

  public async create () {
  }

  public async store () {
  }

  public async show () {
  }

  public async edit () {
  }

  public async update () {
  }

  public async destroy () {
  }

}

export default new Controller()
  `;
   }
}

export default new Command();
