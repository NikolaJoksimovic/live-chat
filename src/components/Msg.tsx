import { receivedMessageProps } from "./Chats";

const Msg = (msg: receivedMessageProps) => {
  return (
    <>
      <span>
        {msg.message}
        <p>
          {msg.username} {msg.time}
        </p>
      </span>
    </>
  );
};

export default Msg;
