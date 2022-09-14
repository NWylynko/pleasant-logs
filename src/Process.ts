import readline from "node:readline";
import { Logger, ProcessOptions } from "./index";
import { Config, Colors } from "./consts.js";

const LoadingBar: string[] = [
  "▪▫▫▫▫▫▫",
  "▪▪▫▫▫▫▫",
  "▪▪▪▫▫▫▫",
  "▫▪▪▪▫▫▫",
  "▫▫▪▪▪▫▫",
  "▫▫▫▪▪▪▫",
  "▫▫▫▫▪▪▪",
  "▫▫▫▫▫▪▪",
  "▫▫▫▫▫▫▪",
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
    this.row = 0;
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
    this.row--;

    const interval = setInterval(() => {
      this.tick++;
      if (this.tick > 10) {
        this.animationN++;
        this.tick = 0;
      }
      if (this.animationN >= 8) {
        this.animationN = 0;
      }
      this.moveToRow();
      this.logger.logOut(
        `${this.firstPart}${LoadingBar[this.animationN]
        } [${this.coloredCounter()}${this.config.process.color}] ${this.text}` // every "frame"
      );
      this.moveToBottom();
    }, 10);

    promise()
      .then((output) => {
        clearInterval(interval);
        this.moveToRow();
        this.logger._success(
          `${LoadingBar[9]} [${this.coloredCounter()}${this.config.success.color
          }] ${this.options.finishText || this.text} ${this.stringOrOther(
            output
          )}`
        );
        this.moveToBottom();
      })
      .catch((reason: Error) => {
        clearInterval(interval);
        this.moveToRow();
        this.clearLine();
        this.logger._error(
          `${LoadingBar[9]} [${this.coloredCounter()}${this.config.error.color
          }] ${this.text} ${reason ? this.stringOrOther(reason.message) : ""}`
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
    // readline.moveCursor(process.stderr, 0, this.logger.processes.length + 1);
  }

  private moveToRow() {
    readline.moveCursor(process.stdout, 0, this.row);
    // readline.moveCursor(process.stderr, 0, this.row);
  }

  private clearLine() {
    try {
      process.stdout.clearLine(0);
      // process.stderr.clearLine(0);
    } catch (error) { }
  }

  private stringOrOther(str: string) {
    return `${str ? (typeof str === "string" ? "| " + str : typeof str) : ""}`;
  }

  public pushUp() {
    this.row--;
  }
}
