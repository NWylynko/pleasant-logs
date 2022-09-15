import defaultConfig, {
  colors as defaultColors, Config,
  Colors,
  Option
} from "./consts";
import { logOut, logErr } from "./rawLog";
import { createProcess, ProcessOptions, Processor } from "./Process";
import merge from "lodash-es/merge"
import { generateLeftSide } from "./generateLeftSide";
import { createLogType } from "./createLogType";

export const createLogger = (
  id: string,
  config: Config = defaultConfig,
  colors: Colors = defaultColors
) => {

  const start = Date.now();
  const processes = new Map<string, Processor>()

  const leftSideText = generateLeftSide(id, start, colors);

  const pushProcessesUp = () => {
    for (let [id, process] of processes) {
      process.pushUp()
    }
  };

  const functions = { pushProcessesUp, leftSideText }

  const info = createLogType({ ...functions, option: config.info, rawLog: logOut })
  const success = createLogType({ ...functions, option: config.success, rawLog: logOut })
  const warning = createLogType({ ...functions, option: config.warning, rawLog: logErr })
  const error = createLogType({ ...functions, option: config.error, rawLog: logErr })
  const fail = createLogType({ ...functions, option: config.fail, rawLog: logErr })
  const critical = createLogType({ ...functions, option: config.critical, rawLog: logErr })

  // this can't be called process as their is the global process object
  const _process = <PromiseResult,>(
    text: string,
    promise: Promise<PromiseResult>,
    options: ProcessOptions = {
      ...config.process,
      finishText: "",
    }
  ): Promise<PromiseResult> => {
    pushProcessesUp();
    const functions = {
      firstPart: leftSideText,
      config,
      processes,
      logOut,
      _success,
      _error,
      colors
    }
    const processor = createProcess(functions)(text, promise, merge(config.process, options));
    processes.set(processor.id, processor);
    return processor.promise;
  };

  // these don't push the processes up a line
  // this is used by the process as they need to overwrite the line to animate it
  const _success = (
    log: string,
    options: Option = config.success
  ) => {
    logOut(
      `${leftSideText(merge(config.success, options))}${log}`
    );
  };

  const _error = (
    log: string,
    options: Option = config.error
  ) => {
    logErr(
      `${leftSideText(merge(config.error, options))}${log}`
    );
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
