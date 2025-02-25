import type { DataType } from "flamework-binary-serializer";

export const INITIAL_GLOBAL_DATA: GlobalData = {

};

export interface GlobalData {

}

export const INITIAL_DATA: PlayerData = {
  coins: 0,
  purchaseHistory: []
};

export interface PlayerData {
  readonly coins: DataType.u32;
  readonly purchaseHistory: string[];
}