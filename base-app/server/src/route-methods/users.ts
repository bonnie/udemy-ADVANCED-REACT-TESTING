import { Request, Response } from 'express';

import { User } from '../../../shared/types';
import { AuthUser, createJWT, hashPassword, passwordIsValid } from '../auth';
import {
  addUser,
  deleteUser,
  getUserById,
  getUsers,
  updateUser,
} from '../db-func/users';
import { AuthRequest } from '../middlewares';

function removePasswordandAddToken(user: AuthUser): User {
  // use "object rest operator" to remove properties in a typescript-friendly way
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { salt, keylen, iterations, hash, digest, ...cleanUser } = user;

  // create token
  const token = createJWT(cleanUser);

  // return user with token
  return { ...cleanUser, token };
}

export async function getById(
  req: AuthRequest,
  res: Response,
): Promise<Response> {
  try {
    if (!req.auth) throw new Error('Cannot get user without login');

    // get fresh user data
    const userData = await getUserById(req.auth.id);

    // remove password data from user object
    const user = removePasswordandAddToken(userData);

    // return user and appointments
    return res.status(200).json({ user });
  } catch (e) {
    return res.status(500).json({ message: `could not get user: ${e}` });
  }
}

export async function create(req: Request, res: Response): Promise<Response> {
  try {
    const { email, password } = req.body;
    const existingUsers = await getUsers();
    const takenEmail = existingUsers.map((u) => u.email).includes(email);
    if (takenEmail) {
      return res.status(400).json({ message: 'Email is already in use' });
    }

    const userPasswordData = hashPassword(password);
    const newUser = await addUser({
      email,
      ...userPasswordData,
    });

    const user = removePasswordandAddToken(newUser);

    return res.status(201).json({ user });
  } catch (e) {
    return res.status(500).json({ message: `could not add user: ${e}` });
  }
}

export async function remove(
  req: AuthRequest,
  res: Response,
): Promise<Response> {
  try {
    const { id } = req.params;
    await deleteUser(Number(id));
    return res.status(204).send();
  } catch (e) {
    return res.status(500).json({ message: `could not delete user: ${e}` });
  }
}

export async function update(
  req: AuthRequest,
  res: Response,
): Promise<Response> {
  try {
    const { id } = req.params;
    const { patch } = req.body;
    if (!patch) {
      return res
        .status(400)
        .json({ message: 'this endpoint requires a patch in the body' });
    }
    const updatedUser = await updateUser(Number(id), patch);
    const user = removePasswordandAddToken(updatedUser);

    return res.status(200).json({ user });
  } catch (e) {
    return res
      .status(500)
      .json({ message: `could not update appointment: ${e}` });
  }
}

export async function auth(req: Request, res: Response): Promise<Response> {
  const { email, password } = req.body;

  // auth user
  const users = await getUsers();
  const validUser = users.reduce(
    (foundUser: AuthUser | null, user) =>
      user.email === email && passwordIsValid(password, user)
        ? user
        : foundUser,
    null,
  );

  if (!validUser) return res.status(400).json({ message: 'Invalid login' });

  // create jwt
  const user = removePasswordandAddToken(validUser);

  return res.status(200).json({ user });
}

export default {
  getById,
  create,
  remove,
  update,
  auth,
};
