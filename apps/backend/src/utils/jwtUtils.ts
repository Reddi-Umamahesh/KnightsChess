import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import {
  uniqueNamesGenerator,
  Config,
  names,
  adjectives,
  animals,
} from "unique-names-generator";

const config: Config = {
  dictionaries: [animals],
};

export const generateJWT = () => {
  console.log("generated in be");
  const payload = {
    id: uuidv4(),
    name: `${uniqueNamesGenerator(config)}`,
  };
  const secretKey = process.env.SECRETCODE || "add_your_secret";
  console.log(secretKey);

  const token = jwt.sign(payload, secretKey, {
    algorithm: "HS256",
    expiresIn: "5h",
  });

  return token;
};
