import { createInterface } from "readline";

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: "$ ",
});

const running = true;

while (running) {
  rl.prompt();

  rl.on("line", (command: string) => {
    console.log(`${command}: command not found`);
  });
}
