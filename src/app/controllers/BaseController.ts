import { Request, Response } from 'express';

interface BaseController {
  index(_: Request, res: Response): Promise<Response>;
  store(req: Request, res: Response): Promise<Response>;
  update(req: Request, res: Response): Promise<Response>;
  delete(req: Request, res: Response): Promise<Response>;
}
export { BaseController };
