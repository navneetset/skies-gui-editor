import React from "react";
import ItemSelection from "./item-selection";
import { Item } from "../interface/item";

interface BackgroundItemsProps {
  backgroundSlots: string;
  backgroundItem: Item;
  backgroundItemName: string;
  setBackgroundSlots: (slots: string) => void;
  setBackgroundItem: (item: any) => void;
  setBackgroundItemName: (name: string) => void;
}

const BackgroundItems = ({
  backgroundSlots,
  backgroundItem,
  backgroundItemName,
  setBackgroundItem,
  setBackgroundSlots,
  setBackgroundItemName,
}: BackgroundItemsProps) => {
  return (
    <>
      <div className="input-container">
        <label>Background Item</label>
        <ItemSelection
          selectedItem={backgroundItem}
          setSelectedItem={setBackgroundItem}
        />
      </div>
      <div className="input-container">
        <label>Background Item Name</label>
        <input
          type="text"
          value={backgroundItemName}
          onChange={(e) => setBackgroundItemName(e.target.value)}
        />
      </div>
      <div className="input-container">
        <label>Background Slots (Comma Separated)</label>
        <textarea
          style={{ height: "3rem" }}
          value={backgroundSlots}
          onChange={(e) => setBackgroundSlots(e.target.value)}
        />
      </div>
    </>
  );
};

export default BackgroundItems;
