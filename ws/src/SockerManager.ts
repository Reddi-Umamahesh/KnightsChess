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

class SockerManager {
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

  addUser(user: User, gameId: string) {
    
    const currentSockets = this.interestedSockets.get(gameId) || []
    currentSockets.push(user)
    this.interestedSockets.set(gameId, currentSockets);
    this.userRoomMapping.set(user.userId, gameId);
    console.log(this.interestedSockets, " ||")
    console.log(this.userRoomMapping, "**")
    console.log("user added");
  }

  broadcast(gameId: string, message: string) {
    console.log(gameId)
    const users = this.interestedSockets.get(gameId);
    // console.log(users);
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
