# pleasant-logs

Colourful, beautiful, and helpful logging

## Features
 - Multiple different log types
 - Handles every type
 - Handles promises (async/await)
 - Fully customisable

```bash
npm i pleasant-logs
yarn add pleasant-logs
pnpm add pleasant-logs
bun add pleasant-logs
```

```javascript
import { createLogger } from "pleasant-logs";

const log = createLogger("test-logger");

log.info("hello world");
```

![demo](demo.gif)
Here's an example of every log type, with each logging a string.

A port of <https://github.com/kkristof200/colored_logs>
