import styled from 'styled-components';

export const Container = styled.div``;

export const Header = styled.header`
  padding: 32px 20px;
  background: #f4f6f7;
`;

export const HeaderContent = styled.div`
  max-width: 1120px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;

  img {
    height: 80px;
  }

  button {
    margin-left: auto;
    background: transparent;
    border: 0;

    svg {
      color: #0d254f;
      width: 20px;
      height: 20px;
    }
  }
`;

export const Profile = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;

  img {
    width: 56px;
    height: 56px;
    border-radius: 50%;
  }

  div {
    display: flex;
    flex-direction: column;
    margin-left: 16px;
    line-height: 24px;
  }

  a {
    text-decoration: none;
    color: #0d254f;

    &:hover {
      opacity: 0.8;
    }
  }
`;

export const HeaderPage = styled.main`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 40px;

  div {
    width: 79%;

    hr {
      width: 100%;
      color: white;
      height: 2px;
    }

    h1 {
      color: #0d254f;
    }
  }

  button {
    width: 260px;
  }
`;
