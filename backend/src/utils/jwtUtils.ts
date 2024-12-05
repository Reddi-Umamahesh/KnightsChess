import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { uniqueNamesGenerator, Config, names, adjectives, animals } from "unique-names-generator";

const config: Config = {
  dictionaries: [adjectives , animals],
 
};

export const generateJWT = () => {
  console.log("generated in be");
  const payload = {
    userId: uuidv4(),
    name: `${uniqueNamesGenerator(config)}`,
  };
  const secretKey = process.env.SECRETCODE || "your_secret";
  console.log(secretKey);

  const token = jwt.sign(payload, secretKey, {
    algorithm: "HS256",
    expiresIn: "1h",
  });

  return token;
};
