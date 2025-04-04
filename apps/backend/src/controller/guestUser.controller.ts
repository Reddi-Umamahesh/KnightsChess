import { v4 as uuidv4 } from "uuid";
import {
  uniqueNamesGenerator,
  Config,
  names,
  adjectives,
  animals,
} from "unique-names-generator";
import { db } from "../db";
import { Request, Response } from "express";
import { setUser } from "../utils/auth";

const config: Config = {
  dictionaries: [animals],
};

export const createGuestUser = async (req: Request, res: Response) => {
  try {
    const id = uuidv4();
    const guestUser = await db.user.create({
      data: {
        id: id,
        name: `${uniqueNamesGenerator(config)}`,
        email: `${id}@guest.com`,
        password: "",
        isGuest: true,
      },
    });

    console.log(guestUser);
    const token = setUser(guestUser);
    console.log("login sucecessful");
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "strict",
      maxAge: 60 * 60 * 24, 
    });
    res.status(200).json({
      message: "Login successful",
      success: true,
      token: token,
    });
    return;
  } catch (e) {
    console.log(e);
    res
      .status(400)
      .send({ message: "Unable to create , try again", success: false });
    return;
  }
};
