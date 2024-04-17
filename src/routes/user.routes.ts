import { Request, Response, Router } from "express";
import { UserController } from "../controllers/user.controller";

class UserRoutes {
  router: Router = Router();

  constructor() {
    this.initRoutes();
  }

  initRoutes() {
    this.router.post("/create", async (req: Request, res: Response) => {
      try {
        if (!req.body) {
          return res.status(500).json({ message: "Empty body" });
        }

        const newUser = await UserController.createUser(req.body);

        return res.status(201).json(newUser);
      } catch (error: unknown) {
        return res.status(500).json({ message: (error as Error).message });
      }
    });

    this.router.get("/get/:id", async (req: Request, res: Response) => {
      try {
        const id = req.params.id;
        if (!id) {
          return res.status(400).json({ message: "Id is required" });
        }

        const newUser = await UserController.getUser(id);

        if (!newUser.user) {
          return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json(newUser);
      } catch (error: unknown) {
        return res.status(500).json({ message: (error as Error).message });
      }
    });

    this.router.get("/get", async (req: Request, res: Response) => {
      try {
        const email = req.query.email;
        if (!email) {
          return res.status(400).json({ message: "Email is required" });
        }

        const newUser = await UserController.getUserByEmail(email as string);

        if (!newUser.user) {
          return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json(newUser);
      } catch (error: unknown) {
        return res.status(500).json({ message: (error as Error).message });
      }
    });

    this.router.put("/update/:id", async (req: Request, res: Response) => {
      try {
        const id = req.params.id;
        if (!id) {
          return res.status(400).json({ message: "Id is required" });
        }

        if (!req.body) {
          return res.status(500).json({ message: "Empty body" });
        }

        const newUser = await UserController.updateUser(id, req.body);

        if (!newUser.user) {
          return res.status(404).json({ message: "User not found" });
        }

        return res.status(204);
      } catch (error: unknown) {
        return res.status(500).json({ message: (error as Error).message });
      }
    });

    this.router.delete("/delete/:id", async (req: Request, res: Response) => {
      try {
        const id = req.params.id;
        if (!id) {
          return res.status(400).json({ message: "Id is required" });
        }

        const newUser = await UserController.deleteUser(id);

        if (!newUser.user) {
          return res.status(404).json({ message: "User not found" });
        }

        return res.status(204);
      } catch (error: unknown) {
        return res.status(500).json({ message: (error as Error).message });
      }
    });
  }
}

export default new UserRoutes().router;
