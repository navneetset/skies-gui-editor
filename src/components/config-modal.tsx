import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Action, Actions, Item } from "../resources/export-config";
import ActionForm, { TextAreaInput } from "./action-form";
import ItemSelection from "./item-selection";
import NBTValidator from "./nbt-validator";
import NBTTooltip from "./nbt-tooltip";
import SelectionTooltip from "./selection-tooltip";

interface ConfigModalProps {
  item?: Item;
  allItems: Item[];
  clickedSlot: number;
  setClose: (close: boolean) => void;
}

const ConfigModal = ({
  item,
  allItems,
  clickedSlot,
  setClose,
}: ConfigModalProps) => {
  const [itemName, setItemName] = useState(item?.name || "");
  const [selectedItem, setSelectedItem] = useState(item);
  const [slots, setSlots] = useState(item?.slots || [clickedSlot]);
  const [lores, setLores] = useState(item?.lore || [""]);

  const handleAddSlot = () => {
    // add next available air slot
    const newSlot = Math.max(...slots) + 1;
    setSlots([...slots, newSlot]);

    // if the slot is being used by another item or background or exceeds the inventory, alert the user
    if (newSlot > allItems.length) {
      alert(
        "New slot exceeds inventory size. Please adjust accordingly before saving.`"
      );
      return;
    }

    if (allItems[newSlot - 1].material !== "minecraft:air") {
      alert(
        `Slot ${newSlot} is already occupied by ${
          allItems[newSlot - 1].name
        }. Please adjust accordingly before saving.`
      );
      return;
    }
  };

  useEffect(() => {
    console.log("Selected item changed", selectedItem);
  }, [selectedItem]);

  const handleRemoveSlot = (index: number) => {
    // if slot is last, don't remove
    if (slots.length === 1) {
      alert("Item must have at least one slot.");
      return;
    }
    const newSlots = slots.filter((_, slotIndex) => slotIndex !== index);
    setSlots(newSlots);
  };

  const handleSlotChange = (index: number, value: number) => {
    const newSlots = slots.map((slot, slotIndex) =>
      slotIndex === index ? value : slot
    );
    setSlots(newSlots);
  };

  const sortSlots = () => {
    const newSlots = slots.sort((a, b) => a - b);
    setSlots(newSlots);

    // refresh slots to trigger re-render
    setSlots([...newSlots]);
  };

  const handleAddLore = () => {
    setLores([...lores, ""]);
  };

  const handleRemoveLore = (index: number) => {
    const newLores = lores.filter((_, loreIndex) => loreIndex !== index);
    setLores(newLores);
  };

  const handleLoreChange = (index: number, value: string) => {
    const newLores = lores.map((lore, loreIndex) =>
      loreIndex === index ? value : lore
    );
    setLores(newLores);
  };

  const [localNbt, setLocalNbt] = useState("{}");

  const handleNbtChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setLocalNbt(e.target.value);
  };

  const [actions, setActions] = useState({
    play_sound: {
      type: "PLAYSOUND",
      sound: "cobblemon:pc.on",
      volume: 1.0,
      pitch: 1.0,
    },
  } as Actions);

  const [actionIdCounter, setActionIdCounter] = useState(0);

  const handleActionChange = (actionId: string, updatedAction: Action) => {
    setActions({ ...actions, [actionId]: updatedAction });
  };

  const handleAddAction = () => {
    const newActionId = `action_${actionIdCounter}`; // Create a unique ID
    setActionIdCounter(actionIdCounter + 1); // Increment the counter

    const newAction: Action = {
      type: "MESSAGE", // Default type for new action
      message: [], // Default values for the new action
    };
    setActions({ ...actions, [newActionId]: newAction });
  };

  const handleRemoveAction = (actionId: string) => {
    const newActions = { ...actions };
    delete newActions[actionId];
    setActions(newActions);
  };

  const handleActionIdChange = (oldId: string, newId: string) => {
    const updatedActions = { ...actions };
    if (updatedActions[newId]) {
      alert(`Action with ID '${newId}' already exists.`);
      return;
    }

    updatedActions[newId] = updatedActions[oldId];
    delete updatedActions[oldId];
    setActions(updatedActions);
  };

  return (
    <ModalStyle open>
      <h1>Item Configurator</h1>
      <div className="form-container">
        <div className="input-container">
          <label>Item Name</label>
          <input type="text" placeholder="<green>Stone" />
        </div>
        <div className="input-container">
          <label>
            Item <SelectionTooltip />
          </label>
          <ItemSelection
            selectedItem={selectedItem as Item}
            setSelectedItem={setSelectedItem}
          />
        </div>
        <label>Slots</label>
        <div className="slots-container">
          {slots.map((slot, index) => (
            <div key={index} className="slot-input">
              <input
                type="number"
                value={slot}
                onChange={(e) =>
                  handleSlotChange(index, Number(e.target.value))
                }
              />
              {slots.length > 1 && (
                <button
                  className="remove-slot"
                  onClick={() => handleRemoveSlot(index)}
                >
                  -
                </button>
              )}
            </div>
          ))}
        </div>
        <button className="add-slot" onClick={handleAddSlot}>
          +
        </button>
        <button className="sort-slot" onClick={sortSlots}>
          Sort
        </button>

        <div className="input-container">
          <label>Lores</label>
          {lores.map((lore, index) => (
            <div key={index}>
              <input
                type="text"
                value={lore}
                className="lore"
                onChange={(e) => handleLoreChange(index, e.target.value)}
              />
              <button
                className="remove-slot"
                onClick={() => handleRemoveLore(index)}
              >
                -
              </button>
            </div>
          ))}

          <button className="add-slot" onClick={handleAddLore}>
            +
          </button>
        </div>

        <div className="input-container">
          <label style={{ marginBottom: "0.5rem" }}>
            NBT <NBTTooltip />
          </label>
          <TextAreaInput value={localNbt} onChange={handleNbtChange} />
          <NBTValidator
            nbt={localNbt}
            onValidNbt={(parsedNbt) => setLocalNbt(JSON.stringify(parsedNbt))}
          />
        </div>

        <div className="input-container">
          <label>Click Actions</label>
          <div className="actions">
            {Object.entries(actions).map(([actionId, action]) => (
              <ActionForm
                itemSelectorWidth="370px"
                key={actionId}
                actionId={actionId}
                action={action}
                onChange={(updatedAction) =>
                  handleActionChange(actionId, updatedAction)
                }
                onIdChange={(newId: string) =>
                  handleActionIdChange(actionId, newId)
                }
              >
                <button
                  className="remove-button"
                  onClick={() => handleRemoveAction(actionId)}
                >
                  Remove
                </button>
              </ActionForm>
            ))}
          </div>
          <div className="add-action button-container">
            <button onClick={handleAddAction}>Add Action</button>
          </div>
        </div>
      </div>
      <div className="button-container" onClick={() => setClose(false)}>
        <button>Close</button>
        <button className="save-button">Save</button>
      </div>
    </ModalStyle>
  );
};

export default ConfigModal;

const ModalStyle = styled.dialog`
  background: #9e9e9e;
  margin-top: 10%;
  z-index: 100;
  border-radius: 5px;
  padding: 0.5rem;
  box-shadow: 5px 5px 0px #555555, inset 2px 2px 0px #fefefe;

  h1 {
    font-family: Minecraftia;
    font-weight: bold;
    font-size: 1rem;
  }

  p {
    font-size: 0.8rem;
    font-family: Minecraftia;
  }

  .button-container {
    display: flex;
    justify-content: space-between;

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

  .add-action {
    button {
      background: #c6c6c6;
      font-size: 0.5rem;
      cursor: pointer;

      &:hover {
        background: #b3b3b3;
        transform: scale(1.05);
        translate: translateY(-1.5px);
      }
    }
  }

  button {
    margin-top: 1rem;
    padding: 0.3rem 0.45rem;
    border-radius: 5px;
    border: 1px solid #000;
    background: #eab6b6;
    font-family: Minecraftia;
    font-size: 0.65rem;
    cursor: pointer;
    transition: all 0.2s ease-in-out;
    box-shadow: 2px 2px 0px #757575, inset 1px 1px 0px #fefefe;
    animation: fadeIn 0.5s ease;

    &.save-button {
      background: #8ae68a;
    }

    &:hover {
      background: #bb3737;
      transform: scale(1.05);
      translate: translateY(-2px);

      &.save-button {
        background: #5fde5f;
      }
    }

    &.remove-slot {
      background: #af4545;
      color: #fff;
      margin-left: 0.2rem;
      height: 1rem;
      font-size: 0.3rem;

      &:hover {
        background: #f35555;
      }
    }

    &.add-slot {
      background: #686e97;
      width: 1.75rem;
      font-size: 0.4rem;
      color: #fff;
      transform: translateY(0.3rem);

      &:hover {
        background: #8e8eaf;
      }
    }

    &.sort-slot {
      margin-left: 0.5rem;
      background: #6e6e6e;
      color: #fff;
      transform: translateY(0.3rem);
      font-size: 0.4rem;

      &:hover {
        background: #8e8e8e;
      }
    }
  }

  .input-container {
    display: flex;
    flex-direction: column;

    margin-top: 1rem;

    &:first-child {
      margin-top: 0;
    }

    input {
      font-size: 0.6rem;
      padding: 0.2rem 0.4rem;
      font-family: Minecraftia;

      margin-top: 0.25rem;
      background: #f6f6f6;
      color: #000;
      border: 1px solid #fff;
      border-radius: 5px;
      animation: fadeIn 0.5s ease;

      &.lore {
        width: 87%;
      }
    }

    &.inline {
      flex-direction: row;

      label {
        margin-right: 0.5rem;
      }
    }
  }

  .slots-container {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    max-width: 430px;
    gap: 0.5rem;

    margin-top: -0.5rem;

    &:first-child {
      margin-top: 0;
    }

    .slot-input {
      height: 1.5rem;
    }

    input {
      font-size: 0.6rem;
      padding: 0.2rem 0.4rem;
      font-family: Minecraftia;
      width: 1.6rem;

      margin-top: 0.25rem;
      background: #f6f6f6;
      color: #000;
      border: 1px solid #fff;
      border-radius: 5px;
    }
  }

  label {
    font-size: 0.7rem;
    font-family: Minecraftia;
  }
`;
