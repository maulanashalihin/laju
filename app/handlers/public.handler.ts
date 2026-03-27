/**
 * Public Handler
 * Handles public pages (home, about, etc.)
 */

import { Response, Request } from "../../type";
import { view } from "../services/View";

export const PublicHandler = {
  /**
   * Display home page (landing page)
   * GET /
   */
  async index(request: Request, response: Response) {
    try {
      const html = view("index.html");
      return response.type("html").send(html);
    } catch (error) {
      console.error("Error in public handler:", error);
      return response.status(500).send("Internal Server Error");
    }
  },

  /**
   * Test endpoint
   * GET /test
   */
  async test(request: Request, response: Response) {
    return response.send("test");
  },

  /**
   * Test endpoint 2
   * GET /test2
   */
  async test2(request: Request, response: Response) {
    return response.type("html").send(view("test.html"));
  },
};

export default PublicHandler;
