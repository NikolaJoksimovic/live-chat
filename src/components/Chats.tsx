import { Socket } from "socket.io-client";

type chatsProps = {
  socket: Socket;
  username: string;
  roomId: string;
};

const Chats = ({ socket, username, roomId }: chatsProps) => {
  return <div></div>;
};

export default Chats;
