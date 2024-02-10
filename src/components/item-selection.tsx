import React, { useEffect, useState } from "react";
import { minecraftIcons } from "../resources/minecraft-icons";
import CreatableSelect from "react-select/creatable";
import styled from "styled-components";
import { Item } from "../resources/export-config";

interface ItemSelectionProps {
  selectedItem: Item;
  setSelectedItem: (item: Item) => void;
  width?: string;
}

const ItemSelection = ({
  selectedItem,
  setSelectedItem,
  width,
}: ItemSelectionProps) => {
  const selectOptions = minecraftIcons.map((icon) => ({
    value: `minecraft:${icon.name}`,
    label: `minecraft:${icon.name}`,
  }));

  const [inputValue, setInputValue] = useState(selectedItem?.material || "");
  const selectedOption = selectOptions.find(
    (option) => option.value === selectedItem?.material
  );

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
      : "icon-minecraft-unknown";
  };

  const getTrimmedIconName = (iconName: string) => {
    return iconName.replace("icon-minecraft-", "");
  };

  return (
    <SelectStyles
      $width={width}
      options={selectOptions}
      value={selectedOption} // Set the selected option here
      onChange={(option: any) => {
        console.log(option);
        if (option) {
          setSelectedItem({
            name: option.label,
            material: option.value,
            icon: getTrimmedIconName(getIconName(option.value)),
          });
        }
      }}
      onInputChange={(inputValue) => setInputValue(inputValue)}
      isSearchable={true}
      placeholder="Search or enter an item name"
      formatCreateLabel={(inputValue) => `Custom: ${inputValue}`}
      isValidNewOption={(inputValue) => {
        return inputValue.startsWith("");
      }}
      formatOptionLabel={(option) => (
        <>
          {/** @ts-ignore */}
          <i className={`icon-minecraft ${getIconName(option.value)}`} />
          {/** @ts-ignore */}
          <span style={{ marginLeft: "8px" }}>{option.label}</span>
        </>
      )}
    />
  );
};

export default ItemSelection;

const SelectStyles = styled(CreatableSelect)<{ $width?: string }>`
  font-size: 0.6rem;
  width: ${({ $width }) => $width || "460px"};
  color: #000;
  margin-top: 10px;

  .icon-minecraft {
    scale: 0.9;
  }
`;
