import { receivedMessageProps } from "./Chats";

const Msg = (msg: receivedMessageProps) => {
  return (
    <>
      <span>
        {msg.message}
        <p style={{ fontSize: "0.7em" }}>
          {msg.username} {msg.time}
        </p>
      </span>
    </>
  );
};

export default Msg;
