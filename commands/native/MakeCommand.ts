import * as fs from "fs";

class Command {
   /**
    * Command name is used to run the command
    */

   public run(filename: string) {
       
      const path = "./commands/" + filename + ".ts";

      if (fs.existsSync(path)) {
         //file exists

         console.log("File already exists");
         return;
      }

      fs.writeFileSync(path, this.getText());

      console.log(`Command ${filename} created`);
   }

   getText() {
      return ` 
import DB from "../app/db";
import { users } from "../app/db/schema";

const result = await DB.select().from(users)

console.log(result) 
  `;
   }
}

export default new Command();
