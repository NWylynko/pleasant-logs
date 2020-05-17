import readline from "readline";
// eslint-disable-next-line no-unused-vars
import { Logger, ProcessOptions } from "./index";
// eslint-disable-next-line no-unused-vars
import { Config, Colors } from "./config.js";

const LoadingBar: string[] = [
  "▪▪▫▫▫▫▫",
  "▪▪▪▫▫▫▫",
  "▫▪▪▪▫▫▫",
  "▫▫▪▪▪▫▫",
  "▫▫▫▪▪▪▫",
  "▫▫▫▫▪▪▪",
  "▫▫▫▫▫▪▪",
  "▪▪▪▪▪▪▪",
];

export interface Process {
  logger: Logger;
  text: string;
  options: ProcessOptions;
  colors: Colors;
  config: Config;
  animationN: number;
  tick: number;
  row: number;
  timer: number;
  firstPart: string;
  pushUp(): void;
}

export class Process {
  constructor(
    logger: Logger,
    text: string,
    promise: () => Promise<any>,
    processOptions: ProcessOptions
  ) {
    this.logger = logger;
    this.text = text;
    this.options = processOptions;
    this.config = this.logger.config;
    this.colors = this.logger.colors;
    this.row = -1;
    this.timer = Date.now();
    this.animationN = 0;
    this.tick = 0;
    this.firstPart = this.logger.firstPart({
      color: this.options.color || this.config.process.color,
      background: this.options.background || this.config.process.background,
      icon: this.options.icon || this.config.process.icon,
      prefix: this.options.prefix || this.config.process.prefix,
    });

    this.moveToBottom();
    this.logger.logOut(`${this.firstPart}${LoadingBar[0]} [0ms] ${this.text}`); // inital write

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
        `${this.firstPart}${
          LoadingBar[this.animationN]
        } [${this.coloredCounter()}${this.config.process.color}] ${this.text}` // every "frame"
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
          }] ${this.options.finishText || this.text} ${
            output
              ? "|" + typeof output === "string"
                ? output
                : typeof output
              : ""
          }`
        );
        this.moveToBottom();
      })
      .catch((reason: any) => {
        clearInterval(interval);
        this.moveToRow();
        this.logger._error(
          `${LoadingBar[7]} [${this.coloredCounter()}${
            this.config.error.color
          }] ${this.text} | ${reason}`
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
    readline.moveCursor(process.stdout, 0, this.logger.processes.length);
  }

  private moveToRow() {
    readline.moveCursor(process.stdout, 0, this.row);
  }

  public pushUp() {
    this.row = this.row - 1;
  }
}
