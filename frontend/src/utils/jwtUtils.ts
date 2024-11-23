import jwt from 'jsonwebtoken'
import { v4 as uuidv4 } from "uuid";
import { uniqueNamesGenerator, Config, names } from "unique-names-generator";

const config: Config = {
  dictionaries: [names],
};

export const generateJWT = () => {
    const payload = {
        userId : uuidv4(),
        name : `guest-${uniqueNamesGenerator(config)}`
    };
    const secretKey = import.meta.env.VITE_SECRETCODE || "your_secret";
    console.log(secretKey)
   
    const token = jwt.sign(payload, secretKey , {
        algorithm: 'HS256',
        expiresIn: '1h'
    });
    
    return token;
}