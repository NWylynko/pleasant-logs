import Logger from "./dist/index.js";
const log = new Logger("test-logger");

const rejectPromise2 = () => {
  return new Promise((resolve, reject) =>
    setTimeout(() => {
      reject(new Error("reason 1"));
    }, 2000)
  );
};

const resolvePromise = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve("pizza");
    }, 4000);
  });
};

const resolvePromise1 = () =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve("nice 2");
    }, 1000);
  })
    .then((x) => x)
    .catch(() => {});

const rejectPromise5 = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(new Error("reason 2"));
    }, 5000);
  });
};

log.info("this is an info log");
log.success("this is a success log");
log.warning("this is a warning log");
log.error("this is a error log");
log.fail("this is a fail log");
log.watch("this is a promise (will resolve) 1", resolvePromise);
log.watch("this is a promise (will reject 2000ms)", rejectPromise2);
log.info("logged during watchers", log.watchers.length);
// log.info("logged during watchers 2 " + log.watchers.length);
log.watch("this is a promise (will reject 5000ms)", rejectPromise5);
log.watch(
  "this is a promise (will resolve)",
  () => new Promise((resolve, reject) => resolve("quick"))
);
log.watch(
  "this is a promise (will resolve 20ms)",
  () =>
    new Promise((resolve, reject) =>
      setTimeout(() => resolve("little slower"), 20)
    )
);
setTimeout(
  () => log.watch("this is a promise (will resolve) 2", resolvePromise1),
  1000
);
// log.info("logged during watchers");
// log.fail("this is a fail log 2");
// .then((x) => log.info(x))
