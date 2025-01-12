import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Socket } from 'socket.io-client';
import { Send } from 'react-bootstrap-icons';
import FIleUpload from './FIleUpload';
import Sidebar from './Sidebar/Sidebar';
import Messages from './Messages/Messages';

interface ChatProps {
  socket: Socket;
}

export interface Message {
  message: string;
  username: string;
  id: string;
  imageUrl?: string;
  avatar?: string;
  messageId: string;
}

export interface User {
  username: string;
  avatar?: string;
  id: string;
}

type Users = Record<string, User>;

const Chat: React.FC<ChatProps> = ({ socket }) => {
  const [onlineUsers, setOnlineUsers] = useState<User[]>([]);
  const [message, setMessage] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [image, setImage] = useState<File | null>(null);
  const [user, setUser] = useState<User | null>(null);


  const navigate = useNavigate();
  const [typingUser, setTypingUser] = useState<string | null>(null);
  let typingTimeout: NodeJS.Timeout | null = null;

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  useEffect(() => {
    const handleResponseMessage = (msg: Message) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    };

    const handleOnlineUsers = (users: Users) => {
      setOnlineUsers(Object.values(users));
    };

    socket.on('responseMessage', handleResponseMessage);
    socket.on("onlineUsers", handleOnlineUsers);

    socket.on('userTyping', (username) => {
      setTypingUser(username);
    });

    socket.on('userStoppedTyping', () => {
      setTypingUser(null);
    });


    return () => {
      socket.off('responseMessage', handleResponseMessage);
      socket.off("onlineUsers", handleOnlineUsers);
      socket.off('userTyping');
      socket.off('userStoppedTyping');
    };
  }, [socket]);

  const handleSend = (e: React.FormEvent): void => {
    e.preventDefault();
    if ((message.trim() || image) && user) {
      const msgData = {
        message,
        username: user.username,
        id: `${socket.id}`,
        messageId: `${socket.id}-${Math.random()}`,
        imageUrl: image ? URL.createObjectURL(image) : undefined,
      };

      socket.emit("sendMessage", msgData);
      setMessage("");
      setImage(null);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (e.target.files) {
      setImage(e.target.files[0]);
    }
  };

  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setMessage(e.target.value);

    if (typingTimeout) clearTimeout(typingTimeout);

    if (user) {
      socket.emit('typing', user.username);

      typingTimeout = setTimeout(() => {
        socket.emit('stopTyping', user.username);
      }, 1000);
    }

  };

  const handleLeaveChat = () => {
    socket.emit('leaveChat', socket.id);
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <Sidebar users={onlineUsers} />

        <div className="col-md-9 p-0">
          <div className="d-flex flex-column" style={{ height: '100vh' }}>
            <div className="d-flex justify-content-between align-items-center p-3 bg-white border-bottom">

              <div className="d-flex align-items-center">
                <div
                  dangerouslySetInnerHTML={{ __html: user?.avatar as string }}
                  style={{ width: '70px', height: '70px', marginRight: '10px' }}
                />
                <span className="text-dark">{user?.username}</span>
              </div>
              <button className="btn btn-danger" onClick={handleLeaveChat}>
                Выйти
              </button>
            </div>

            <Messages messages={messages} user={user} onlineUsers={onlineUsers}/>

            {typingUser && (
              <div className="text-muted bg-light p-2" style={{ bottom: '70px', left: '20px' }}>
                <small>{typingUser} печатает...</small>
              </div>
            )}

            <form onSubmit={handleSend} className="d-flex p-3 bg-white border-top">
              <input
                type="text"
                className="form-control me-2"
                value={message}
                onChange={handleTyping}
                placeholder="Введите сообщение..."
                style={{ borderRadius: '20px' }}
              />

              <FIleUpload onChange={handleImageChange} />
              <button className="btn btn-primary">
                <Send color="white" size={18} />
              </button>

            </form>
          </div>
        </div>
      </div>
    </div>

  );
};

export default Chat;