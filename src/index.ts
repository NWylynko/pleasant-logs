import readline from "readline";

import defaultConfig, {
  RESET,
  dim,
  tab,
  colors as defaultColors,
  // eslint-disable-next-line no-unused-vars
  Config,
  // eslint-disable-next-line no-unused-vars
  Colors,
} from "./config.js";

const LoadingBar = [
  "▪▪▫▫▫▫▫",
  "▪▪▪▫▫▫▫",
  "▫▪▪▪▫▫▫",
  "▫▫▪▪▪▫▫",
  "▫▫▫▪▪▪▫",
  "▫▫▫▫▪▪▪",
  "▫▫▫▫▫▪▪",
  "▪▪▪▪▪▪▪",
];

interface Logger {
  id: string;
  config: Config;
  colors: Colors;
  start: number;
  watchers: any[];
  logOut: (x: string) => boolean;
  logErr: (x: string) => boolean;
  info(...args: string[]): void;
  success(...args: string[]): void;
  warning(...args: string[]): void;
  error(...args: string[]): void;
  fail(...args: string[]): void;
  watch(x: string, promise: () => Promise<any>): Watch;
  _success(...args: string[]): void;
  _error(...args: string[]): void;
}

class Logger {
  constructor(
    id: string,
    config: Config = defaultConfig,
    colors: Colors = defaultColors
  ) {
    this.id = id;
    this.config = config;
    this.colors = colors;
    this.start = Date.now();
    this.watchers = [];
    this.logOut = (...args: string[]) =>
      process.stdout.write(`${args.join(" ")}${RESET}\n`);
    this.logErr = (...args: string[]) =>
      process.stderr.write(`${args.join(" ")}${RESET}\n`);
  }

  public info = (...args: string[]) => {
    this.pushWatchersUp();
    this.logOut(
      `${this.firstPart(this.config.info.color, this.config.info.text)}${
        this.config.info.icon
      } ${args}`
    );
  };

  public success = (...args: string[]) => {
    this.pushWatchersUp();
    this._success(...args);
  };

  public warning = (...args: string[]) => {
    this.pushWatchersUp();
    this.logErr(
      `${this.firstPart(this.config.warning.color, this.config.warning.text)}${
        this.config.warning.icon
      } ${args}`
    );
  };

  public error = (...args: string[]) => {
    this.pushWatchersUp();
    this._error(...args);
  };

  public fail = (...args: string[]) => {
    this.pushWatchersUp();
    this.logErr(
      `${this.firstPart(this.config.fail.color, this.config.fail.text)}${
        this.config.fail.icon
      } ${args}`
    );
  };

  public watch = (x: string, promise: () => Promise<any>) => {
    this.pushWatchersUp();
    const watcher = new Watch(this, x, promise);
    this.watchers.push(watcher);
    return watcher;
  };

  public _success = (...args: string[]) => {
    this.logOut(
      `${this.firstPart(this.config.success.color, this.config.success.text)}${
        this.config.success.icon
      } ${args}`
    );
  };

  public _error = (...args: string[]) => {
    this.logErr(
      `${this.firstPart(this.config.error.color, this.config.error.text)}${
        this.config.fail.icon
      } ${args}`
    );
  };

  private firstPart(color: string, str: string): string {
    return `${color}${str}${this.colors.white}${dim}${tab} | ${
      this.id
    } +${this.TimeSinceStart(this.start)}ms${tab} | ${RESET}${color} `;
  }

  private TimeSinceStart = (start: number = this.start) => Date.now() - start;

  private pushWatchersUp() {
    for (let i = 0; i < this.watchers.length; i++) {
      this.watchers[i].pushUp();
    }
  }
}

export default Logger;

interface Watch {
  logger: any;
  colors: Colors;
  config: Config;
  animationN: number;
  tick: number;
  row: number;
  timer: number;
  firstPart: string;
  pushUp(): void;
}
class Watch {
  constructor(logger: any, x: string, promise: () => Promise<any>) {
    this.logger = logger;
    this.config = this.logger.config;
    this.colors = this.logger.colors;
    this.row = -1;
    this.timer = Date.now();
    this.animationN = 0;
    this.tick = 0;
    this.firstPart = this.logger.firstPart(
      this.config.watch.color,
      this.config.watch.text
    );
    this.moveToBottom();
    this.logger.logOut(
      `${this.firstPart}${this.config.watch.icon} ${LoadingBar[0]} [0ms] ${x}`
    ); // inital write

    const interval = setInterval(() => {
      this.tick++;
      if (this.tick > 10) {
        this.animationN++;
        this.tick = 0;
      }
      if (this.animationN >= 6) {
        this.animationN = 0;
      }
      this.moveToRow();
      this.logger.logOut(
        `${this.firstPart}${this.config.watch.icon} ${
          LoadingBar[this.animationN]
        } [${this.coloredCounter()}${this.config.watch.color}] ${x}` // every "frame"
      );
      this.moveToBottom();
    }, 10);

    promise()
      .then((output) => {
        clearInterval(interval);
        this.moveToRow();
        this.logger._success(
          `${LoadingBar[7]} [${this.coloredCounter()}${
            this.config.success.color
          }] ${x} | ${typeof output === "string" ? output : typeof output}`
        );
        this.moveToBottom();
      })
      .catch((reason: any) => {
        clearInterval(interval);
        this.moveToRow();
        this.logger._error(
          `${LoadingBar[7]} [${this.coloredCounter()}${
            this.config.error.color
          }] ${x} | ${reason}`
        );
        this.moveToBottom();
      });
  }

  private coloredCounter() {
    const timer = this.logger.TimeSinceStart(this.timer);
    if (timer < 10) {
      return `${this.colors.green}${timer}ms`;
    } else if (timer < 50) {
      return `${this.colors.yellow}${timer}ms`;
    } else {
      return `${this.colors.red}${timer}ms`;
    }
  }

  private moveToBottom() {
    readline.moveCursor(process.stdout, 0, this.logger.watchers.length);
  }

  private moveToRow() {
    readline.moveCursor(process.stdout, 0, this.row);
  }

  public pushUp() {
    this.row = this.row - 1;
  }
}
