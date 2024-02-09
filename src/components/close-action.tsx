import React, { useState } from "react";
import styled from "styled-components";
import { Action, Actions } from "../resources/export-config";
import ActionForm from "./action-form";

interface CloseActionProps {
  actions: Actions;
  setActions: (actions: Actions) => void;
}

const CloseAction = ({ actions, setActions }: CloseActionProps) => {
  const [actionIdCounter, setActionIdCounter] = useState(0);

  const handleActionChange = (actionId: string, updatedAction: Action) => {
    setActions({ ...actions, [actionId]: updatedAction });
  };

  const handleAddAction = () => {
    const newActionId = `action_${actionIdCounter}`; // Create a unique ID
    setActionIdCounter(actionIdCounter + 1); // Increment the counter

    const newAction: Action = {
      type: "MESSAGE", // Default type for new action
      message: [], // Default values for the new action
    };
    setActions({ ...actions, [newActionId]: newAction });
  };

  const handleRemoveAction = (actionId: string) => {
    const newActions = { ...actions };
    delete newActions[actionId];
    setActions(newActions);
  };

  const handleActionIdChange = (oldId: string, newId: string) => {
    const updatedActions = { ...actions };
    if (updatedActions[newId]) {
      alert(`Action with ID '${newId}' already exists.`);
      return;
    }

    updatedActions[newId] = updatedActions[oldId];
    delete updatedActions[oldId];
    setActions(updatedActions);
  };

  return (
    <CloseActionStyles>
      <div className="input-container">
        <label>Open Actions</label>
        <div className="actions">
          {Object.entries(actions).map(([actionId, action]) => (
            <ActionForm
              key={actionId}
              actionId={actionId}
              action={action}
              onChange={(updatedAction) =>
                handleActionChange(actionId, updatedAction)
              }
              onIdChange={(newId: string) =>
                handleActionIdChange(actionId, newId)
              }
            >
              <button onClick={() => handleRemoveAction(actionId)}>
                Remove
              </button>
            </ActionForm>
          ))}
          <div className="add-action">
            <button onClick={handleAddAction}>Add Action</button>
          </div>
        </div>
      </div>
    </CloseActionStyles>
  );
};

export default CloseAction;

const CloseActionStyles = styled.div`
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
