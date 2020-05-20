import Logger from "./dist/index.js";

const log = new Logger("test-logger");

const resolvePromise = () => 
  new Promise(resolve => {
    setTimeout(() => resolve("yo"), 3500);
  });

log.info("This is an info log");
log.success("This is a success log");
log.warning("This is a warning log");
log.error("This is a error log");
log.fail("This is a fail log");
log.critical("This is a critical log")
log.process("This will take a while", resolvePromise, { finishText: "Successfully finished task" });