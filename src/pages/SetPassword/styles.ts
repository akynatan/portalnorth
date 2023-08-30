import styled, { keyframes } from 'styled-components';
import { shade } from 'polished';

export const Container = styled.div`
  height: 100vh;

  display: flex;
  align-items: stretch;
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;

  align-items: center;
  place-content: center;
  width: 100%;

  img {
    width: 150px;
    margin-top: 80px;
    margin-bottom: 20px;
  }
`;

const appearFromLeft = keyframes`
  from {
    opacity: 0;
    transform: translateX(-50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

export const AnimationContainer = styled.div`
  display: flex;
  flex-direction: column;

  align-items: center;
  place-content: center;

  animation: ${appearFromLeft} 1s;

  form {
    margin-bottom: 80px;
    width: 340px;
    text-align: center;

    h1 {
      color: #0d254f;
      margin-bottom: 24px;
    }

    a {
      color: #0d254f;
      display: block;
      margin-top: 24px;
      text-decoration: none;
      transition: color 0.2s;

      &:hover {
        color: ${shade(0.3, '#0d254f')};
      }
    }
  }
`;
