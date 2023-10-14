import responses from "../responses";
import Html from "../responses/Html";
import Inertia from "../responses/Inertia";
import React from "../responses/React";

class Controller {
   public async string(ctx) {
      return responses(ctx).send("Hello World");
   }

   public async json(ctx) {
      return responses(ctx).json({ message: "Hello World" });
   }

   public async redirect(ctx) {
      return responses(ctx).redirect("/login");
   }

   public async html(ctx) {
      return responses(ctx).html("<h1>Hello World</h1>");
   }

   public async jsx(ctx) {
      return React(ctx).render("home.jsx", { message: "Hello World" });
   }

   public async htmlFile(ctx) {
      return Html(ctx).render("home.html", { message: "Hello World" });
   }
   public async inertia(ctx) {
    return Inertia(ctx).render("home", { message: "Hello World" });
 }
}

export default new Controller();
