/* eslint-disable @typescript-eslint/no-shadow */
import { Request, Response } from 'express';

import {
  addReservation,
  deleteReservation,
  getReservationById,
} from '../db-func/reservations';
import { getShowById, getShows } from '../db-func/shows';

// enums can't be imported with the ts-loader
export enum TicketAction {
  hold = 'hold',
  purchase = 'purchase',
  release = 'release',
  cancelPurchase = 'cancel purchase',
}

const getErrorMessage = (e: unknown) =>
  e instanceof Error ? e.message : 'unknown error';

export async function get(req: Request, res: Response): Promise<Response> {
  try {
    const shows = await getShows();
    return res.status(200).json({ shows });
  } catch (e) {
    return res.status(500).json({
      message: `could not get shows: ${e}`,
    });
  }
}

export async function getById(req: Request, res: Response): Promise<Response> {
  const { id } = req.params;
  try {
    const show = await getShowById(Number(id));
    return res.status(200).json({ show });
  } catch (e) {
    return res
      .status(500)
      .json({ message: `could not get show id ${id}: ${e}` });
  }
}

export async function hold(req: Request, res: Response): Promise<Response> {
  const { showId, holdId } = req.params;
  const { seatCount, userId } = req.body;
  try {
    await addReservation({
      id: Number(holdId),
      showId: Number(showId),
      userId: Number(userId),
      seatCount: Number(seatCount),
      type: TicketAction.hold,
    });
    return res.status(204).send();
  } catch (e) {
    const message = getErrorMessage(e);
    return res.status(500).json({ message: `could not hold: ${message}` });
  }
}

export async function purchase(req: Request, res: Response): Promise<Response> {
  const { showId, holdId } = req.params;
  const { seatCount, userId } = req.body;
  try {
    await addReservation({
      id: Number(holdId),
      showId: Number(showId),
      userId: Number(userId),
      seatCount: Number(seatCount),
      type: TicketAction.hold,
    });
    return res.status(204).send();
  } catch (e) {
    const message = getErrorMessage(e);
    return res.status(500).json({ message: `could not purchase: ${message}` });
  }
}

export async function release(req: Request, res: Response): Promise<Response> {
  const { holdId } = req.params;
  const holdIdNumber = Number(holdId);
  if (Number.isNaN(holdIdNumber)) {
    return res.status(400).json({ message: `bad holdId: ${holdId}` });
  }
  try {
    await deleteReservation(holdIdNumber);
    return res.status(204).send();
  } catch (e) {
    const message = getErrorMessage(e);
    return res
      .status(500)
      .json({ message: `could not release hold: ${message}` });
  }
}

export async function cancelPurchase(
  req: Request,
  res: Response,
): Promise<Response> {
  const { purchaseId } = req.params;
  const purchaseIdNumber = Number(purchaseId);
  if (Number.isNaN(purchaseIdNumber)) {
    return res.status(400).json({ message: `bad purchaseId: ${purchaseId}` });
  }
  try {
    // don't generate error if purchase isn't in the db, since
    // it's possible we're cancelling an aborted purchase that never
    // made it into the system.
    if (await getReservationById(purchaseIdNumber)) {
      await deleteReservation(purchaseIdNumber);
    }
    return res.status(204).send();
  } catch (e) {
    const message = getErrorMessage(e);
    return res
      .status(500)
      .json({ message: `could not release hold: ${message}` });
  }
}

export default {
  get,
  getById,
  hold,
  purchase,
  release,
};
