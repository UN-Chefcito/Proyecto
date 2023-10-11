import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { createHmac } from "crypto";

import { UserInterface } from "../schemas/user.schema";

const prisma = new PrismaClient();


export const userInfo = async (request: Request, response: Response): Promise<Response> => {

    const tokenPayload = request.body.payload;

    const user = await prisma.user.findUnique({
        where: {
            email: tokenPayload.email
        }
    });

    if (!user) {
        return response.status(404).json({ message: "Not found" });
    }

    return response.status(200).json(user);
}