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
  function logFunction(message: () => BaseTypes, options?: Option): void;
  function logFunction(message: BaseTypes, options?: Option): void;
  async function logFunction(message: Message, options: Option = option) {
    pushProcessesUp();
    const log = await handleMessage(message);
    rawLog(
      `${leftSideText(merge(option, options))}${log}`
    );
  };

  return logFunction;
};
