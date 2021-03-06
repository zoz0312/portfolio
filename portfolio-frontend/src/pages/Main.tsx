import Avatar from 'antd/lib/avatar/avatar';
import React from 'react';
import { Link } from 'react-router-dom';
import { UserOutlined } from '@ant-design/icons';
import './Main.scss'
import MainAnimation from '@components/animations/main.animation';

function Main() {
  return (
    <div>
      <header className="Main-header">
        Header
      </header>
      <div className="flex-container">
        <Link to="/aju" className="flex-item">
          <div>
            <Avatar size={128} icon={<UserOutlined />} />
          </div>
          AJu
        </Link>
        <Link to="/euri" className="flex-item">
          <div>
            <Avatar size={128} icon={<UserOutlined />} />
          </div>
          Euri
        </Link>
      </div>
    </div>
  );
}

export default Main;
