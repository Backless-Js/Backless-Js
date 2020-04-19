import yargonaut from "yargonaut";
import yargs from "yargs";
import create from "./commands/create";
import add from "./commands/add";
import serve from "./commands/serve";
import prove from "./commands/prove";
import figlet from "figlet";
const chalk = yargonaut.chalk();

console.log(
  chalk.yellow(
    figlet.textSync("Backless", {
      font: "DOS Rebel",
      horizontalLayout: "fitted",
      verticalLayout: "fitted",
    })
  )
);
if (process.argv.slice(2).length < 1) {
  yargs
    .command({
      command: "create",
      describe: "Creating Backless Server",
      type: String,
      handler: (argv) => create(argv),
    })
    .command({
      command: "add",
      describe: "Generate New Model to Backless Server",
      builder: {
        model: {
          type: "string",
          demandOption: true,
          alias: "m",
        },
        attributes: {
          type: "string",
          demandOption: true,
          alias: "a",
        },
      },
      handler: (argv) => add(argv),
    })
    .command({
      command: "serve",
      describe: "Start Backless Server",
      type: String,
      handler: () => serve(),
    })
    .command({
      command: "prove",
      describe: "Test All Backless Server Feature",
      type: String,
      handler: () => prove(),
    })
    .option("model", {
      alias: "m",
      describe: "Model name",
      demand: true,
    })
    .option("attributes", {
      alias: "a",
      describe: "Model attributes",
      demand: true,
    })
    .showHelp()
    .epilog("Server never been easier with Backless")
    .wrap(null).argv;
}

yargs
  .command({
    command: "create",
    describe: "Creating Backless Server",
    type: String,
    handler: (argv) => create(argv),
  })
  .command({
    command: "add",
    describe: "Generate New Model to Backless Server",
    builder: {
      model: {
        type: "string",
        demandOption: true,
        alias: "m",
      },
      attributes: {
        type: "string",
        demandOption: true,
        alias: "a",
      },
    },
    handler: (argv) => add(argv),
  })
  .command({
    command: "serve",
    describe: "Start Backless Server",
    type: String,
    handler: () => serve(),
  })
  .command({
    command: "prove",
    describe: "Test All Backless Server Feature",
    type: String,
    handler: () => prove(),
  })
  .showHelpOnFail(true)
  .epilog("Server never been easier with Backless")
  .wrap(null).argv;
