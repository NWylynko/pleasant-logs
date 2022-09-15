import defaultConfig, {
  RESET,
  dim,
  tab,
  colors as defaultColors, Config,
  Colors,
  Options
} from "./consts";
import { logOut, logErr } from "./rawLog";
import { createProcess, ProcessOptions, Processor } from "./Process";
import { TimeSinceStart } from "./TimeSinceStart";
import merge from "lodash-es/merge"

export const createLogger = (
  id: string,
  config: Config = defaultConfig,
  colors: Colors = defaultColors
) => {

  const start = Date.now();
  const processes = new Map<string, Processor>()

  const info = (
    log: string,
    options: Options = config.info
  ) => {
    pushProcessesUp();
    logOut(
      `${firstPart(merge(config.info, options))}${log}`
    );
  };

  const success = (
    log: string,
    options: Options = config.success
  ) => {
    pushProcessesUp();
    _success(log, merge(config.success, options));
  };

  const warning = (
    log: string,
    options: Options = config.warning
  ) => {
    pushProcessesUp();
    logErr(
      `${firstPart(merge(config.warning, options))}${log}`
    );
  };

  const error = (
    log: string,
    options: Options = config.error
  ) => {
    pushProcessesUp();
    _error(log, merge(config.error, options));
  };

  const fail = (
    log: string,
    options: Options = config.fail
  ) => {
    pushProcessesUp();
    logErr(
      `${firstPart(merge(config.fail, options))}${log}`
    );
  };

  const critical = (
    log: string,
    options: Options = config.critical
  ) => {
    pushProcessesUp();
    logErr(
      `${firstPart(merge(config.critical, options))}${log}`
    );
  };

  // this can't be called process as their is the global process object
  const _process = (
    text: string,
    promise: () => Promise<any>,
    options: ProcessOptions = {
      ...config.process,
      finishText: "",
    }
  ) => {
    pushProcessesUp();
    const functions = {
      firstPart,
      config,
      processes,
      logOut,
      _success,
      _error,
      colors
    }
    const processor = createProcess(functions)(text, promise, merge(config.process, options));
    processes.set(processor.id, processor);
    return processor;
  };

  const _success = (
    log: string,
    options: Options = config.success
  ) => {
    logOut(
      `${firstPart(merge(config.success, options))}${log}`
    );
  };

  const _error = (
    log: string,
    options: Options = config.error
  ) => {
    logErr(
      `${firstPart(merge(config.error, options))}${log}`
    );
  };

  const firstPart = ({ color, prefix, background, icon }: Options): string => {
    const fullPrefix = `${color}${background || ""}${prefix}${RESET}`
    const y = `${colors.white}${dim}${prefix ? (prefix.length < 8 ? tab : "") : ""}| ${id} +${TimeSinceStart(start)}ms${tab}| ${RESET}${color}${background || ""}${icon} `;

    return fullPrefix + y
  };

  const pushProcessesUp = () => {
    for (let [id, process] of processes) {
      process.pushUp()
    }
  };

  const logger = {
    id,
    info,
    success,
    warning,
    error,
    fail,
    critical,
    process: _process,
  };

  return logger;
};
