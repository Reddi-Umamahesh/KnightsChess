export const getWidth = (width: number) => {
  let w: number = 60;
  if (width < 1200) {
    const drop = Math.floor((1200 - width) / 100);
    w = 60 - drop * 4;
  }
  if (width <= 400) {
    w = 40;
  }
  if (width <= 500 && width >= 400) {
    w = 44;
  }
  if (width <= 900 && width >= 800) {
    w = 56;
  }
  if (width <= 800 && width >= 500) {
    w = 56;
  }
  return {
    SquareWidth: `${w}px`,
    BoardWidth: `${w * 8}px`,
  };
};
 
export interface BaseUserInterface {
  userId: string;
  username: string;
  email: string | null;
}
export const guest_api_endpoint = "http://localhost:3000/api/v1/guest";
export const user_api_endpoint = "http://localhost:3000/api/v1/user"
export const google_auth_endpoint = "http://localhost:3000/auth/google";
export const USER_TOKEN = 'user_token';
export const INIT_GAME = "init_game";
export const MOVE = "move";
export const GAME_OVER = 'game_over'