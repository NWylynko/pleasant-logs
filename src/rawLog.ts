import { RESET } from "./consts";

export const logOut = (log: string) => process.stdout.write(`${log}${RESET}\n`);
export const logErr = (log: string) => process.stderr.write(`${log}${RESET}\n`);
