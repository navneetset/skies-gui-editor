export interface Config {
    title: string;
    size: number;
    alias_commands?: string[];
    open_actions?: Actions;
    close_actions?: Actions;
    items?: { [key: string]: Item };
  }
  
  interface Actions {
    [key: string]: Action;
  }
  
  interface Action {
    type: string;
    sound?: string;
    click?: string;
    commands?: string[];
    message?: string[];
  }
  
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
    [key: string]: any; // NBT can be quite varied, so you might need to keep it flexible
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
  
export const exportConfig = (config: Config) => {
    console.log(config);
    const configString = JSON.stringify(config, null, 2);
    const blob = new Blob([configString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "export.json";
    a.click();
    URL.revokeObjectURL(url);
}