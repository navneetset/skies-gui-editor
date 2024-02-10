import React from "react";
import styled from "styled-components";
import InventoryItem from "./inventory-item";
import deserializeMiniMessage from "./deserialize-mini-message";
import { Item } from "../resources/export-config";

interface InventoryGridProps {
  uiName: string;
  rows: number;
  items: Item[];
  editingSlot: number;
  editModalOpen: boolean;
  backgroundSlots: number[];
  enableBackground: boolean;
  onItemMouseEnter: (e: React.MouseEvent, item: any) => void;
  onItemMouseLeave: () => void;
  setEditingSlot: (slot: number) => void;
  setEditModalOpen: (open: boolean) => void;
}

const InventoryGrid = ({
  uiName,
  rows,
  items,
  editingSlot,
  editModalOpen,
  backgroundSlots,
  enableBackground,
  onItemMouseEnter,
  onItemMouseLeave,
  setEditingSlot,
  setEditModalOpen,
}: InventoryGridProps) => (
  <ChestInventory className="inventory-grid" rows={rows}>
    <div className="inventory-header">
      <span>{deserializeMiniMessage(uiName)}</span>
    </div>
    {items.map((item, index) => (
      <div
        data-slot={index}
        key={`${item.name}-${index}`}
        onClick={() => {
          if (backgroundSlots.includes(index) && enableBackground) {
            alert("This slot is a background slot.");
            return;
          }
          // if slot has no item, don't open modal
          if (item.name == "air" || !item.material) {
            alert("This slot has no item. Add an item first.");
            return;
          }
          
          setEditingSlot(index);
          setEditModalOpen(true);
        }}
      >
        <InventoryItem
          key={`${item.name}-${index}`}
          item={item}
          onMouseEnter={(e: React.MouseEvent) => onItemMouseEnter(e, item)}
          onMouseLeave={onItemMouseLeave}
        />
      </div>
    ))}
  </ChestInventory>
);

export default InventoryGrid;

const ChestInventory = styled.div<{
  rows: number;
}>`
  display: grid;
  grid-template-columns: repeat(9, 1fr);
  grid-template-rows: repeat(${(props) => props.rows}, 1fr);
  width: auto;
  height: auto;
  background: #c6c6c6;
  border-radius: 3px;
  border: 2px solid #000;
  box-shadow: 5px 5px 0px #555555, inset 2px 2px 0px #fefefe;
  padding: 5px;
  margin-bottom: 10px;

  .inventory-header {
    grid-column: 1 / -1; // Span the entire width of the grid
    background: #c6c6c6;
    text-align: left;
    margin-bottom: 2px;
    font-family: Minecraftia;
    font-weight: bold;
    font-size: 22px;
    padding: 5px 0;
    color: #3c3838;
    text-shadow: 1px 1px 0px #fefefe;

    span {
      margin-left: 5px;
    }
  }

  // on hover, show slot number
  div {
    position: relative;
    &:hover {
      &:after {
        content: attr(data-slot);
        position: absolute;
        top: 0;
        left: 0;
        background: #000;
        color: #fff;
        padding: 2px;
        font-size: 10px;
      }
    }
  }
`;
