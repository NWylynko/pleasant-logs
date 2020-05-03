const RESET = "\x1b[0m";
const Dim = "\x1b[2m";

const Black = "\x1b[30m";
const Red = "\x1b[31m";
const Green = "\x1b[32m";
const Yellow = "\x1b[33m";
const Blue = "\x1b[34m";
const Magenta = "\x1b[35m";
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

class Logger {
  id: string;
  start: number;

  constructor(id: string) {
    this.id = id;
    this.start = Date.now();
  }

  info(x: string, noNewLine: boolean = false) {
    this.log(this.firstPart(White, "INFO") + "ℹ " + x, noNewLine);
  }

  success(x: string, noNewLine: boolean = false) {
    this.log(this.firstPart(Green, "SUCCESS") + "✔ " + x, noNewLine);
  }

  warning(x: string, noNewLine: boolean = false) {
    this.log(this.firstPart(Yellow, "WARNING") + "! " + x, noNewLine);
  }

  error(x: string, noNewLine: boolean = false) {
    this.log(this.firstPart(Red, "ERROR") + "☠ " + x, noNewLine);
  }

  fail(x: string, noNewLine: boolean = false) {
    this.log(this.firstPart(Red, "FAIL") + "✘ " + x, noNewLine);
  }

  watch(x: string, promise: Promise<any>) {
    this.log(
      this.firstPart(Cyan, "WATCH") + "⧗ " + KnightRider[0] + " " + x,
      true
    );
    let animationN = 0;
    const interval = setInterval(() => {
      if (animationN >= 6) {
        animationN = -1;
      }
      animationN++;
      process.stdout.cursorTo(0);
      this.log(
        this.firstPart(Cyan, "WATCH") +
          "⧗ " +
          KnightRider[animationN] +
          " " +
          x,
        true
      );
    }, 250);

    promise
      .then(() => {
        clearInterval(interval);
        process.stdout.cursorTo(0);
        this.success(KnightRider[7] + " " + x);
      })
      .catch((reason) => {
        clearInterval(interval);
        process.stdout.cursorTo(0);
        this.error(KnightRider[7] + " " + x + " | " + reason);
      });
  }

  firstPart(color: string, str: string): string {
    const TimeSinceStart = Date.now() - this.start;
    return (
      color +
      str +
      White +
      Dim +
      tab +
      " | " +
      this.id +
      " +" +
      TimeSinceStart +
      tab +
      " | " +
      RESET +
      color
    );
  }

  log(x: string, noNewLine: boolean = false) {
    let log = x + RESET;
    if (!noNewLine) {
      log += "\n";
    }
    process.stdout.write(log);
  }
}

// const rejectPromise = new Promise((resolve, reject) =>
//   setTimeout(() => {
//     reject(new Error("reason"));
//   }, 2000)
// );

const resolvePromise = new Promise((resolve, reject) =>
  setTimeout(() => {
    resolve();
  }, 5000)
);

const log = new Logger("test-logger");

log.info("this is an info log");
log.success("this is a success log");
log.warning("this is a warning log");
log.error("this is a error log");
log.fail("this is a fail log");
log.watch("this is a promise (will resolve)", resolvePromise);
