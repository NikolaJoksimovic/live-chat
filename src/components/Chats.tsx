import { useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import { HiOutlineX } from "react-icons/hi";
import { nanoid } from "nanoid";
import Msg from "./Msg";

type chatsProps = {
  socket: Socket;
  username: string;
  roomId: string;
  setShowChat: React.Dispatch<React.SetStateAction<boolean>>;
};
export type receivedMessageProps = {
  room_id: string;
  username: string;
  message: string;
  time: string;
};

const Chats = ({ socket, username, roomId, setShowChat }: chatsProps) => {
  const [currentMessage, setCurrentMessage] = useState<string>("");
  const [msgLog, setMsgLog] = useState<receivedMessageProps[]>([]);

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
      setMsgLog((prevMsgLog: receivedMessageProps[]) => [
        ...prevMsgLog,
        packageData,
      ]);
      setCurrentMessage("");
      await socket.emit("send_message", packageData);
    }
  };

  const handleClick = () => {
    // localStorage.removeItem("username");
    // localStorage.removeItem("roomId");
    setShowChat(false);
  };

  useEffect(() => {
    socket.on("receive_message", (data: receivedMessageProps) => {
      console.log(data);

      setMsgLog((prevMsgLog: receivedMessageProps[]) => [...prevMsgLog, data]);
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
        {msgLog?.map((msg) => {
          return (
            <h5
              key={nanoid()}
              className={
                username === msg.username
                  ? "msg-right msg-header"
                  : "msg-left msg-header"
              }
            >
              <Msg {...msg}></Msg>
            </h5>
          );
        })}
      </div>
      <div className='chat-footer'>
        <input
          className='message-input'
          type='text'
          placeholder='Type something...'
          onChange={(event) => setCurrentMessage(event.target.value)}
          value={currentMessage}
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
