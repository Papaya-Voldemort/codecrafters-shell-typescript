import { createInterface } from "readline";
import which from "which";

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: "$ ",
});

const builtins = new Set(["echo", "exit", "type"]);

rl.prompt();

rl.on("line", (fullCommand: string) => {
  const [command, ...args] = fullCommand.trim().split(/\s+/);
  const [target] = args;

  if (command === "exit") {
    rl.close();
    return;
  }

  if (command === "echo") {
    console.log(args.join(" "));
    rl.prompt();
    return;
  }

  if (command === "type") {
    // TODO: Handle undifined target
    // TODO: Handle multiple args
    if (builtins.has(target)) {
      console.log(`${target} is a shell builtin`);
    } else {
      const result = which.sync(target, { nothrow: true });
      if (result) {
        console.log(`${target} is ${result}`);
      } else {
        console.log(`${target}: not found`);
      }
    }
    rl.prompt();
    return;
  }

  console.log(`${command}: command not found`);
  rl.prompt();
});
