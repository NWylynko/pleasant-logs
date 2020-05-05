const readline = require("readline");

const RESET = "\x1b[0m";
const Dim = "\x1b[2m";

// const Black = "\x1b[30m";
const Red = "\x1b[31m";
const Green = "\x1b[32m";
const Yellow = "\x1b[33m";
// const Blue = "\x1b[34m";
// const Magenta = "\x1b[35m";
const Cyan = "\x1b[36m";
const White = "\x1b[37m";

const tab = "\t";
const KnightRider = [
  "▪▪▫▫▫▫▫",
  "▪▪▪▫▫▫▫",
  "▫▪▪▪▫▫▫",
  "▫▫▪▪▪▫▫",
  "▫▫▫▪▪▪▫",
  "▫▫▫▫▪▪▪",
  "▫▫▫▫▫▪▪",
  "▪▪▪▪▪▪▪",
];

export default class Logger {
  id: string;
  start: number;
  watchers: any[];
  logOut: (x: string) => boolean;
  logErr: (x: string) => boolean;

  constructor(id: string) {
    this.id = id;
    this.start = Date.now();
    this.watchers = [];
    this.logOut = (x: string) => process.stdout.write(`${x}${RESET}\n`);
    this.logErr = (x: string) => process.stderr.write(`${x}${RESET}\n`);
  }

  public info(x: string, pushUp: boolean = true) {
    if (pushUp) this.pushWatchersUp();
    this.logOut(`${this.firstPart(White, "INFO")}ℹ ${x}`);
  }

  public success(x: string, pushUp: boolean = true) {
    if (pushUp) this.pushWatchersUp();
    this.logOut(`${this.firstPart(Green, "SUCCESS")}✔ ${x}`);
  }

  public warning(x: string, pushUp: boolean = true) {
    if (pushUp) this.pushWatchersUp();
    this.logErr(`${this.firstPart(Yellow, "WARNING")}! ${x}`);
  }

  public error(x: string, pushUp: boolean = true) {
    if (pushUp) this.pushWatchersUp();
    this.logErr(`${this.firstPart(Red, "ERROR")}☠ ${x}`);
  }

  public fail(x: string, pushUp: boolean = true) {
    if (pushUp) this.pushWatchersUp();
    this.logErr(`${this.firstPart(Red, "FAIL")}✘ ${x}`);
  }

  public watch(x: string, promise: () => Promise<any>) {
    this.pushWatchersUp();
    const watcher = new Watch(this, x, promise);
    this.watchers.push(watcher);
    return watcher;
  }

  private firstPart(
    color: string,
    str: string,
    start: number = this.start
  ): string {
    return `${color}${str}${White}${Dim}${tab} | ${
      this.id
    } +${this.TimeSinceStart(start)}ms${tab} | ${RESET}${color} `;
  }

  private TimeSinceStart = (start: number = this.start) => Date.now() - start;

  private pushWatchersUp() {
    for (let i = 0; i < this.watchers.length; i++) {
      this.watchers[i].pushUp();
    }
  }
}

class Watch {
  logger: any;
  animationN: number;
  tick: number;
  row: number;
  timer: number;
  constructor(logger: any, x: string, promise: () => Promise<any>) {
    this.logger = logger;
    this.row = -1;
    this.timer = Date.now();
    this.animationN = 0;
    this.tick = 0;

    this.moveToBottom();
    this.logger.logOut(
      `${this.logger.firstPart(Cyan, "WATCH")}⧗ ${KnightRider[0]} [0ms] ${x}`
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
        `${this.logger.firstPart(Cyan, "WATCH")}⧗ ${
          KnightRider[this.animationN]
        } [${this.logger.TimeSinceStart(this.timer)}ms] ${x}` // every "frame"
      );
      this.moveToBottom();
    }, 10);

    promise()
      .then((output) => {
        clearInterval(interval);
        this.moveToRow();
        this.logger.success(
          `${KnightRider[7]} [${this.logger.TimeSinceStart(
            this.timer
          )}ms] ${x} | ${typeof output === "string" ? output : typeof output}`,
          false
        );
        this.moveToBottom();
      })
      .catch((reason: any) => {
        clearInterval(interval);
        this.moveToRow();
        this.logger.error(
          `${KnightRider[7]} [${this.logger.TimeSinceStart(
            this.timer
          )}ms] ${x} | ${reason}`,
          false
        );
        this.moveToBottom();
      });
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
