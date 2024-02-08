import React from "react";
import styled from "styled-components";
import InventoryItem from "./inventory-item";
import deserializeMiniMessage from "./deserialize-mini-message";

interface InventoryGridProps {
  uiName: string;
  rows: number;
  items: any[];
  onItemMouseEnter: (e: React.MouseEvent, item: any) => void;
  onItemMouseLeave: () => void;
}

const InventoryGrid = ({
  uiName,
  rows,
  items,
  onItemMouseEnter,
  onItemMouseLeave,
}: InventoryGridProps) => (
  <ChestInventory className="inventory-grid" rows={rows}>
    <div className="inventory-header">
      <span>{deserializeMiniMessage(uiName)}</span>
    </div>
    {items.map((item, index) => (
      <InventoryItem
        key={`${item.name}-${index}`}
        item={item}
        onMouseEnter={(e: React.MouseEvent) => onItemMouseEnter(e, item)}
        onMouseLeave={onItemMouseLeave}
      />
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
`;
