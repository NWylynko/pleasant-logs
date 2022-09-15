import { RESET } from "./consts";

export const logOut = (log: string) => process.stdout.write(`${log}${RESET}\n`);
export type LogOut = typeof logOut

export const logErr = (log: string) => process.stderr.write(`${log}${RESET}\n`);
export type LogErr = typeof logErr
