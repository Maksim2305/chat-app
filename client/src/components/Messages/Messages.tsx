import { Message, User } from "../Chat";

interface MessagesProps {
  messages: Message[];
  user: User | null;
  onlineUsers: User[];
}

const Messages: React.FC<MessagesProps> = ({ messages, user, onlineUsers }) => {
  const userAvatar = (id: string): string => onlineUsers.find(u => u.id === id)?.avatar ?? '';

  return (
    <div className="flex-grow-1 bg-light p-3 overflow-auto" style={{ height: 'calc(100vh - 70px)' }}>
      {messages.map((msg) => (
        <div
          key={msg.messageId}
          className={`d-flex mb-2 ${msg.username === user?.username ? 'justify-content-end' : 'justify-content-start'}`}
        >
          <div
            className={`p-2 rounded ${msg.username === user?.username ? 'bg-light text-dark' : 'bg-dark-subtle text-dark '}`}
            style={{ maxWidth: '60%' }}
          >
            <div className={`d-flex align-items-center ${msg.username === user?.username ? '' : 'flex-row-reverse'}`} style={{ gap: '10px' }}>
              <span>{msg.message}</span>
              <div
                dangerouslySetInnerHTML={{ __html: userAvatar(msg.id) }}
                style={{ width: '30px', height: '30px' }}
              />
            </div>
            {msg.imageUrl && (
              <img
                src={msg.imageUrl}
                alt="User sent"
                style={{ maxWidth: "100%", marginTop: "10px" }}
              />
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Messages;
