/* eslint-disable global-require */
import React from 'react';
import { Link } from 'react-router-dom';
import { FiPower } from 'react-icons/fi';

import { useAuth } from '../../hooks/auth';

import { Header, HeaderContent, Profile } from './styles';

const MenuHeader: React.FC = () => {
  const { signOut, client } = useAuth();
  const { name } = client;

  return (
    <Header>
      <HeaderContent>
        <Link to="/">
          <img src="../../assets/logoo.png" alt="PortalNorth" />
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
