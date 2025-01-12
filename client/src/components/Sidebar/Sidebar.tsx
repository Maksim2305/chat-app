import { User } from '../Chat';
import styles from './Sidebar.module.css';

interface SidebarProps {
  users: User[];
}

const Sidebar: React.FC<SidebarProps> = ({ users }) => {

  return (
    <div className={`${styles.sidebar} col-md-3 p-0`}>
      <div className="bg-dark text-white p-3" style={{ height: "100vh" }}>
        <h4>Пользователи онлайн</h4>
        <ul className="list-unstyled">

          {users.map((user) => (
            <li key={user.id} className="py-2 text-white d-flex flex-row align-items-center">
              <div
                dangerouslySetInnerHTML={{ __html: user?.avatar as string }}
                style={{ width: '30px', height: '30px', marginRight: '10px' }}
              />
              {user.username}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
