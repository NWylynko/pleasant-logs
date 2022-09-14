import "source-map-support/register.js"

import defaultConfig, {
  RESET,
  dim,
  tab,
  colors as defaultColors,
  backgroundColors as defaultBackgroundColors,
  Config,
  Colors,
  options,
} from "./consts.js";
import { Process } from "./Process.js";

export const colors = defaultColors;
export const background = defaultBackgroundColors;
export const config = defaultColors;

export interface Logger {
  id: string;
  config: Config;
  colors: Colors;
  start: number;
  processes: any[];
  logOut: (x: string) => boolean;
  logErr: (x: string) => boolean;
  info(log: string, { color, background, icon, prefix }?: options): void;
  success(log: string, { color, background, icon, prefix }?: options): void;
  warning(log: string, { color, background, icon, prefix }?: options): void;
  error(log: string, { color, background, icon, prefix }?: options): void;
  fail(log: string, { color, background, icon, prefix }?: options): void;
  process(
    text: string,
    promise: () => Promise<any>,
    ProcessOptions?: ProcessOptions
  ): Process;
  _success(log: string, { color, background, icon, prefix }?: options): void;
  _error(log: string, { color, background, icon, prefix }?: options): void;
  defaultOptions: {
    color: string | undefined;
    background: string | undefined;
    icon: string | undefined;
    prefix: string | undefined;
  };
}

export interface ProcessOptions extends options {
  finishText: string;
}

export class Logger {
  constructor(
    id: string,
    config: Config = defaultConfig,
    colors: Colors = defaultColors
  ) {
    this.id = id;
    this.config = config;
    this.colors = colors;
    this.start = Date.now();
    this.processes = [];
    this.logOut = (log: string) => process.stdout.write(`${log}${RESET}\n`);
    this.logErr = (log: string) => process.stderr.write(`${log}${RESET}\n`);
  }

  public info = (
    log: string,
    { color, background, icon, prefix }: options = {
      color: this.config.info.color,
      background: this.config.info.background,
      icon: this.config.info.icon,
      prefix: this.config.info.prefix,
    }
  ) => {
    this.pushProcessesUp();
    this.logOut(
      `${this.firstPart({
        color: color || this.config.info.color,
        background: background || this.config.info.background,
        icon: icon || this.config.info.icon,
        prefix: prefix || this.config.info.prefix,
      })}${log}`
    );
  };

  public success = (
    log: string,
    { color, background, icon, prefix }: options = {
      color: this.config.success.color,
      background: this.config.success.background,
      icon: this.config.success.icon,
      prefix: this.config.success.prefix,
    }
  ) => {
    this.pushProcessesUp();
    this._success(log, { color, background, icon, prefix });
  };

  public warning = (
    log: string,
    { color, background, icon, prefix }: options = {
      color: this.config.warning.color,
      background: this.config.warning.background,
      icon: this.config.warning.icon,
      prefix: this.config.warning.prefix,
    }
  ) => {
    this.pushProcessesUp();
    this.logErr(
      `${this.firstPart({
        color: color || this.config.warning.color,
        background: background || this.config.warning.background,
        icon: icon || this.config.warning.icon,
        prefix: prefix || this.config.warning.prefix,
      })}${log}`
    );
  };

  public error = (
    log: string,
    { color, background, icon, prefix }: options = {
      color: this.config.error.color,
      background: this.config.error.background,
      icon: this.config.error.icon,
      prefix: this.config.error.prefix,
    }
  ) => {
    this.pushProcessesUp();
    this._error(log, { color, background, icon, prefix });
  };

  public fail = (
    log: string,
    { color, background, icon, prefix }: options = {
      color: this.config.fail.color,
      background: this.config.fail.background,
      icon: this.config.fail.icon,
      prefix: this.config.fail.prefix,
    }
  ) => {
    this.pushProcessesUp();
    this.logErr(
      `${this.firstPart({
        color: color || this.config.fail.color,
        background: background || this.config.fail.background,
        icon: icon || this.config.fail.icon,
        prefix: prefix || this.config.fail.prefix,
      })}${log}`
    );
  };

  public critical = (
    log: string,
    { color, background, icon, prefix }: options = {
      color: this.config.critical.color,
      background: this.config.critical.background,
      icon: this.config.critical.icon,
      prefix: this.config.critical.prefix,
    }
  ) => {
    this.pushProcessesUp();
    this.logErr(
      `${this.firstPart({
        color: color || this.config.critical.color,
        background: background || this.config.critical.background,
        icon: icon || this.config.critical.icon,
        prefix: prefix || this.config.critical.prefix,
      })}${log}`
    );
  };

  public process = (
    text: string,
    promise: () => Promise<any>,
    processOptions: ProcessOptions = {
      color: this.config.process.color,
      background: this.config.process.background,
      icon: this.config.process.icon,
      prefix: this.config.process.prefix,
      finishText: "",
    }
  ) => {
    this.pushProcessesUp();
    const processer = new Process(this, text, promise, processOptions);
    this.processes.push(processer);
    return processer;
  };

  public _success = (
    log: string,
    { color, background, icon, prefix }: options = {
      color: this.config.success.color,
      background: this.config.success.background,
      icon: this.config.success.icon,
      prefix: this.config.success.prefix,
    }
  ) => {
    this.logOut(
      `${this.firstPart({
        color: color || this.config.success.color,
        background: background || this.config.success.background,
        icon: icon || this.config.success.icon,
        prefix: prefix || this.config.success.prefix,
      })}${log}`
    );
  };

  public _error = (
    log: string,
    { color, background, icon, prefix }: options = {
      color: this.config.error.color,
      background: this.config.error.background,
      icon: this.config.error.icon,
      prefix: this.config.error.prefix,
    }
  ) => {
    this.logErr(
      `${this.firstPart({
        color: color || this.config.error.color,
        background: background || this.config.error.background,
        icon: icon || this.config.error.icon,
        prefix: prefix || this.config.error.prefix,
      })}${log}`
    );
  };

  public firstPart({ color, prefix, background, icon }: options): string {
    return `${color}${background || ""}${prefix}${RESET}${this.colors.white
      }${dim}${prefix ? (prefix.length < 8 ? tab : "") : ""}| ${this.id
      } +${this.TimeSinceStart(this.start)}ms${tab}| ${RESET}${color}${background || ""
      }${icon} `;
  }

  public TimeSinceStart = (start: number = this.start) => Date.now() - start;

  private pushProcessesUp() {
    for (let i = 0; i < this.processes.length; i++) {
      this.processes[i].pushUp();
    }
  }
}

export default Logger;
