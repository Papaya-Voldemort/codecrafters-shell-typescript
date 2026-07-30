import { createInterface } from "readline";
import which from "which";
import { spawn } from "child_process";
import { parse } from "shell-quote";

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: "$ ",
});

const builtins = new Set(["echo", "exit", "type", "pwd", "cd"]);

rl.prompt();

rl.on("line", (fullCommand: string) => {
  const [command, ...args] = fullCommand.trim().split(/\s+/);
  const [target] = parse(args) as string[];

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
    if (target === undefined) {
      rl.prompt();
      return;
    }
    for (const target of args) {
      if (builtins.has(target)) {
        console.log(`${target} is a shell builtin`);
        continue;
      }

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

  if (command === "pwd") {
    console.log(process.cwd());
    rl.prompt();
    return;
  }

  if (command === "cd") {
    const directory =
      target === "~" || target === undefined ? process.env.HOME : target;

    if (!directory) {
      console.log("cd: HOME not set");
      rl.prompt();
      return;
    }

    try {
      process.chdir(directory);
    } catch {
      console.log(`cd: ${directory}: No such file or directory`);
    }

    rl.prompt();
    return;
  }

  const executablePath = which.sync(command, { nothrow: true });

  if (!executablePath) {
    console.log(`${command}: command not found`);
    rl.prompt();
    return;
  }

  const child = spawn(executablePath, args, {
    stdio: "inherit",
    argv0: command,
  });

  child.on("close", () => {
    rl.prompt();
  });
});
