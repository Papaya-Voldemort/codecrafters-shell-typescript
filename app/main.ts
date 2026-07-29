import { createInterface } from "readline";

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: "$ ",
});

rl.prompt();

rl.on("line", (fullCommand: string) => {
  const [command, ...args] = fullCommand.trim().split(/\s+/);
  

  if (command === "exit") {
    rl.close();
    return;
  }

  if (command === "echo") {
    console.log(args.join(" "));
    rl.prompt();
    return;
  }
  
  console.log(`${command}: command not found`);
  rl.prompt();
});
