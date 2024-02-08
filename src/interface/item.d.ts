export interface Item {
  name?: string;
  material: string;
  nbt?: string;
  description?: string[];
  nbt?: string;
  buyPrice?: number;
  buyType?: "item" | "command";
  sellPrice?: number;
  quantityList?: number[];
  commands?: string[];
  icon?: string;
}
