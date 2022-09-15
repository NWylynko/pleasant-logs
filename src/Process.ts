import shortid from 'shortid';
import readline from "node:readline";
import { Colors, Config, Options } from "./consts";
import { logOut } from "./rawLog";
import { TimeSinceStart } from "./TimeSinceStart";

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

export interface ProcessOptions extends Options {
  finishText: string;
}

interface Functions {
  firstPart: ({ color, prefix, background, icon }: Options) => string;
  config: Config;
  processes: Map<string, Processor>;
  _success: (log: string, options?: Options) => void;
  _error: (log: string, options?: Options) => void;
  colors: Colors;
}

export const createProcess = (logger: Functions) => (

  text: string,
  promise: () => Promise<any>,
  options: ProcessOptions
) => {
  let row = 0;
  const timer = Date.now()
  let animationN = 0;
  let tick = 0;
  const id = shortid.generate()

  const firstPart = logger.firstPart({
    ...logger.config.process,
    ...options
  })

  const moveToBottom = () => {
    readline.moveCursor(process.stdout, 0, logger.processes.keys.length);
    // readline.moveCursor(process.stderr, 0, logger.processes.length + 1);
  }


  const moveToRow = () => {
    readline.moveCursor(process.stdout, 0, row);
    // readline.moveCursor(process.stderr, 0, row);
  }

  const clearLine = () => {
    try {
      process.stdout.clearLine(0);
      // process.stderr.clearLine(0);
    } catch (error) { }
  }

  const stringOrOther = (str: string) => {
    return `${str ? (typeof str === "string" ? "| " + str : typeof str) : ""}`;
  }

  const pushUp = () => {
    row--;
  }

  moveToBottom();

  logOut(`${firstPart}${LoadingBar[0]} [0ms] ${text}`); // initial write
  pushUp();

  const interval = setInterval(() => {
    tick++;
    if (tick > 10) {
      animationN++;
      tick = 0;
    }
    if (animationN >= 8) {
      animationN = 0;
    }
    moveToRow();
    logOut(
      `${firstPart}${LoadingBar[animationN]
      } [${colouredCounter()}${logger.config.process.color}] ${text}` // every "frame"
    );
    moveToBottom();
  }, 10);

  promise()
    .then((output) => {
      clearInterval(interval);
      moveToRow();
      logger._success(
        `${LoadingBar[9]} [${colouredCounter()}${logger.config.success.color
        }] ${options.finishText || text} ${stringOrOther(
          output
        )}`
      );
      moveToBottom();
    })
    .catch((reason: Error) => {
      clearInterval(interval);
      moveToRow();
      clearLine();
      logger._error(
        `${LoadingBar[9]} [${colouredCounter()}${logger.config.error.color
        }] ${text} ${reason ? stringOrOther(reason.message) : ""}`
      );
      moveToBottom();
    });

  const colouredCounter = () => {
    const time = TimeSinceStart(timer);
    if (time < 10) {
      return `${logger.colors.green}${time}ms`;
    } else if (time < 50) {
      return `${logger.colors.yellow}${time}ms`;
    } else {
      return `${logger.colors.red}${time}ms`;
    }
  }

  const processor = {
    id,
    pushUp
  }

  return processor
}

export type Processor = ReturnType<ReturnType<typeof createProcess>>;