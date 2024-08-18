import { Request, Response } from "express";

export const pinkCheck = (_req: Request, res: Response) => {
  // console.log(req.url);
  return res.status(200).json({
    message: "Ping check ok",
  });
};
