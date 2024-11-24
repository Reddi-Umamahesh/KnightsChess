import WebSocket from "ws";
import { jwtUserClaims } from "./auth";

export class User {
  public userId: string;
  public name: string;
  public socket: WebSocket;
  public isGuest: boolean;

  constructor(decoded: jwtUserClaims, ws: WebSocket) {
    this.userId = decoded.userId;
    this.name = decoded.name;
    this.socket = ws;
    this.isGuest = decoded.isGuest;
  }
}

export class SockerManager {
  private static instance: SockerManager;
  private interestedSockets: Map<string, User[]>; // k -room Id & val-users
  private userRoomMapping: Map<string, string>; // key-userId , val-roomId

  constructor() {
    this.interestedSockets = new Map<string, User[]>();
    this.userRoomMapping = new Map<string, string>();
  }

  static getInstance() {
    if (!SockerManager.instance) {
      SockerManager.instance = new SockerManager();
    }
    return SockerManager.instance;
  }

  addUser(userId: string, gameId: string) {
    this.interestedSockets.set(gameId, [
      ...(this.interestedSockets.get(gameId) || []),
    ]);
    this.userRoomMapping.set(userId, gameId);
    console.log("user added");
  }

  broadcast(gameId: string, message: string) {
    const users = this.interestedSockets.get(gameId);
    if (!users) {
      console.log("no users found");
    }
    users?.map((g) => {
      g.socket.send(message);
    });
  }

  removeUser(userId: string) {
    const roomId = this.userRoomMapping.get(userId);
    if (!roomId) {
        console.log("user not found");
        return;
    }

    const users = this.interestedSockets.get(roomId);
    if (users) {
      const index = users.findIndex((user) => user.userId === userId);
      if (index !== -1) {
        users.splice(index, 1);
        this.userRoomMapping.delete(userId);
        this.interestedSockets.set(roomId, users);
        if (this.interestedSockets.get(roomId)?.length === 0) {
          this.interestedSockets.delete(roomId)
        }
        console.log("user removed");
      }
      }
      
  }
}

export const sockerManager = SockerManager.getInstance();
