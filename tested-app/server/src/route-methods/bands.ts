import { Request, Response } from 'express';

import { getBandById } from '../db-func/bands';

export async function getById(req: Request, res: Response): Promise<Response> {
  const { id } = req.params;
  try {
    const band = await getBandById(Number(id));
    return res.status(200).json({ band });
  } catch (e) {
    return res
      .status(500)
      .json({ message: `could not get band id ${id}: ${e}` });
  }
}

export default {
  getById,
};
