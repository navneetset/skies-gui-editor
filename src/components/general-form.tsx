import React, { useState } from "react";
import CreatableSelect from "react-select/creatable";
import styled from "styled-components";

interface GeneralFormProps {
  inventoryRows: number;
  setInventoryRows: (rows: number) => void;
  inventoryRowMap: { [key: number]: number };
  items: any[];
  setItems: (items: any[]) => void;
  fileName: string;
  setFileName: (name: string) => void;
  uiName: string;
  setUiName: (name: string) => void;
  aliasCommands: string[];
  setAliasCommands: (commands: string[]) => void;
}

const GeneralForm = ({
  inventoryRows,
  setInventoryRows,
  inventoryRowMap,
  items,
  setItems,
  fileName,
  setFileName,
  uiName,
  setUiName,
  aliasCommands,
  setAliasCommands,
}: GeneralFormProps) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <GeneralFormStyles collapsed={collapsed}>
      <label>General Settings</label>
      {!collapsed && (
        <>
          <div className="input-container">
            <label>File Name</label>
            <input
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
            />
          </div>
          <div className="input-container">
            <label>UI Name</label>
            <input value={uiName} onChange={(e) => setUiName(e.target.value)} />
          </div>
          <div className="input-container">
            <label>Alias Commands (Comma Separated)</label>
            <input
              type="text"
              placeholder="example,exp,e"
              value={aliasCommands.join(",")}
              onChange={(e) => {
                setAliasCommands(
                  e.target.value.split(",").map((x) => x.trim())
                );
              }}
            />
          </div>
          <div className="input-container inline">
            <label>Rows</label>
            <CreatableSelect
              className="row-input"
              options={[
                { value: 1, label: 1 },
                { value: 2, label: 2 },
                { value: 3, label: 3 },
                { value: 4, label: 4 },
                { value: 5, label: 5 },
                { value: 6, label: 6 },
              ]}
              value={{ value: inventoryRows, label: inventoryRows }}
              onChange={(option) => {
                setInventoryRows(option?.value as number);
                setItems(
                  Array(inventoryRowMap[option?.value as number]).fill({})
                );
              }}
            />
          </div>
        </>
      )}

      <div
        className="button-container"
        onClick={() => setCollapsed(!collapsed)}
      >
        <button className={collapsed ? "expand-button" : "collapse-button"}>
          {collapsed ? "Expand" : "Collapse"}
        </button>
      </div>
    </GeneralFormStyles>
  );
};

export default GeneralForm;

const GeneralFormStyles = styled.div<{ collapsed: boolean }>`
  display: flex;
  flex-direction: column;
  margin-bottom: 0.7rem;
  font-family: inherit;
  background: #6e6e6e;
  padding: 0.5rem;
  border-radius: 5px;
  margin-top: 0.5rem;
  max-width: 400px;
  box-shadow: 5px 5px 0px #555555, inset 2px 2px 0px #fefefe;
  height: ${(props) => (props.collapsed ? "100px" : "435px")};
  width: 400px;
  transition: all 0.4s ease-in-out;

  .button-container {
    display: flex;
    justify-content: space-between;
    margin-top: auto;

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

  .input-container {
    animation: fadeIn 1s ease;

    @keyframes fadeIn {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }
  }
`;
