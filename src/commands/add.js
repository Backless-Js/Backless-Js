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
  generateTest,
} from "../functions";
const chalk = yargonaut.chalk();
let spinner = ora();

export default async function add(argv) {
  try {
    if (!RegExp(/^[a-z0-9]+$/i).test(argv.model) || argv._.length > 1) {
      throw new Error(
        "Model name should not contains space and symbol character."
      );
    } else if (argv.model.toLowerCase() === "user") {
      throw new Error("Model user already exists.");
    } else if (
      !fs.existsSync(path.join(process.cwd(), "./server")) &&
      !fs.existsSync(path.join(process.cwd(), "./models")) &&
      !fs.existsSync(path.join(process.cwd(), "../models"))
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
    let indexPath;
    let mvcPath;
    if (fs.existsSync(path.join(process.cwd(), "./server"))) {
      indexPath = "./server/routes/index.js";
      mvcPath = "./server";
    } else if (fs.existsSync(path.join(process.cwd(), "./models"))) {
      indexPath = "./routes/index.js";
      mvcPath = ".";
    } else if (fs.existsSync(path.join(process.cwd(), "../models"))) {
      indexPath = "../routes/index.js";
      mvcPath = "..";
    }
    spinner.text = chalk.yellow("Please wait model are being generated.");
    spinner.start();
    addRouting(
      "../templates/template-route.js",
      `${mvcPath}/routes/${argv.model.toLowerCase()}.js`,
      argv.model
    );
    routeSource(indexPath, argv.model);
    addController(
      "../templates/template-controller.js",
      `${mvcPath}/controllers/${argv.model.toLowerCase()}.js`,
      argv.model.toLowerCase(),
      attributes
    );
    addModel(
      "../templates/template-schema.js",
      `${mvcPath}/models/${toPascalCase(argv.model)}.js`,
      argv.model.toLowerCase(),
      attributes
    );
    generateTest(
      "../templates/template.test.js",
      `${mvcPath}/test/${argv.model.toLowerCase()}.test.js`,
      argv.model.toLowerCase(),
      attributes
    );
    generateDocumentation(
      "../templates/template-readme.md",
      `${mvcPath}/README.md`,
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
      spinner.text = chalk.yellow(error.message);
      spinner.fail();
      return error;
    }
  }
}
