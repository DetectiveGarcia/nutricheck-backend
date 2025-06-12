import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import type { registerUserBody } from '../../types/users'

const prisma = new PrismaClient();


//register a new user
export async function registerUser(req: Request<{}, registerUserBody>, res: Response) {
  const { email, firstName, lastName, password } = req.body;

  try {
    const user = await prisma.user.create({
      data: {
        email,
        firstName,
        lastName,
        password, // In a real application, ensure to hash the password before saving it
      },
    });
    res.status(201).json(user);
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Failed to create user" });
  }

}