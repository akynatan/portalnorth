import React from 'react';
import { Link } from 'react-router-dom';
import { FiPower } from 'react-icons/fi';

import logoImg from '../../assets/logoo.png';

import { useAuth } from '../../hooks/auth';

import { Header, HeaderContent, Profile } from './styles';

const MenuHeader: React.FC = () => {
  const { signOut, client } = useAuth();
  const { name } = client;

  return (
    <Header>
      <HeaderContent>
        <Link to="/">
          <img src={logoImg} alt="PortalNorth" />
        </Link>

        <Profile>
          <div>
            <Link to="/profile">
              <strong>{name}</strong>
            </Link>
          </div>
          <button type="button" onClick={signOut}>
            <FiPower />
          </button>
        </Profile>
      </HeaderContent>
    </Header>
  );
};

export default MenuHeader;
