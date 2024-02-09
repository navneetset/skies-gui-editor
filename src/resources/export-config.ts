export interface Config {
    title: string;
    size: number;
    alias_commands?: string[];
    open_actions?: Actions;
    close_actions?: Actions;
    items?: { [key: string]: Item };
  }
  
  export interface Actions {
    [key: string]: Action;
  }
  
  export interface Action {
    type: ActionType;
    click?: ClickType;
    commands?: string[];
    message?: string[];
    sound?: string;
    volume?: number;
    pitch?: number;
    id?: string;
    amount?: number;
    level?: boolean;
    currency?: string;
    item?: string;
    nbt?: NBT;
  }

  export type ClickType = "ANY" | "LEFT_CLICK" | "SHIFT_LEFT_CLICK" | "ANY_LEFT_CLICK" | "RIGHT_CLICK" | "SHIFT_RIGHT_CLICK" | "ANY_RIGHT_CLICK" | "ANY_CLICK" | "ANY_MAIN_CLICK" | "ANY_SHIFT_CLICK" | "MIDDLE_CLICK" | "THROW";
  export type ActionType = "MESSAGE" | "COMMAND_CONSOLE" | "COMMAND_PLAYER" | "BROADCAST" | "PLAYSOUND" | "OPEN_GUI" | "CLOSE_GUI" | "REFRESH_GUI" | "GIVE_XP" | "CURRENCY_DEPOSIT" | "CURRENCY_WITHDRAW" | "CURRENCY_SET" | "GIVE_ITEM" | "TAKE_ITEM" | "";
  
  interface Item {
    item: string;
    slots: number[];
    amount?: number;
    name: string;
    lore?: string[];
    nbt?: NBT;
    click_actions?: { [key: string]: Action };
    priority?: number;
    view_requirements?: ViewRequirements;
  }
  
  interface NBT {
    [key: string]: any;
  }
  
  interface ViewRequirements {
    requirements: {
      [key: string]: Requirement;
    };
  }
  
  interface Requirement {
    type: string;
    permission?: string;
  }
  
export const exportConfig = (config: Config, fileName: string) => {
    console.log(config);
    const configString = JSON.stringify(config, null, 2);
    const blob = new Blob([configString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${fileName}.json`;
    a.click();
    URL.revokeObjectURL(url);
}