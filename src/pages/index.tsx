import * as React from "react";
import type { HeadFC, PageProps } from "gatsby";
import styled from "styled-components";
import { useState, useEffect } from "react";
import Header from "../components/header";
import InventoryGrid from "../components/inventory-grid";
import BackgroundItems from "../components/background-items";
import GlobalStylesComponent from "../styles/GlobalStyles";
import ConfigModal from "../components/config-modal";
import {
  Action,
  Actions,
  Config,
  exportConfig,
  Item,
} from "../resources/export-config";
import OpenAction from "../components/open-action";
import CloseAction from "../components/close-action";
import GeneralForm from "../components/general-form";

const IndexPage: React.FC<PageProps> = () => {
  const [hoveredItem, setHoveredItem] = useState<{
    item: Item | null;
    x: number;
    y: number;
  }>({ item: null, x: 0, y: 0 });

  const inventoryRowMap: { [key: number]: number } = {
    1: 9,
    2: 18,
    3: 27,
    4: 36,
    5: 45,
    6: 54,
  };

  const [inventoryRows, setInventoryRows] = useState(3);
  const defaultItems = Array(inventoryRowMap[inventoryRows]).fill({
    name: "air",
    material: "minecraft:air",
    icon: "air",
  });

  const blueStainedGlass: Item = {
    name: "blue-stained-glass-pane",
    material: "minecraft:blue_stained_glass_pane",
    icon: "blue-stained-glass-pane",
  };

  const [items, setItems] = useState(defaultItems as Item[]);
  const [uiName, setUiName] = useState("<dark_purple>SkiesGUI</dark_purple>");
  const [selectedItem, setSelectedItem] = useState("" as any);

  const [backgroundItem, setBackgroundItem] = useState(blueStainedGlass);
  const [backgroundSlots, setBackgroundSlots] = useState(
    "0,1,2,3,4,5,6,7,8,9,17,18,19,20,21,22,23,24,25,26"
  );
  const [backgroundItemName, setBackgroundItemName] = useState(" ");
  const [enableBackground, setEnableBackground] = useState(true);

  useEffect(() => {
    // if background is not enabled, then set background items to air
    if (!enableBackground) {
      setItems(
        items.map((item, index) => {
          return backgroundSlots.includes(index.toString())
            ? { name: "air", material: "minecraft:air", icon: "air" }
            : item;
        })
      );
      return;
    }

    // update allItems state when backgroundItem changes
    // check if the backgroundSlots are valid and are all numbers
    const slotsToFill = backgroundSlots.split(",");

    // if empty string, then fill all slots with air
    if (backgroundSlots === "") {
      setItems(
        items.map((item, index) => {
          return backgroundSlots.includes(index.toString())
            ? { name: "air", material: "minecraft:air", icon: "air" }
            : item;
        })
      );
      return;
    }

    if (slotsToFill.some((slot) => isNaN(parseInt(slot)))) {
      console.error("Invalid slot number");
      return;
    }

    // then check if the slots are within the inventory range
    if (slotsToFill.some((slot) => parseInt(slot) > items.length - 1)) {
      alert("Background slot numbers out of range");
      return;
    }

    // update only the specified background slots
    const updatedItems = items.map((item, index) => {
      if (slotsToFill.includes(index.toString())) {
        return backgroundItem;
      }
      return item;
    });

    setItems(updatedItems);
  }, [
    backgroundItem,
    backgroundSlots,
    backgroundItemName,
    inventoryRows,
    enableBackground,
  ]);

  const [editingSlot, setEditingSlot] = useState(-1);
  const [editModalOpen, setEditModalOpen] = useState(false);

  const [config, setConfig] = useState({} as Config);

  const [fileName, setFileName] = useState("export" as string);

  const updateConfig = () => {
    let groupedItems: any = {};

    items.forEach((item, index) => {
      if (item.id) {
        if (!groupedItems[item.id]) {
          // Initialize the item with relevant fields and an empty slots array
          groupedItems[item.id] = {
            item: item.material,
            slots: [],
            name: item.name || undefined,
            amount: item.amount,
            lore: item.lore,
            click_actions: item.click_actions,
            nbt: item.nbt,
          };
        }
        if (!groupedItems[item.id].slots.includes(index)) {
          groupedItems[item.id].slots.push(index); // Add unique slot index
        }
      }
    });

    const newConfig = {
      title: uiName,
      size: inventoryRows,
      alias_commands: aliasCommands,
      open_actions: openActions,
      close_actions: closeActions,
      items: {
        ...(enableBackground && {
          background: {
            item: backgroundItem.material,
            slots: backgroundSlots.split(",").map((slot) => parseInt(slot)),
            name: backgroundItemName,
          },
        }),
        ...groupedItems,
      },
    };

    setConfig(newConfig);
  };

  useEffect(() => {
    if (Object.keys(config).length > 0) {
      // Check if config is not empty
      exportConfig(config, fileName);
    }
  }, [config]);

  const [aliasCommands, setAliasCommands] = useState([
    "example",
    "ex",
    "e",
  ] as string[]);
  const [openActions, setOpenActions] = useState({
    play_sound: {
      type: "PLAYSOUND",
      sound: "cobblemon:pc.on",
      volume: 1.0,
      pitch: 1.0,
    },
  } as Actions);

  const [closeActions, setCloseActions] = useState({
    play_sound: {
      type: "PLAYSOUND",
      sound: "cobblemon:pc.off",
      volume: 1.0,
      pitch: 1.0,
    },
  } as Actions);

  return (
    <>
      <GlobalStylesComponent />
      {editModalOpen && (
        <>
          <ConfigModal
            allItems={items}
            setAllItems={setItems}
            clickedSlot={editingSlot}
            setClose={() => setEditModalOpen(false)}
          />
          <OverlayBackground />
        </>
      )}
      <main>
        <PageStyles>
          <Header title="SkiesGUI Editor" />
          <InventoryGrid
            uiName={uiName}
            rows={inventoryRows}
            items={items}
            editingSlot={editingSlot}
            editModalOpen={editModalOpen}
            backgroundSlots={backgroundSlots
              .split(",")
              .map((slot) => parseInt(slot))}
            enableBackground={enableBackground}
            onItemMouseEnter={(e, item) => {
              setHoveredItem({ item, x: e.clientX, y: e.clientY });
            }}
            onItemMouseLeave={() => {
              setHoveredItem({ item: null, x: 0, y: 0 });
            }}
            setEditingSlot={setEditingSlot}
            setEditModalOpen={setEditModalOpen}
          />

          <button
            className="add-item-button"
            onClick={() => {
              // open the modal
              setEditModalOpen(true);
              // set the editing slot to the first empty slot
              setEditingSlot(items.findIndex((item) => item.name === "air"));
            }}
          >
            <span>Add Item</span>
          </button>

          <button className="export-button" onClick={updateConfig}>
            Export Config
          </button>

          <div className="editor">
            <GeneralForm
              inventoryRows={inventoryRows}
              setInventoryRows={setInventoryRows}
              inventoryRowMap={inventoryRowMap}
              items={items}
              setItems={setItems}
              fileName={fileName}
              setFileName={setFileName}
              uiName={uiName}
              setUiName={setUiName}
              aliasCommands={aliasCommands}
              setAliasCommands={setAliasCommands}
            />
            <div className="input-container">
              <label style={{ textAlign: "center" }}>
                Background
                <input
                  type="checkbox"
                  checked={enableBackground}
                  onChange={(e) => setEnableBackground(e.target.checked)}
                />
              </label>
              {enableBackground && (
                <BackgroundItems
                  backgroundSlots={backgroundSlots}
                  backgroundItem={backgroundItem}
                  backgroundItemName={backgroundItemName}
                  setBackgroundSlots={setBackgroundSlots}
                  setBackgroundItem={setBackgroundItem}
                  setBackgroundItemName={setBackgroundItemName}
                />
              )}
            </div>

            <OpenAction actions={openActions} setActions={setOpenActions} />
            <CloseAction actions={closeActions} setActions={setCloseActions} />
          </div>
        </PageStyles>
      </main>
    </>
  );
};

export default IndexPage;

export const Head: HeadFC = () => <title>SkiesGUI Editor</title>;

const PageStyles = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.5rem;

  input {
    font-family: Minecraftia;
  }

  input[type="checkbox"] {
    width: 0.75rem;
    height: 0.75rem;
    width: 1.5rem !important;
  }

  .add-item-button {
    margin-top: 1rem;
    margin-bottom: 1rem;
    padding: 0.1rem 0.3rem;
    border-radius: 5px;
    border: 1px solid #000;
    background: #54c146;
    font-family: Minecraftia;
    font-weight: bold;
    font-size: 0.5rem;
    cursor: pointer;
    transition: all 0.2s ease-in-out;
    box-shadow: 2px 2px 0px #67925d, inset 1px 1px 0px #fefefe;

    &:hover {
      background: #3faa37;
      transform: scale(1.03);
      translate: translateY(-2px);
    }
  }

  .export-button {
    margin-top: 1rem;
    margin-bottom: 1rem;
    padding: 0.3rem 0.45rem;
    border-radius: 5px;
    border: 1px solid #000;
    background: #c6c6c6;
    font-family: Minecraftia;
    font-weight: bold;
    font-size: 0.65rem;
    cursor: pointer;
    transition: all 0.2s ease-in-out;
    box-shadow: 2px 2px 0px #757575, inset 1px 1px 0px #fefefe;

    &:hover {
      background: #b3b3b3;
      transform: scale(1.05);
      translate: translateY(-2px);
    }
  }

  h1 {
    font-family: "Roboto mono", "Courier New", "Courier", "monospace";
    font-size: 1.5rem;
    font-weight: 700;
    margin-bottom: 1.5rem;
    text-align: center;
  }

  h2 {
    font-family: "Roboto mono", "Courier New", "Courier", "monospace";
    font-size: 1rem;
    font-weight: 700;
    line-height: 0.5;
    text-align: center;
    margin-bottom: 1rem;

    @media (max-width: 768px) {
      font-size: 0.8rem;
    }
  }

  .item-cards-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    margin-top: 2rem;
    gap: 1rem;
  }

  .row-input {
    margin-top: 0.25rem;
    margin-right: auto;
    font-size: 0.6rem;
    color: #000;
  }

  .editor {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;

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

        margin-top: 0.25rem;
        background: #f6f6f6;
        color: #000;
        border: 1px solid #fff;
        border-radius: 5px;
      }

      &.inline {
        flex-direction: row;

        label {
          margin-right: 0.5rem;
        }
      }
    }

    label {
      font-size: 0.7rem;
      font-family: Minecraftia;
    }

    &:last-child {
      margin-bottom: 4rem;
    }
  }

  .add-item {
    margin-top: 1rem;
    padding: 0.5rem 0.75rem;
    border-radius: 5px;
    border: 1px solid #000;
    background: #c6c6c6;
    font-family: Minecraftia;
    font-weight: bold;
    font-size: 0.65rem;
    cursor: pointer;
    transition: all 0.2s ease-in-out;

    &:hover {
      background: #b3b3b3;
      transform: scale(1.05);
      translate: translateY(-2px);
    }
  }

  button.collapse-button {
    background: #6e6e6e;
    color: #fff;
    font-size: 0.65rem;
    padding: 0.2rem 0.35rem;
    font-family: Minecraftia;

    &:hover {
      background: #8e8e8e;
    }
  }
`;

const OverlayBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #000000;
  opacity: 0.5;
  z-index: 1;
`;
