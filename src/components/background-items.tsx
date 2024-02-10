import React from "react";
import ItemSelection from "./item-selection";
import { Item } from "../resources/export-config";
import styled from "styled-components";

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
    <BackgroundItemsStyles>
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
    </BackgroundItemsStyles>
  );
};

export default BackgroundItems;

const BackgroundItemsStyles = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 0.7rem;
  font-family: inherit;
  background: #6e6e6e;
  padding: 0.5rem;
  border-radius: 5px;
  margin-top: 0.5rem;
  box-shadow: 5px 5px 0px #555555, inset 2px 2px 0px #fefefe;
  animation: fadeIn 0.5s ease;
  transition: all 0.4s ease-in-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  textarea {
    padding: 0.5rem;
    margin-top: 0.3rem;
    font-size: 0.65rem;
    font-family: Minecraftia;
    border-radius: 5px;
    border: 1px solid #000;
    background: #dfdfdf;
  }
`;
