import * as React from "react";
import type { HeadFC, PageProps } from "gatsby";
import styled from "styled-components";
import { useState, useEffect } from "react";
import { Item } from "../interface/item";
import Header from "../components/header";
import InventoryGrid from "../components/inventory-grid";
import CreatableSelect from "react-select/creatable";
import BackgroundItems from "../components/background-items";
import GlobalStylesComponent from "../styles/GlobalStyles";
import ConfigModal from "../components/config-modal";
import { Action, Config, exportConfig } from "../resources/export-config";
import OpenAction from "../components/open-action";

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
    // if background is not enabled, then set all items to air
    if (!enableBackground) {
      setItems(
        items.map((item) => {
          return { name: "air", material: "minecraft:air", icon: "air" };
        })
      );
      return;
    }

    // update allItems state when backgroundItem changes
    // check if the backgroundSlots are valid and are all numbers
    const slotsToFill = backgroundSlots.split(",");
    // first check if the slots are valid

    // if empty string, then fill all slots with air
    if (backgroundSlots === "") {
      setItems(
        items.map((item) => {
          return { name: "air", material: "minecraft:air", icon: "air" };
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
    // slots that are not filled with the backgroundItem should be filled with air
    const updatedItems = items.map((_item, index) => {
      if (slotsToFill.includes(index.toString())) {
        return backgroundItem;
      } else {
        return { name: "air", material: "minecraft:air", icon: "air" };
      }
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

  const updateConfig = () => {
    const newConfig: Config = {
      title: uiName,
      size: inventoryRows,
      items: {
        ...(enableBackground && {
          background: {
            item: backgroundItem.material,
            slots: backgroundSlots.split(",").map((slot) => parseInt(slot)),
            name: backgroundItemName,
          },
        }),
      },
    };

    setConfig(newConfig);
  };

  useEffect(() => {
    if (Object.keys(config).length > 0) {
      // Check if config is not empty
      exportConfig(config);
    }
  }, [config]);

  const [openActions, setOpenActions] = useState([] as Action[]);

  return (
    <>
      <GlobalStylesComponent />
      {editModalOpen && (
        <>
          <ConfigModal />
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
            onItemMouseEnter={(e, item) => {
              setHoveredItem({ item, x: e.clientX, y: e.clientY });
            }}
            onItemMouseLeave={() => {
              setHoveredItem({ item: null, x: 0, y: 0 });
            }}
            setEditingSlot={setEditingSlot}
            setEditModalOpen={setEditModalOpen}
          />
          <button className="export-button" onClick={updateConfig}>
            Export
          </button>

          <div className="editor">
            <div className="input-container">
              <label>UI Name</label>
              <input
                value={uiName}
                onChange={(e) => setUiName(e.target.value)}
              />
            </div>
            <div className="input-container">
              <label>Inventory Rows</label>
              <CreatableSelect
                className="row-input"
                options={[
                  { value: 1, label: 1 },
                  { value: 2, label: 2 },
                  { value: 3, label: 3 },
                  { value: 4, label: 4 },
                  { value: 5, label: 5 },
                  { value: 6, label: 6 },
                ]}
                value={{ value: inventoryRows, label: inventoryRows }}
                onChange={(option) => {
                  setInventoryRows(option?.value as number);
                  setItems(
                    Array(inventoryRowMap[option?.value as number]).fill({})
                  );
                }}
              />
            </div>
            <OpenAction />
            <div className="input-container">
              <label>Background</label>
              <input
                type="checkbox"
                checked={enableBackground}
                onChange={(e) => setEnableBackground(e.target.checked)}
              />
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
          </div>
        </PageStyles>
      </main>
    </>
  );
};

export default IndexPage;

export const Head: HeadFC = () => <title>Home Page</title>;

const PageStyles = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.5rem;

  input {
    font-family: Minecraftia;
  }

  textarea {
    padding: 0.5rem;
    width: 600px;
    margin-top: 0.3rem;
    font-size: 0.8rem;
    font-family: Minecraftia;
  }

  .export-button {
    margin-top: 1rem;
    padding: 0.3rem 0.45rem;
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

  h1 {
    font-family: "Roboto mono", "Courier New", "Courier", "monospace";
    font-size: 1.5rem;
    font-weight: 700;
    margin-bottom: 1.5rem;
  }

  h2 {
    font-family: "Roboto mono", "Courier New", "Courier", "monospace";
    font-size: 1.5rem;
    font-weight: 700;
    line-height: 0;
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
    margin-top: 0.5rem;
    margin-left: auto;
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
      align-items: center;
      margin-top: 1rem;
      width: 100%;

      input {
        margin-top: 0.3rem;
        font-size: 0.7rem;
        padding: 0.2rem 0.4rem;
        width: 500px;
        margin-left: auto;
        margin-right: auto;
        color: #000;
        border: 1px solid #fff;
      }
    }

    label {
      font-size: 0.7rem;
      font-family: Minecraftia;
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
`;

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
  padding-top: 5px;
  padding-left: 5px;
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
