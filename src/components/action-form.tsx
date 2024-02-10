import React, { useEffect, useState } from "react";
import { Action, ActionType } from "../resources/export-config"; // Adjust import path as necessary
import styled from "styled-components";
import NBTTooltip from "./nbt-tooltip";
import NBTValidator from "./nbt-validator";
import ItemSelection from "./item-selection";

interface ActionFormProps {
  action: Action;
  actionId: string;
  onIdChange: (newId: string) => void;
  onChange: (updatedAction: Action) => void;
  children?: React.ReactNode;
  itemSelectorWidth?: string;
}

interface TextInputProps {
  value: string;
  onChange: (value: string) => void;
}

interface TextAreaInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const TextInput = ({ value, onChange }: TextInputProps) => (
  <input type="text" value={value} onChange={(e) => onChange(e.target.value)} />
);

export const TextAreaInput = ({ value, onChange }: TextAreaInputProps) => (
  <textarea
    style={{ height: "4.5rem", width: "98%", borderRadius: "5px" }}
    value={value}
    onChange={(e) => onChange(e)}
    className="nbt-input"
  />
);

interface NumberInputProps {
  value: number;
  onChange: (value: number) => void;
}

const NumberInput = ({ value, onChange }: NumberInputProps) => (
  <input
    type="number"
    value={value}
    onChange={(e) => onChange(Number(e.target.value))}
  />
);

interface CheckboxInputProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

const CheckboxInput = ({ checked, onChange }: CheckboxInputProps) => (
  <input
    type="checkbox"
    checked={checked}
    onChange={(e) => onChange(e.target.checked)}
  />
);

interface ArrayInputProps {
  values: string[];
  onChange: (index: number, value: string | null) => void;
  placeholder: string;
}

const ArrayInput = ({ values, onChange, placeholder }: ArrayInputProps) => (
  <div>
    {values.map((value, index) => (
      <div className="array-input" key={index}>
        <TextInput value={value} onChange={(val) => onChange(index, val)} />
        <button onClick={() => onChange(index, null)}>Remove</button>
      </div>
    ))}
    <button onClick={() => onChange(values.length, "")}>
      Add {placeholder}
    </button>
  </div>
);

const ActionForm = ({
  action,
  actionId,
  onIdChange,
  onChange,
  children,
  itemSelectorWidth,
}: ActionFormProps) => {
  const [selectedActionType, setSelectedActionType] = useState(action.type);
  const [localActionId, setLocalActionId] = useState(actionId);
  const [collapsed, setCollapsed] = useState(false);
  const [localNbt, setLocalNbt] = useState("{}");

  useEffect(() => {
    setLocalActionId(actionId);
  }, [actionId]);

  const actionFieldsMap = {
    MESSAGE: ["message"],
    COMMAND_CONSOLE: ["commands"],
    COMMAND_PLAYER: ["commands"],
    BROADCAST: ["message"],
    PLAYSOUND: ["sound", "volume", "pitch"],
    OPEN_GUI: ["id"],
    CLOSE_GUI: [],
    REFRESH_GUI: [],
    GIVE_XP: ["amount", "level"],
    CURRENCY_DEPOSIT: ["currency", "amount"],
    CURRENCY_WITHDRAW: ["currency", "amount"],
    CURRENCY_SET: ["currency", "amount"],
    GIVE_ITEM: ["item", "amount", "nbt"],
    TAKE_ITEM: ["item", "amount", "nbt", "strict"],
  };

  const initializeActionFields = (type: ActionType): Action => {
    let newAction = { ...action, type: type };

    // Iterate over all possible fields and reset them if not present in the new type
    Object.keys(actionFieldsMap).forEach((actionType) => {
      if (actionType !== type) {
        // @ts-ignore
        actionFieldsMap[actionType].forEach((field) => {
          if (newAction.hasOwnProperty(field)) {
            // Reset the field based on its type
            // @ts-ignore
            if (Array.isArray(newAction[field])) {
              // @ts-ignore
              newAction[field] = [];
            } else {
              // @ts-ignore
              newAction[field] = undefined;
            }
          }
        });
      }
    });

    return newAction;
  };

  const handleChange = (field: string, value: any) => {
    onChange({ ...action, [field]: value });
  };

  const handleIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalActionId(e.target.value);
  };

  const handleIdBlur = () => {
    if (localActionId !== actionId) {
      onIdChange(localActionId);
    }
  };

  const handleNbtChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setLocalNbt(e.target.value);
  };

  const handleActionTypeChange = (newType: ActionType) => {
    setSelectedActionType(newType);
    const newAction = initializeActionFields(newType);
    onChange(newAction);
  };

  const handleArrayChange = (
    field: string,
    arrayIndex: number,
    value: string | null
  ) => {
    // @ts-ignore
    const newArray = [...((action[field] as string[]) || [])];
    if (value === null) {
      newArray.splice(arrayIndex, 1);
    } else {
      newArray[arrayIndex] = value;
    }
    onChange({ ...action, [field]: newArray });
  };

  const renderField = (field: string) => {
    switch (field) {
      case "message":
      case "commands":
        return (
          <ArrayInput
            values={(action[field] as string[]) || []}
            onChange={(arrayIndex, val) =>
              handleArrayChange(field, arrayIndex, val)
            }
            placeholder={field}
          />
        );
      case "sound":
        return (
          <TextInput
            value={(action[field] as string) || ""}
            onChange={(val) => handleChange(field, val)}
          />
        );
      case "volume":
      case "pitch":
      case "amount":
        return (
          <NumberInput
            value={(action[field] as number) || 0}
            onChange={(val) => handleChange(field, val)}
          />
        );
      case "level":
        return (
          <CheckboxInput
            checked={(action[field] as boolean) || false}
            onChange={(val) => handleChange(field, val)}
          />
        );
      case "currency":
      case "item":
        return (
          <ItemSelection
            selectedItem={
              //string to item
              {
                name: action[field] as string,
                material: action[field] as string,
                icon: `icon-minecraft-${action[field] as string}`,
              }
            }
            setSelectedItem={(val) => handleChange(field, val.material)}
            width={itemSelectorWidth}
          />
        );
      case "strict":
        return (
          <CheckboxInput
            checked={(action[field] as boolean) || false}
            onChange={(val) => handleChange(field, val)}
          />
        );
      case "nbt":
        return (
          <div>
            <TextAreaInput value={localNbt} onChange={handleNbtChange} />
            <NBTValidator
              nbt={localNbt}
              onValidNbt={(parsedNbt) => handleChange("nbt", parsedNbt)}
            />
          </div>
        );

      default:
        return null;
    }
  };

  const capitalizeFirstLetter = (str: string) => {
    if (!str) return str;
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  return (
    <StyledActionForm>
      <div className="form-item">
        <label>Action Type</label>
        <select
          value={selectedActionType}
          onChange={(e) => handleActionTypeChange(e.target.value as ActionType)}
        >
          {Object.keys(actionFieldsMap).map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      <div className="form-item">
        <label>Action ID</label>
        <input
          type="text"
          value={localActionId}
          onChange={handleIdChange}
          onBlur={handleIdBlur}
        />
      </div>

      {/** @ts-ignore */}
      {!collapsed &&
        actionFieldsMap[selectedActionType]?.map((field) => (
          <div key={field} className="form-item hidden">
            <label>
              {capitalizeFirstLetter(field)}{" "}
              {(field === "volume" || field == "pitch") && "[0-1.0]"}
              {field === "nbt" && <NBTTooltip />}
            </label>
            {renderField(field)}
          </div>
        ))}

      <div className="button-container">
        <button
          className={collapsed ? "expand-button" : "collapse-button"}
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? "Expand" : "Collapse"}
        </button>
        {children}
      </div>
    </StyledActionForm>
  );
};

export default ActionForm;

const StyledActionForm = styled.div`
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
  animation: expand 0.4s ease;

  @keyframes expand {
    from {
      opacity: 0;
      transform: translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  button {
    padding: 0.2rem 0.35rem;
    border-radius: 5px;
    margin-top: 0.5rem;
    font-family: Minecraftia;
    transition: all 0.2s ease;
    cursor: pointer;

    &:hover {
      background: #c6c6c6;
      scale: 1.025;
    }
  }

  .form-item {
    display: flex;
    flex-direction: column;
    margin-bottom: 0.5rem;
    width: 370px;
    max-width: 370px;

    select {
      font-family: inherit;
      font-size: 0.65rem;
      margin-bottom: 0.5rem;
      border-radius: 5px;
      margin-top: 0.2rem;
      padding: 0.2rem;
      width: 65%;
    }

    label {
      font-size: 0.65rem;
      margin-bottom: 0.1rem;
    }

    input {
      border-radius: 5px;
      border: 1px solid #000;
      background: #dfdfdf;
      font-family: Minecraftia;
      font-weight: bold;
      font-size: 0.5rem;
    }
  }

  .hidden {
    animation: expand 0.4s ease;
  }

  .array-input {
    margin-bottom: 0.5rem;
    animation: expand 0.4s ease;

    @keyframes expand {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    button {
      width: 25%;

      &:hover {
        background: #af4545;
      }
    }
  }

  .nbt-input {
    margin-top: 0.3rem;
    font-size: 0.65rem;
    border-radius: 5px;
    border: 1px solid #000;
    background: #dfdfdf;
  }
`;
