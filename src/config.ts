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

const config: Config = {
  info: { text: "INFO", color: colors.white, icon: "ℹ" },
  success: { text: "SUCCESS", color: colors.green, icon: "✔" },
  warning: { text: "WARNING", color: colors.yellow, icon: "!" },
  error: { text: "ERROR", color: colors.red, icon: "☠" },
  fail: { text: "FAIL", color: colors.red, icon: "✘" },
  watch: { text: "WATCH", color: colors.cyan, icon: "⧗" },
};

export default config;

export const RESET: string = "\x1b[0m";
export const dim: string = "\x1b[2m";
export const tab: string = "\t";

interface method {
  text: string;
  color: string;
  icon: string;
}
export interface Config {
  info: method;
  success: method;
  warning: method;
  error: method;
  fail: method;
  watch: method;
}

export interface Colors {
  white: string;
  green: string;
  yellow: string;
  red: string;
  cyan: string;
  black: string;
  Blue: string;
  Magenta: string;
}
