
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Chat from './components/Chat';
import io, { Socket } from 'socket.io-client';

const socket: Socket = io('wss://talented-spectacular-elf.glitch.me');


function App(): JSX.Element {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home   socket={socket}/>} />
        <Route path="/chat" element={<Chat  socket={socket}/>} />
      </Routes>
    </Router>
  );
}

export default App
