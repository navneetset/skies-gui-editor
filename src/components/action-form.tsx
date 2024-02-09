import React, { useEffect, useState } from "react";
import { Action, ActionType } from "../resources/export-config"; // Adjust import path as necessary
import styled from "styled-components";

interface ActionFormProps {
  action: Action;
  actionId: string;
  onIdChange: (newId: string) => void;
  onChange: (updatedAction: Action) => void;
  children?: React.ReactNode;
}

interface TextInputProps {
  value: string;
  onChange: (value: string) => void;
}

const TextInput: React.FC<TextInputProps> = ({ value, onChange }) => (
  <input type="text" value={value} onChange={(e) => onChange(e.target.value)} />
);

interface NumberInputProps {
  value: number;
  onChange: (value: number) => void;
}

const NumberInput: React.FC<NumberInputProps> = ({ value, onChange }) => (
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

const CheckboxInput: React.FC<CheckboxInputProps> = ({ checked, onChange }) => (
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

const ArrayInput: React.FC<ArrayInputProps> = ({
  values,
  onChange,
  placeholder,
}) => (
  <div>
    {values.map((value, index) => (
      <div key={index}>
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
}: ActionFormProps) => {
  const [selectedActionType, setSelectedActionType] = useState(action.type);
  const [localActionId, setLocalActionId] = useState(actionId);

  useEffect(() => {
    setLocalActionId(actionId);
  }, [actionId]);

  const actionFieldsMap = {
    "": [],
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
    TAKE_ITEM: ["item", "amount", "nbt"],
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

  const handleActionTypeChange = (newType: ActionType) => {
    setSelectedActionType(newType);
    onChange({ ...action, type: newType });
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
      case "":
        return null;
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
          <TextInput
            value={(action[field] as string) || ""}
            onChange={(val) => handleChange(field, val)}
          />
        );

      default:
        return null;
    }
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
      {actionFieldsMap[selectedActionType]?.map((field) => (
        <div key={field} className="form-item">
          <label>{field}</label>
          {renderField(field)}
        </div>
      ))}
      {children}
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
  max-width: 600px;
  box-shadow: 5px 5px 0px #555555, inset 2px 2px 0px #fefefe;

  .form-item {
    display: flex;
    flex-direction: column;
    margin-bottom: 0.5rem;
    width: 550px;
    max-width: 550px;

    select {
      font-family: inherit;
      font-size: 0.65rem;
      margin-bottom: 0.5rem;
    }

    label {
      font-size: 0.65rem;
      margin-bottom: 0.1rem;
    }
  }
`;
