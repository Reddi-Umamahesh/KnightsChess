

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
interface GameInput {
  whitePlayerId: string;
  blackPlayerId: string;
    gameId: string;
    boardState: string;
}

