import { Request, Response, NextFunction } from 'express';
import  * as jose from 'jose';
import { JWT_PRIVATE } from '../config/config';



/**
 * Middleware function that checks if the request has a valid authorization token.
 * 
 * If the token is not present or invalid, it returns a 401 Unauthorized response.
 * 
 * 
 * @param req - Express Request object.
 * @param res - Express Response object.
 * @param next - Express NextFunction object.
 * @returns A NextFunction object, a Response object or undefined.
 */
const authorizationMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<NextFunction|Response|undefined> => {
    
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    
    let token = authHeader.split(' ')[1];
    const { payload, isTokenValid } = await tokenValidator(token);

    if(isTokenValid) req.body.payload = payload;
    
    isTokenValid
        ? next()
        : res.status(401).json({ message: 'Unauthorized' });
};


/**
 * 
 * Validates the JWT token using a secret key and options.
 * 
 * If the token is valid, the function returns true, otherwise it returns false
 * 
 * 
 * @param token - The JWT token to be validated
 * @returns A Promise that resolves to a boolean indicating whether the token is valid or not.
 */
const tokenValidator = async (token: string): Promise<{payload: jose.JWTPayload, isTokenValid: boolean}> => {
    let emptyPayload: jose.JWTPayload = {};
    if(token  === '') return { payload: emptyPayload, isTokenValid: false };

    const options: jose.JWTVerifyOptions = {
        algorithms: ['HS512'],
        issuer: 'https://un-chefcito.com/api', 
        audience: 'https://un-chefcito.com/',
        clockTolerance: 30, // The allowed clock skew in seconds
    };

    const secret = jose.base64url.decode(JWT_PRIVATE)

    try {
        const { payload, protectedHeader } = await jose.jwtVerify(token, secret, options);
        return { payload: payload, isTokenValid: !!payload };
    } catch (error) {
        return { payload: emptyPayload, isTokenValid: false };
    }
}


const tokenDecoder = async (token: string): Promise<jose.JWTPayload> => {
    const options: jose.JWTVerifyOptions = {
        algorithms: ['HS512'],
        issuer: 'https://un-chefcito.com/api', 
        audience: 'https://un-chefcito.com/',
        clockTolerance: 30, // The allowed clock skew in seconds
    };

    const secret = jose.base64url.decode(JWT_PRIVATE)

    const { payload, protectedHeader } = await jose.jwtVerify(token, secret, options);
    return payload;
}

export { authorizationMiddleware, tokenDecoder };
