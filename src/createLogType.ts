import { Option } from "./consts";
import { LogOut, LogErr } from "./rawLog";
import merge from "lodash-es/merge";
import { handleMessage, Message, BaseTypes } from "./handleMessage";
import { LeftSideText } from "./generateLeftSide";

interface Dependencies {
  pushProcessesUp: () => void;
  leftSideText: LeftSideText;
  option: Option;
  rawLog: LogOut | LogErr;
}

export const createLogType = ({ pushProcessesUp, leftSideText, option, rawLog }: Dependencies) => {

  async function logFunction(message: () => Promise<BaseTypes>, options?: Option): Promise<void>;
  async function logFunction(message: Promise<BaseTypes>, options?: Option): Promise<void>;
  function logFunction(message: () => BaseTypes, options?: Option): void;
  function logFunction(message: BaseTypes, options?: Option): void;
  async function logFunction(message: Message, options: Option = option) {
    pushProcessesUp();

    let log

    // Check the message to see if its an async function or a promise
    const isAsync = message?.constructor?.name === "AsyncFunction"
    const isPromise = message?.constructor?.name === "Promise"

    if (isAsync || isPromise) {

      // if its async or a promise, we need to wait for it to resolve
      log = await handleMessage(message)

    } else {

      // if not we can just run it normally
      log = handleMessage(message);

    }

    rawLog(
      `${leftSideText(merge(option, options))}${log}`
    );
  };

  return logFunction;
};
