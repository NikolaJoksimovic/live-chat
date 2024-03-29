import { receivedMessageProps } from "./Chats";
const Msg = (msg: receivedMessageProps) => {
  return (
    <>
      <span>
        {msg.message}
        <p>{msg.time}</p>
        <p id='true-time'>{msg.time} </p>
      </span>
    </>
  );
};

export default Msg;
