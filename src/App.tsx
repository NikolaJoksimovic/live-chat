import { useState } from "react";
import { io } from "socket.io-client";
import Chats from "./components/Chats";
import urls from "./urls.json";

const url = urls.url;

const socket = io(`${url}`, {});

function App() {
  const [username, setUsername] = useState<string>("");
  const [roomId, setRoomId] = useState<string>("");
  const [showChat, setShowChat] = useState<boolean>(false);

  const joinRoom = () => {
    if (username && roomId) {
      console.log(roomId);

      socket.emit("join_room", { room_id: roomId });
      setShowChat(true);
    }
  };

  return (
    <div className='App'>
      <div>
        <h3>Join the Chat</h3>
        <input
          type='text'
          placeholder='username'
          value={username}
          onChange={(event) => setUsername(event.target.value)}
        />
        <input
          type='text'
          placeholder='room_id'
          value={roomId}
          onChange={(event) => setRoomId(event.target.value)}
        />
        <button onClick={joinRoom}>join</button>
      </div>
      {showChat && (
        <Chats
          socket={socket}
          username={username}
          roomId={roomId}
          setShowChat={setShowChat}
        ></Chats>
      )}
    </div>
  );
}

export default App;
