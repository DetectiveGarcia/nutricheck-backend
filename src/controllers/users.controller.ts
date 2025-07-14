import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import type { RegisterUserBody, LoginUserBody } from "../../types/users";
import { userExist } from "../../utils/prisma";
import { comparePasswords, hashPassword } from "../../utils/bcrypt";
import { signJWT, verifyJWT } from "../../utils/jwt";

const prisma = new PrismaClient();

//register a new user
export async function registerUser(
  req: Request<{}, RegisterUserBody>,
  res: Response
) {
  const { email, firstName, lastName, password } = req.body;

  if (!email || !firstName || !lastName || !password) {
    res.status(400).json({ error: "Missing required fields" });
    return;
  }
  const isRegistered = await userExist(email);

  if (isRegistered) {
    res.status(409).json({ error: "User is already registered" });
    return;
  }

  const hashedPassword = await hashPassword(password);

  try {
    const user = await prisma.user.create({
      data: {
        email,
        firstName,
        lastName,
        password: hashedPassword,
        refreshToken: "",
      },
    });

    const accessToken = await signJWT({ userId: user.id }); //15min
    const refreshToken = await signJWT({ userId: user.id }, "7d");

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        refreshToken,
      },
    });

    res
      .status(201)
      .json({ message: "User created", accessToken, refreshToken, user });
    return;
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Failed to create user" });
    return;
  }
}

export async function loginUser(
  req: Request<{}, {}, LoginUserBody>,
  res: Response
) {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ error: "Missing required fields" });
    return;
  }

  const isRegistered = await userExist(email);

  if (!isRegistered) {
    res.status(401).json({ error: "Invalid email or password" });
    return;
  }

  try {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    const correctPassword = await comparePasswords(password, user.password);
    if (!correctPassword) {
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }

    const accessToken = await signJWT({ userId: user.id });
    const refreshToken = await signJWT({ userId: user.id }, "7d");

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        refreshToken,
      },
    });

    res.status(200).json({
      message: "Login Successful",
      accessToken,
      refreshToken,
      userId: user.id,
    });
    return;
  } catch (error) {
    console.log("loginUser error: " + error);
    throw new Error("loginUser error");
  }
}

export async function refreshToken(req: Request, res: Response) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ message: "No refresh token provided" }); //401 om token saknas
    return;
  }

  const refreshToken = authHeader.split(" ")[1];

  try {
    const decoded = await verifyJWT(refreshToken);

    if (!decoded || typeof decoded !== "object" || !decoded.userId) {
      res.status(401).json({ message: "Invalid refresh token" }); //401 om token är fel
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    if (user.refreshToken !== refreshToken) {
      res.status(403).json({ message: "Refresh token mismatch" });
      return;
    }

    const newRefreshToken = await signJWT({ userId: user.id }, "7d");
    const newAccessToken = await signJWT({ userId: user.id });

    await prisma.user.update({
      where: { id: user.id },
      data: {
        refreshToken: newRefreshToken,
      },
    });

    res.status(200).json({
      message: "Access token refreshed",
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      userId: user.id,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
}

export async function getMe(req: Request, res: Response) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({ message: "No token provided" }); //401 om token saknas
      return;
    }

    const token = authHeader.split(" ")[1];

    const decoded = await verifyJWT(token); //{ "userId": "cmc27zx240000130wt8716xn6", "iat": 1752100904, "exp": 1752101204 }

    //TODO: if !decoded

    const me = await prisma.user.findUnique({
      where: {
        id: decoded.userId,
      },
    });

    //TODO if !me

    res.status(200).json({ me });
  } catch (error) {
    console.log("getMe error: " + error);
    res.status(500).json({ error: "Failed to get user" + error });
  }
}

export async function getMyProducts(req: Request, res: Response) {
  try {
    const authHeader = req.headers.authorization;

    //TODO if(!authHeader)

    const token = authHeader.split(" ")[1];

    const decoded = await verifyJWT(token);

    //TODO if (!decoded)

    const userId = decoded.userId;


    const myProducts = await prisma.chatGPTRes.findMany({
      where: {
        userId,
      },
    });

    console.log("myProducts: " + myProducts);

    if (myProducts.length === 0) {
      res.status(200).json({ message: "No products stored" });
      return;
    }

    res.status(200).json({ myProducts });
  } catch (error) {
    console.log("getMyProducts error: " + error);
    res.status(500).json({ error });
  }
}
