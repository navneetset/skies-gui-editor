import React from "react";
import { minecraftIcons } from "../resources/minecraft-icons";
import styled from "styled-components";

interface InventoryItemProps {
  item: {
    icon: string;
  };
  onMouseEnter: (e: React.MouseEvent) => void;
  onMouseLeave: (e: React.MouseEvent) => void;
}

const InventoryItem = ({
  item,
  onMouseEnter,
  onMouseLeave,
}: InventoryItemProps) => {
  const checkIconExists = (iconName: string) => {
    return !!minecraftIcons.find((icon) => icon.css === iconName);
  };

  const iconName = checkIconExists(`icon-minecraft-${item.icon}`)
    ? `icon-minecraft-${item.icon}`
    : "icon-minecraft-mob-ghast-face";

  return (
    <InventorySlot onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
      <i className={`icon-minecraft ${iconName}`}></i>
    </InventorySlot>
  );
};

export default InventoryItem;

const InventorySlot = styled.div`
  width: 60px;
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #8b8b8b;
  box-shadow: inset 1.5px 1.5px 0px rgba(55, 55, 55, 0.8),
    inset -2px -2px 0px #ffffff;

  i {
    scale: 1.5;
  }
`;
