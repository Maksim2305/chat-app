import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createAvatar } from "@dicebear/core";
import { bottts } from "@dicebear/collection";
import { Socket } from "socket.io-client";

interface HomeProps {
  socket: Socket;
}

const Home: React.FC<HomeProps> = ({ socket }) => {
  const [username, setUsername] = useState<string>("");
  const navigate = useNavigate();

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const generateAvatar = (): string => {
    const randomSeed = Math.random().toString(36).substring(2, 10);
    return createAvatar(bottts, { seed: randomSeed }).toString();
  };

  const toChat = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (username.trim().length) {
      const avatar = generateAvatar();
      const userId = `${socket.id}`;

      localStorage.setItem("user", JSON.stringify({ username, avatar, id: userId }));

      socket.emit("joinChat", { username, id: userId, avatar });

      navigate("/chat");
    }
  };

  return (
    <div className="container text-center mt-5">
      <h1>Добро пожаловать</h1>

      <form onSubmit={toChat} className="mt-3">
        <input
          type="text"
          placeholder="Введите ваше имя"
          value={username}
          onChange={handleNameChange}
          className="form-control"
        />
        <button type="submit" className="btn btn-primary mt-3">
          Войти
        </button>
      </form>
    </div>
  );
};

export default Home;
