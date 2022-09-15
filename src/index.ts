import "source-map-support/register"

import {
  colors as defaultColors,
  backgroundColors as defaultBackgroundColors,
} from "./consts";
import { createLogger } from "./createLogger";

export const colors = defaultColors;
export const background = defaultBackgroundColors;
export const config = defaultColors;

export {
  createLogger
}
export type Logger = typeof createLogger;
export type LoggerFunctions = ReturnType<Logger>