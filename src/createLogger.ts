import defaultConfig, {
  RESET,
  dim,
  tab,
  colors as defaultColors, Config,
  Colors,
  Options
} from "./consts";
import { Process, ProcessOptions } from "./Process";
import { TimeSinceStart } from "./TimeSinceStart";


export const createLogger = (
  id: string,
  config: Config = defaultConfig,
  colors: Colors = defaultColors
) => {

  const start = Date.now();
  const processes: Process[] = [];

  const logOut = (log: string) => process.stdout.write(`${log}${RESET}\n`);
  const logErr = (log: string) => process.stderr.write(`${log}${RESET}\n`);

  const info = (
    log: string,
    options: Options = config.info
  ) => {
    pushProcessesUp();
    logOut(
      `${firstPart(options)}${log}`
    );
  };

  const success = (
    log: string,
    options: Options = config.success
  ) => {
    pushProcessesUp();
    _success(log, options);
  };

  const warning = (
    log: string,
    options: Options = config.warning
  ) => {
    pushProcessesUp();
    logErr(
      `${firstPart(options)}${log}`
    );
  };

  const error = (
    log: string,
    options: Options = config.error
  ) => {
    pushProcessesUp();
    _error(log, options);
  };

  const fail = (
    log: string,
    options: Options = config.fail
  ) => {
    pushProcessesUp();
    logErr(
      `${firstPart(options)}${log}`
    );
  };

  const critical = (
    log: string,
    options: Options = config.critical
  ) => {
    pushProcessesUp();
    logErr(
      `${firstPart(options)}${log}`
    );
  };

  const _process = (
    text: string,
    promise: () => Promise<any>,
    options: ProcessOptions = {
      ...config.process,
      finishText: "",
    }
  ) => {
    pushProcessesUp();
    const processer = new Process(logger, text, promise, options);
    processes.push(processer);
    return processer;
  };

  const _success = (
    log: string,
    options: Options = config.success
  ) => {
    logOut(
      `${firstPart(options)}${log}`
    );
  };

  const _error = (
    log: string,
    options: Options = config.error
  ) => {
    logErr(
      `${firstPart(options)}${log}`
    );
  };

  const firstPart = ({ color, prefix, background, icon }: Options): string => {
    return `${color}${background || ""}${prefix}${RESET}${colors.white}${dim}${prefix ? (prefix.length < 8 ? tab : "") : ""}| ${id} +${TimeSinceStart(start)}ms${tab}| ${RESET}${color}${background || ""}${icon} `;
  };

  const pushProcessesUp = () => {
    for (let i = 0; i < processes.length; i++) {
      processes[i].pushUp();
    }
  };

  const logger = {
    id,
    config,
    colors,
    start,
    processes,
    logOut,
    logErr,
    info,
    success,
    warning,
    error,
    fail,
    critical,
    process: _process,
    firstPart,
    _success,
    _error
  };

  return logger;
};
