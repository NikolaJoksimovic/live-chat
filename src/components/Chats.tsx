import { useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import { HiPhone, HiOutlineDotsVertical } from "react-icons/hi";
import { IoMdArrowBack } from "react-icons/io";
import { BsPaperclip } from "react-icons/bs";

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
        <div className='chat-header-left center-flex-row'>
          <button onClick={handleClick}>
            <IoMdArrowBack></IoMdArrowBack>
          </button>
          <div className='img-container'>
            <img
              src='https://images.pexels.com/photos/3764119/pexels-photo-3764119.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
              alt=''
            />
          </div>
          <span>sanskriti</span>
        </div>
        <div className='chat-header-right center-flex-row'>
          <div className='icon'>
            <HiPhone></HiPhone>
          </div>
          <div className='icon' style={{ transform: "rotate(-45deg)" }}>
            <BsPaperclip></BsPaperclip>
          </div>
          <div className='icon'>
            <HiOutlineDotsVertical></HiOutlineDotsVertical>
          </div>
        </div>
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
