
export type BaseTypes = boolean | number | string | Array<BaseTypes> | unknown | undefined | null | any | void | never | object | Function

type MessageFunctions<T> = (() => T) | (() => Promise<T>)
export type Message = BaseTypes | MessageFunctions<BaseTypes>

type Types = "string" | "number" | "bigint" | "boolean" | "symbol" | "undefined" | "object" | "function"

type Handlers = {
  [key in Types]: Handler<BaseTypes>
}

type Handler<T> = (message: T) => string | Promise<string>

const stringHandler: Handler<string> = (message) => {
  return `String: ${message}`
}

const numberHandler: Handler<number> = (message) => {
  return `Number: ${message}`
}

const bigintHandler: Handler<bigint> = (message) => {
  return `Bigint: ${message}`
}

const booleanHandler: Handler<boolean> = (message) => {
  return `Boolean: ${message}`
}

const symbolHandler: Handler<symbol> = (message) => {
  return `Symbol: ${String(message)}`
}

const undefinedHandler: Handler<undefined> = (message) => {
  return 'Undefined'
}

const objectHandler: Handler<object> = (message) => {
  const stringified = JSON.stringify(message, null, 2)
  return `Object: ${stringified}`
}

const functionHandler: Handler<MessageFunctions<BaseTypes>> = (message) => {

  const isAsync = message.constructor.name === "AsyncFunction";

  if (isAsync) {

    return new Promise<string>(async (resolve) => {
      const result = await message();
      resolve(handleMessage(result))
    })

  } else {

    return handleMessage(message());

  }

}

const handlers: Handlers = {
  string: stringHandler,
  number: numberHandler,
  bigint: bigintHandler,
  boolean: booleanHandler,
  symbol: symbolHandler,
  undefined: undefinedHandler,
  object: objectHandler,
  function: functionHandler
}

export function handleMessage(message: () => Promise<BaseTypes>): Promise<string>
export function handleMessage(message: () => BaseTypes): string
export function handleMessage(message: BaseTypes): string
export function handleMessage(message: Message) {
  const type = typeof message

  return handlers[type](message)
}
