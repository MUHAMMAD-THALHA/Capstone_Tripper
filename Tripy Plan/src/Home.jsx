import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="mainContainer">
      <div className={'titleContainer'}>
        <div>Welcome!</div>
      </div>
      <div>This is the home page.</div>
      {!user ? (
        <button className={'inputButton'} onClick={() => navigate('/login')}>
          Log in
        </button>
      ) : (
        <button className={'inputButton'} onClick={handleLogout}>
          Log out
        </button>
      )}
      {user ? <div>Your email address is {user.email}</div> : null}
    </div>
  );
};

export default Home; 