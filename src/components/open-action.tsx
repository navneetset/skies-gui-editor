import React from "react";
import styled from "styled-components";

const OpenAction = () => {
  return (
    <OpenActionStyles>
      <div className="input-container">
        <label>Open Actions</label>
        <div className="actions">
          <div className="add-action">
            <button>Add Action</button>
          </div>
        </div>
      </div>
    </OpenActionStyles>
  );
};

export default OpenAction;

const OpenActionStyles = styled.div`
  .input-container {
    display: flex;
    flex-direction: column;
    margin-bottom: 1rem;
    font-family: inherit;
    label {
      margin-bottom: 0.1rem;
    }
    .actions {
      display: flex;
      flex-direction: column;
      .add-action {
        button {
          margin-top: 0.5rem;
        }
      }
    }

    button {
      margin-top: 1rem;
      padding: 0.2rem 0.35rem;
      border-radius: 5px;
      border: 1px solid #000;
      background: #c6c6c6;
      font-family: Minecraftia;
      font-weight: bold;
      font-size: 0.65rem;
      cursor: pointer;
      transition: all 0.2s ease-in-out;

      &:hover {
        background: #b3b3b3;
        transform: scale(1.05);
        translate: translateY(-1.5px);
      }
    }
  }
`;
