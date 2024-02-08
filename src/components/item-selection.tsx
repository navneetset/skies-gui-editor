import React, { useState } from "react";
import { minecraftIcons } from "../resources/minecraft-icons";
import CreatableSelect from "react-select/creatable";
import styled from "styled-components";

interface ItemSelectionProps {
  selectedItem: any;
  setSelectedItem: (item: any) => void;
}

const ItemSelection = ({
  selectedItem,
  setSelectedItem,
}: ItemSelectionProps) => {
  const selectOptions = minecraftIcons.map((icon) => ({
    value: `minecraft:${icon.name}`,
    label: `minecraft:${icon.name}`,
  }));

  const [inputValue, setInputValue] = useState("");

  const checkIconExists = (iconName: string) => {
    return !!minecraftIcons.find((icon) => icon.css === iconName);
  };
  const getIconName = (itemName: string) => {
    const iconName = itemName
      .replace("minecraft:", "")
      .toLowerCase()
      .replace(/_/g, "-");

    return checkIconExists(`icon-minecraft-${iconName}`)
      ? `icon-minecraft-${iconName}`
      : "icon-minecraft-mob-ghast-face";
  };

  return (
    <SelectStyles
      options={selectOptions}
      value={selectedItem}
      onChange={(option) => setSelectedItem(option)}
      onInputChange={(inputValue) => setInputValue(inputValue)}
      isSearchable={true}
      isClearable={true}
      placeholder="Search or enter an item name"
      isValidNewOption={(inputValue) => {
        return inputValue.startsWith("");
      }}
      formatCreateLabel={(inputValue) => `Custom: ${inputValue}`}
      formatOptionLabel={(option) => (
        <>
          {/* @ts-ignore */}
          <i className={`icon-minecraft ${getIconName(option.value)}`} />
          {/* @ts-ignore */}
          <span style={{ marginLeft: "8px" }}>{option.label}</span>
        </>
      )}
    />
  );
};

export default ItemSelection;

const SelectStyles = styled(CreatableSelect)`
  font-size: 0.75rem;
  width: 600px;
  color: #000;
`;
