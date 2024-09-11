import { io } from "socket.io-client";
const typeConnect = "dev";

export const useSocketIO = () => {
  const socket = io(typeConnect === 'local' ? "http://localhost:5173/" : "https://dev.sez.us");
  return {
      socket,
  }
}