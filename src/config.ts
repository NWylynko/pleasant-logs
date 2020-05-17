export const colors: Colors = {
  white: "\x1b[37m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  red: "\x1b[31m",
  cyan: "\x1b[36m",
  black: "\x1b[30m",
  Blue: "\x1b[34m",
  Magenta: "\x1b[35m",
};

export const backgroundColors: Colors = {
  white: "\x1b[47m",
  green: "\x1b[42m",
  yellow: "\x1b[43m",
  red: "\x1b[41m",
  cyan: "\x1b[46m",
  black: "\x1b[40m",
  Blue: "\x1b[44m",
  Magenta: "\x1b[44m",
};

const config: Config = {
  info: { prefix: "INFO", color: colors.white, icon: "ℹ" },
  success: { prefix: "SUCCESS", color: colors.green, icon: "✔" },
  warning: { prefix: "WARNING", color: colors.yellow, icon: "!" },
  error: { prefix: "ERROR", color: colors.red, icon: "☠" },
  fail: { prefix: "FAIL", color: colors.red, icon: "✘" },
  critical: {
    prefix: "CRITICAL",
    color: colors.white,
    background: backgroundColors.red,
    icon: "☠",
  },
  process: { prefix: "PROCESS", color: colors.cyan, icon: "⧗" },
};

export default config;

export const RESET: string = "\x1b[0m";
export const dim: string = "\x1b[2m";
export const tab: string = "\t";

export interface options {
  prefix?: string;
  color?: color;
  background?: color;
  icon?: string;
}
export interface Config {
  info: options;
  success: options;
  warning: options;
  error: options;
  fail: options;
  critical: options;
  process: options;
}

type color = string;

export interface Colors {
  white: color;
  green: color;
  yellow: color;
  red: color;
  cyan: color;
  black: color;
  Blue: color;
  Magenta: color;
}
