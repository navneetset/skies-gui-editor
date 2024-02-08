import React from "react";
import styled from "styled-components";

const ConfigModal = () => {
  return (
    <ModalStyle open>
      <h1>Config</h1>
      <p>Coming soon...</p>
      <button>Close</button>
    </ModalStyle>
  );
};

export default ConfigModal;

const ModalStyle = styled.dialog`
  background: #c6c6c6;
  z-index: 100;
  margin-top: 10%;
  border-radius: 5px;
  box-shadow: 5px 5px 0px #555555, inset 2px 2px 0px #fefefe;

  h1 {
    font-family: Minecraftia;
    font-weight: bold;
    font-size: 1rem;
  }

  p {
    font-size: 0.8rem;
    font-family: Minecraftia;
  }

  button {
    font-family: Minecraftia;
    font-weight: bold;
    background: #8b8b8b;
    border: none;
    padding: 8px;
    margin-top: 8px;
    cursor: pointer;
    border-radius: 5px;
    color: #d7d7d7;
    box-shadow: inset 1.5px 1.5px 0px rgba(55, 55, 55, 0.8),
      inset -2px -2px 0px #ffffff;

    &:hover {
      box-shadow: inset 0 1.5px 1.5px rgba(55, 55, 55, 0.8),
        inset -2px -2px 0px #ffffff;

      color: #000000;

      background: #7a7a7a;
    }
  }
`;
