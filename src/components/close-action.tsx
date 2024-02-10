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
        <label>Close Actions</label>
        <div className="actions">
          {Object.entries(actions).map(([actionId, action]) => (
            <ActionForm
              itemSelectorWidth="370px"
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
              <button
                className="remove-button"
                onClick={() => handleRemoveAction(actionId)}
              >
                Remove
              </button>
            </ActionForm>
          ))}
        </div>
        <div className="add-action button-container">
          <button onClick={handleAddAction}>Add Action</button>
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

    .actions {
      display: flex;
      flex-direction: column;
    }

    .add-action {
      margin-top: 0.5rem;
      margin-bottom: 0.5rem;
    }

    .button-container {
      display: flex;
      justify-content: space-between;

      button {
        padding: 0.2rem 0.35rem;
        border-radius: 5px;
        border: 1px solid #000;
        background: #c6c6c6;
        font-family: Minecraftia;
        font-weight: bold;
        font-size: 0.65rem;
        cursor: pointer;
        transition: all 0.2s ease-in-out;
        box-shadow: 2px 2px 0px #555555, inset 1px 1px 0px #fefefe;

        &:hover {
          background: #b3b3b3;
          transform: scale(1.05);
          translate: translateY(-1.5px);
        }
      }

      .remove-button {
        background: #af4545;
        color: #fff;
        margin-left: 0.5rem;

        &:hover {
          background: #f35555;
        }
      }

      .collapse-button {
        background: #6e6e6e;
        color: #fff;

        &:hover {
          background: #8e8e8e;
        }
      }

      .expand-button {
        background: #686e97;
        color: #fff;

        &:hover {
          background: #8e8eaf;
        }
      }
    }
  }
`;
