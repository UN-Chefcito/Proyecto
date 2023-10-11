import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { createHmac } from "crypto";
import * as jose from "jose";

import { LoginInterface } from "../schemas/login.schema";
import { UserInterface } from "../schemas/user.schema";
import { JWT_SECRET, JWT_PRIVATE, JWT_PUBLIC } from "../config/config";
import { generateKeyPairSync } from "crypto";

const prisma = new PrismaClient();


/**
 * 
 * Generates a JWT token
 * 
 * Generates a JWT token using the jose library for a given payload
 * 
 * @param {any} payload - The payload to be encrypted
 * 
 * @returns {Promise<string>}- The encrypted token
 */
async function generateToken(payload: any): Promise<string> {

    // const { privateKey, publicKey } = generateKeyPairSync("ed25519");

    // console.log({
    //     private: privateKey.export({ format: "der", type: "pkcs8" }).toString("base64"),
    //     public: publicKey.export({ format: "der", type: "spki" }).toString("base64"),
    // });

    const privateKey = jose.base64url.decode(JWT_PRIVATE);

    return await new jose.SignJWT(payload)
        .setProtectedHeader({ alg: "HS512" })
        .setIssuedAt()
        .setIssuer("https://un-chefcito.com/api")
        .setAudience("https://un-chefcito.com/")
        .setExpirationTime("8h")
        .setSubject(payload.email || "")
        .sign(privateKey)
}

/**
 * 
 * Creates a new User
 * 
 * @param request
 * @param response
 * 
 * @returns {Promise<Response>}
 */
export const signUp = async (request: Request, response: Response): Promise<Response> => {
    const newUser = request.body as UserInterface;

    try {
        newUser.password = createHmac("sha512", "").update(newUser.password!).digest("hex");
    
        await prisma.user.create({
            data: {
                ...newUser,
            },
        });
        
        return response.status(201).json({
            message: "User created successfully",
        });

    } catch (error: any) {
        let errorMessage = {
            statusCode: 0,
            message: "",
        }

        error.code === "P2002" && error.meta.target.includes("email")
        ? errorMessage = { statusCode: 400, message: "Email already exists" }
        : errorMessage = { statusCode: 500, message: "Internal Server Error" }

        return response.status(errorMessage.statusCode).json({
            message: errorMessage.message,
        });
    }

}


/**
 * 
 * Login a User
 * 
 * Login a registered user and returns a JWT token if the credentials are valid
 * with a message indicating if the login was successful or not.
 * 
 * @param request 
 * @param response 
 * @returns {Promise<Response>} - Json response with a message and a token if the login was successful
 */
export const login = async (request: Request, response: Response): Promise<Response> => {

    const loginData = request.body as LoginInterface;

    try {
        const user = await prisma.user.findUnique({
            where: {
                email: loginData.email,
            }
        });

        if (!user) {
            return response.status(401).json({
                message: "Invalid email or password",
            });
        }

        const hashedPassword = createHmac("sha512", "").update(loginData.password).digest("hex");

        if (user.password !== hashedPassword) {
            return response.status(401).json({
                message: "Invalid credentials",
            });
        }

        const token = await generateToken({
            name: user.name,
            email: user.email,
        });

        return response.status(200).json({
            message: "Login successful",
            token,
        });

    } catch (error: any) {
        console.log(error);
        return response.status(500).json({
            message: "Internal Server Error",
        });
    }
}