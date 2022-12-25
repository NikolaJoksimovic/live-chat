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
  const [msgLog, setMsgLog] = useState<receivedMessageProps>();

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
    localStorage.removeItem("username");
    localStorage.removeItem("roomId");
    setShowChat(false);
  };

  useEffect(() => {
    // console.log("data received from server");
    socket.on("receive_message", (data: receivedMessageProps) => {
      setMsgLog(data);
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
      <div className='chat-body'>
        <h5>this is a message...</h5>
      </div>
      <div className='chat-footer'>
        <input
          className='message-input'
          type='text'
          placeholder='Type something...'
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
