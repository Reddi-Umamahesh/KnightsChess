

// import { PrismaClient } from "@prisma/client";

// const prisma = new PrismaClient();
interface GameInput {
  whitePlayerId: string;
  blackPlayerId: string;
    gameId: string;
    boardState: string;
}

async function createGame({ whitePlayerId, blackPlayerId, gameId , boardState }: GameInput) {
    // try {
    //     const game = await prisma.game.create({
    //       data: {
    //         gameId: gameId,
    //         status: "IN_PROGRESS",
    //         boardState: boardState,
    //         startTime: new Date(),
    //         whitePlayerId: whitePlayerId,
    //         blackPlayerId: blackPlayerId,
    //       },
    //     });
    //     return game
    // } catch (e) {
    //     console.error(e)
    //     throw e
    // }
}

export {createGame};