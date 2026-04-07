import * as fs from "fs";


class Command {
   /**
    * Command name is used to run the command
    */
   public args = [];

   public commandName = "make:handler";

   public run() {
      if (this.args.length > 1) {
         let filename = this.args[1] as string;

         // Convert to kebab-case and ensure .handler suffix
         filename = filename
            .replace(/([a-z])([A-Z])/g, '$1-$2') // camelCase to kebab-case
            .toLowerCase()
            .replace(/-handler$/, '') // Remove existing -handler suffix if present
            + '-handler';

         const path = "./app/handlers/" + filename + ".ts";

         if (fs.existsSync(path)) {
            console.log("File already exists");
            return;
         }

         // Extract domain name for handler object
         const handlerName = filename
            .split('-')
            .map(part => part.charAt(0).toUpperCase() + part.slice(1))
            .join('') + 'Handler';

         fs.writeFileSync(path, this.getText(handlerName));
      }
   }

   getText(handlerName: string) {
      return `/**
 * ${handlerName}
 * TODO: Add description
 */

import { Response, Request } from "../../type";
import DB from "../services/DB";
import Validator from "../services/Validator";

export const ${handlerName} = {
  /**
   * List all resources
   * GET /${handlerName.toLowerCase().replace(/([a-z])([A-Z])/g, '$1-$2').replace('handler', '')}
   */
  async index(request: Request, response: Response) {
    // TODO: Implement list logic
    return response.json({ message: "Index method" });
  },

  /**
   * Show create form
   * GET /${handlerName.toLowerCase().replace(/([a-z])([A-Z])/g, '$1-$2').replace('handler', '')}/create
   */
  async create(request: Request, response: Response) {
    // TODO: Implement create form logic
    return response.json({ message: "Create form" });
  },

  /**
   * Store new resource
   * POST /${handlerName.toLowerCase().replace(/([a-z])([A-Z])/g, '$1-$2').replace('handler', '')}
   */
  async store(request: Request, response: Response) {
    try {
      const body = await request.json();

      // TODO: Add validation schema
      // const validationResult = Validator.validate(schema, body);
      // if (!validationResult.success) {
      //   const firstError = Object.values(validationResult.errors || {})[0]?.[0] || 'Validation error';
      //   return response.flash('error', firstError).redirect('/path', 302);
      // }

      // TODO: Implement store logic

      return response.flash('success', 'Created successfully').redirect('/path', 302);
    } catch (error: any) {
      console.error('Store error:', error);
      return response.flash('error', 'An error occurred').redirect('/path', 302);
    }
  },

  /**
   * Show single resource
   * GET /${handlerName.toLowerCase().replace(/([a-z])([A-Z])/g, '$1-$2').replace('handler', '')}/:id
   */
  async show(request: Request, response: Response) {
    const { id } = request.params;
    // TODO: Implement show logic
    return response.json({ message: "Show method", id });
  },

  /**
   * Show edit form
   * GET /${handlerName.toLowerCase().replace(/([a-z])([A-Z])/g, '$1-$2').replace('handler', '')}/:id/edit
   */
  async edit(request: Request, response: Response) {
    const { id } = request.params;
    // TODO: Implement edit form logic
    return response.json({ message: "Edit form", id });
  },

  /**
   * Update resource
   * PUT /${handlerName.toLowerCase().replace(/([a-z])([A-Z])/g, '$1-$2').replace('handler', '')}/:id
   */
  async update(request: Request, response: Response) {
    try {
      const { id } = request.params;
      const body = await request.json();

      // TODO: Add validation schema
      // const validationResult = Validator.validate(schema, body);
      // if (!validationResult.success) {
      //   const firstError = Object.values(validationResult.errors || {})[0]?.[0] || 'Validation error';
      //   return response.flash('error', firstError).redirect(\`/path/\${id}/edit\`, 303);
      // }

      // TODO: Implement update logic

      return response.flash('success', 'Updated successfully').redirect('/path', 303);
    } catch (error: any) {
      console.error('Update error:', error);
      return response.flash('error', 'An error occurred').redirect('/path', 303);
    }
  },

  /**
   * Delete resource
   * DELETE /${handlerName.toLowerCase().replace(/([a-z])([A-Z])/g, '$1-$2').replace('handler', '')}/:id
   */
  async destroy(request: Request, response: Response) {
    const { id } = request.params;
    // TODO: Implement delete logic
    return response.flash('success', 'Deleted successfully').redirect('/path', 303);
  }
};

export default ${handlerName};
`;
   }
}

export default new Command();
