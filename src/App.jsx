import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "../src/pages/Login.jsx";
import Registration from "../src/pages/Registration.jsx";
import CharacterRoom from "../src/pages/CharacterRoom.jsx";
import ChatRoom from "../src/pages/chatroom.jsx";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registration" element={<Registration />} />
        <Route path="/character-room" element={<CharacterRoom />} />
        <Route path="/chat-room" element={<ChatRoom />} />
      </Routes>
    </Router>
  );
}