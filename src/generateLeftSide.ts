import {
  RESET,
  dim,
  tab, Colors,
  Option
} from "./consts";
import { TimeSinceStart } from "./TimeSinceStart";

export const generateLeftSide = (id: string, start: number, colors: Colors) => ({ color, prefix, background, icon }: Option): string => {
  const fullPrefix = `${color}${background || ""}${prefix}${RESET}`;
  const idAndTime = `${colors.white}${dim}${prefix ? (prefix.length < 8 ? tab : "") : ""}| ${id} +${TimeSinceStart(start)}ms${tab}| ${RESET}`;
  const iconAndColour = `${color}${background || ""}${icon} `;

  return fullPrefix + idAndTime + iconAndColour;
};

export type GenerateLeftSide = typeof generateLeftSide;
export type LeftSideText = ReturnType<GenerateLeftSide>