import MakeCommand from "./commands/native/MakeCommand";
import MakeController from "./commands/native/MakeController";

const args = process.argv.slice(2);

const [filetype, filename] = args;

switch (filetype) {
    case 'controller':
        MakeController.run(filename);
        break;
    case 'command':
        MakeCommand.run(filename); 
        break; 
    default:
        console.error('Unknown filetype: ' + filetype);
        break;
}


