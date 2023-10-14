import MakeController from "./commands/native/MakeController";

const args = process.argv.slice(2);

const [filetype, filename] = args;

switch (filetype) {
    case 'controller':
        MakeController.run(filename);
        break;
    case 'command':
        console.log("create command")
        break;
    case 'page':
        const pageTemplate = require('./templates/page');
        pageTemplate(filename);
        break;
    default:
        console.error('Unknown filetype: ' + filetype);
        break;
}


