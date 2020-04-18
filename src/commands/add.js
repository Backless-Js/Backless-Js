import fs from "fs-extra";
import path from "path";
import ora from "ora";
import yargonaut from "yargonaut";
import figlet from "figlet";
import {
  routeSource,
  addRouting,
  addController,
  addModel,
  toPascalCase,
  generateDocumentation,
} from "../functions";
const chalk = yargonaut.chalk();
let spinner = ora();

export default async function add(argv) {
  try {
    if (!RegExp(/^[a-z0-9]+$/i).test(argv.model)) {
      throw new Error(
        "Model name should not contains space and symbol character."
      );
    } else if (argv.model.toLowerCase() === "user") {
      throw new Error("Model user already exists.");
    } else if (
      !fs.existsSync(path.join(process.cwd(), "./server")) &&
      !fs.existsSync(path.join(process.cwd(), "./models"))
    ) {
      throw new Error(
        "Please change directory to your working directory or server directory."
      );
    }
    const rawAttributes = argv.attributes.split(",");
    let attributes = rawAttributes.map((key) => {
      let [name, type] = key.split(":");
      if (name === "" || !RegExp(/^[a-z0-9]+$/i).test(name)) {
        throw new Error(
          "Attributes key should not be empty, contains spaces and symbol character."
        );
      }
      if (
        type.toLowerCase() !== "string" &&
        type.toLowerCase() !== "number" &&
        type.toLowerCase() !== "date" &&
        type.toLowerCase() !== "boolean" &&
        type.toLowerCase() !== "objectid" &&
        type.toLowerCase() !== "array"
      ) {
        throw new Error("Invalid attributes type.");
      }
      return { name, type };
    });
    console.clear();
    console.log(
      chalk.yellow(
        figlet.textSync("Backless", {
          font: "DOS Rebel",
          horizontalLayout: "fitted",
          verticalLayout: "fitted",
        })
      )
    );
    spinner.text = chalk.yellow("Please wait model are being generated.");
    spinner.start();
    routeSource("./server/routes/index.js", argv.model);
    addRouting(
      "../templates/template-route.js",
      `./server/routes/${argv.model.toLowerCase()}.js`,
      argv.model
    );
    addController(
      "../templates/template-controller.js",
      `./server/controllers/${argv.model.toLowerCase()}.js`,
      argv.model.toLowerCase(),
      attributes
    );
    addModel(
      "../templates/template-schema.js",
      `./server/models/${toPascalCase(argv.model)}.js`,
      argv.model.toLowerCase(),
      attributes
    );
    generateDocumentation(
      "../templates/template-readme.md",
      "./server/README.md",
      argv.model.toLowerCase(),
      attributes
    );
    console.clear();
    console.log(
      chalk.yellow(
        figlet.textSync("Backless", {
          font: "DOS Rebel",
          horizontalLayout: "fitted",
          verticalLayout: "fitted",
        })
      )
    );
    spinner.text = chalk.green("Model has been generated.");
    spinner.succeed();
  } catch (error) {
    if (
      error.message === "Invalid attributes type." ||
      error.message ===
        "Attributes key should not be empty, contains spaces and symbol character." ||
      error.message ===
        "Model name should not contains space and symbol character." ||
      error.message ===
        "Please change directory to your working directory or server directory."
    ) {
      let str =
        chalk.blue(`- How to generate new model:\n`) +
        chalk.yellow(
          `\n  backless add --model [Model] --attributes [key]:[dataType],[Key]:[dataType]\n`
        ) +
        chalk.blue(`\n- List of all available dataTypes :`) +
        chalk.yellow(
          `\n  - string\n  - number\n  - date\n  - boolean\n  - objectId\n  - array\n`
        );
      console.clear();
      console.log(
        chalk.yellow(
          figlet.textSync("Backless", {
            font: "DOS Rebel",
            horizontalLayout: "fitted",
            verticalLayout: "fitted",
          })
        )
      );
      console.log(str);
      spinner.text = chalk.red("Failed to generate new model.");
      spinner.fail();
      spinner.text = chalk.yellow(error.message);
      spinner.fail();
    } else {
      spinner.text = chalk.red("Failed to generate new model.");
      spinner.fail();
      return error;
    }
  }
}
