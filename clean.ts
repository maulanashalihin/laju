import { readdir, stat, unlink } from "fs"; 
import { join } from "path";
const directory = './public';

// delete all file in folder function
function deleteFileinFolder()
{
  
    readdir(directory, (err, files) => {
        if (err) throw err;
      
        for (const file of files) {
        // check is file is folder
       

          stat(join(directory, file), function(err, stats) {
            if(!stats.isDirectory()) { 
              if(file != "manifest.json")
                unlink(join(directory, file), err => {
                    if (err) throw err;
                });
            }
          });
        }
      });
}

 
deleteFileinFolder()