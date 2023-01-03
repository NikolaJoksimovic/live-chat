import { useEffect, useRef, useState } from "react";
import { Socket } from "socket.io-client";
import { nanoid } from "nanoid";
import { HiPhone, HiOutlineDotsVertical } from "react-icons/hi";
import { IoMdArrowBack } from "react-icons/io";
import { BsPaperclip, BsEmojiLaughing, BsCameraFill } from "react-icons/bs";
import { FaMicrophone } from "react-icons/fa";
import Msg from "./Msg";
import customImg from "../images/250895928_4172921376145604_979766070934381294_n.jpg";

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
  const chatHeaderRef = useRef<HTMLDivElement>(null);
  const [headerHeight, setHeaderHeight] = useState<number>(0);

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

  useEffect(() => {
    // console.log(chatHeaderRef.current?.clientHeight);
    const value = (chatHeaderRef.current?.clientHeight || 52) + 5;
    setHeaderHeight(value);
  }, []);

  return (
    <div className='chat-container'>
      <div></div>
      <div className='chat-header' ref={chatHeaderRef}>
        <div className='chat-header-left center-flex-row'>
          <button onClick={handleClick}>
            <IoMdArrowBack></IoMdArrowBack>
          </button>
          <div className='img-container'>
            <img src={customImg} alt='profile_photo.jpg' />
          </div>
          <span>{username}</span>
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
      <div className='chat-body' style={{ paddingTop: `${headerHeight}px` }}>
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
        <div className='chat-footer-left'>
          <div className='emoji-btn'>
            <BsEmojiLaughing></BsEmojiLaughing>
          </div>
          <input
            className='message-input'
            type='text'
            onChange={(event) => setCurrentMessage(event.target.value)}
            value={currentMessage}
            placeholder='Type a message'
          />
          <div className='camera-btn'>
            <BsCameraFill></BsCameraFill>
          </div>
        </div>
        <div className='btn-container'>
          <button
            className='send-msg-btn center-flex-row'
            onClick={() => sendMessage(currentMessage)}
          >
            <FaMicrophone></FaMicrophone>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chats;
