import { useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import { HiOutlineX } from "react-icons/hi";

type chatsProps = {
  socket: Socket;
  username: string;
  roomId: string;
  setShowChat: React.Dispatch<React.SetStateAction<boolean>>;
};
type receivedMessageProps = {
  room_id: string;
  username: string;
  message: string;
  time: string;
};

const Chats = ({ socket, username, roomId, setShowChat }: chatsProps) => {
  const [currentMessage, setCurrentMessage] = useState<string>("");

  const sendMessage = async (message: string) => {
    if (message !== "") {
      const packageData = {
        room_id: roomId,
        username: username,
        message: message,
        time:
          new Date(Date.now()).getHours() +
          ":" +
          new Date(Date.now()).getMinutes(),
      };
      await socket.emit("send_message", packageData);
    }
  };

  const handleClick = () => {
    setShowChat(false);
  };

  useEffect(() => {
    socket.on("receive_message", (data: receivedMessageProps) => {
      console.log(data);
    });
  }, [socket]);
  return (
    <div className='chat-container'>
      <div></div>
      <div className='chat-header'>
        <span style={{ padding: "0 0 0 1.5em" }}>live chat</span>
        <button className='exit-btn' onClick={() => handleClick()}>
          <HiOutlineX></HiOutlineX>
        </button>
      </div>
      <div className='chat-body'></div>
      <div className='chat-footer'>
        <input
          className='message-input'
          type='text'
          placeholder='heyyy'
          onChange={(event) => setCurrentMessage(event.target.value)}
        />
        <button
          className='send-msg-btn'
          onClick={() => sendMessage(currentMessage)}
        >
          &#9658;
        </button>
      </div>
    </div>
  );
};

export default Chats;
