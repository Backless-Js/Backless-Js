import fs from "fs-extra";
import path from "path";
import ora from "ora";
import execa from "execa";
import yargonaut from "yargonaut";
import boxen from "boxen";
import inquirer from "inquirer";
import figlet from "figlet";
import {
  workingDirectory,
  createFolder,
  copyDirectory,
} from "../helpers/directory";
import {
  routeSource,
  addRouting,
  addController,
  addModel,
  toPascalCase,
  generateDocumentation,
  generateTest,
} from "../functions";
const spinner = ora();
const chalk = yargonaut.chalk();

export default async (argv) => {
  try {
    const { database } = await inquirer.prompt({
      type: "input",
      name: "database",
      message: chalk.yellow("Please input your database name :"),
      default: "Backless-DB",
      validate: function (input) {
        var done = this.async();
        if (RegExp(/\s/g).test(input)) {
          done(chalk.red("Database name should not include space characters."));
          return;
        }
        done(null, true);
      },
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

    const { model } = await inquirer.prompt({
      type: "input",
      name: "model",
      message: chalk.yellow("Please input your model name :"),
      default: "Foobar",
      validate: function (input) {
        var done = this.async();
        if (RegExp(/\s/g).test(input)) {
          done(chalk.red("Model name should not include space characters."));
          return;
        }
        if (RegExp(/user/i).test(input)) {
          done(
            chalk.red(
              "User model has been generated by backless please input another one"
            )
          );
          return;
        }
        done(null, true);
      },
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
    let askAttributes = false;
    let attributes = [];

    while (!askAttributes) {
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
      const { attributeName } = await inquirer.prompt({
        type: "input",
        name: "attributeName",
        message: chalk.yellow("Please input your attribute name :"),
        default: "name",
        validate: function (input) {
          const done = this.async();
          if (RegExp(/\s/g).test(input)) {
            done(
              chalk.red("Attribute name should not include space characters.")
            );
            return;
          }
          let exist = attributes.find((key) => key.name === input);
          if (exist) {
            done(
              chalk.red(
                "Attribute name already exist please input another attribute"
              )
            );
            return;
          }
          done(null, true);
        },
      });

      const { attributeType } = await inquirer.prompt({
        type: "list",
        name: "attributeType",
        message: chalk.yellow("Please input your attribute type :"),
        choices: ["String", "Number", "Boolean", "Array"],
      });
      attributes.push({
        name: attributeName,
        type: attributeType.toLowerCase(),
      });

      const { isMore } = await inquirer.prompt({
        type: "confirm",
        name: "isMore",
        message: "Do you want to input another attributes?",
        default: true,
      });
      if (!isMore) askAttributes = true;
    }

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
    const { port } = await inquirer.prompt({
      type: "input",
      name: "port",
      message: chalk.yellow("Please input PORT number :"),
      default: 3000,
      validate: function (input) {
        var done = this.async();
        if (isNaN(input)) {
          input = 0;
          done(chalk.red("Please input a correct PORT number."));
          return;
        }
        done(null, true);
      },
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
    const { secret } = await inquirer.prompt({
      type: "input",
      name: "secret",
      message: chalk.yellow("Please input secret password for jsonwebtoken :"),
      default: "Backless_Secret",
      validate: function (input) {
        var done = this.async();
        if (RegExp(/\s/g).test(input)) {
          done(chalk.red("JWT secret should not include space characters."));
          return;
        }
        done(null, true);
      },
    });

    /* CREATING SERVER FOLDER */
    spinner.text = "Please wait server are being generated.";
    spinner.start();
    createFolder("./server");
    copyDirectory("../../server", "./server");
    copyDirectory("../templates/README.md", "./server/README.md");
    /* COPYING TEMPLATE TO SERVER FROM TEMPLATES */
    routeSource("./server/routes/index.js", model);
    addRouting(
      "../templates/template-route.js",
      `./server/routes/${model.toLowerCase()}.js`,
      model
    );
    addController(
      "../templates/template-controller.js",
      `./server/controllers/${model.toLowerCase()}.js`,
      model.toLowerCase(),
      attributes
    );
    addModel(
      "../templates/template-schema.js",
      `./server/models/${toPascalCase(model)}.js`,
      model.toLowerCase(),
      attributes
    );
    generateTest(
      "../templates/template.test.js",
      `./server/test/${model.toLowerCase()}.test.js`,
      model.toLowerCase(),
      attributes
    );
    generateDocumentation(
      "../templates/template-readme.md",
      "./server/README.md",
      model.toLowerCase(),
      attributes
    );
    spinner.text = chalk.green("Server generated.");
    spinner.succeed();

    /* CHANGING DATABASE NAME IN TEMPLATE */
    let config = fs.readFileSync(
      workingDirectory("./server/config/mongoose.js"),
      "utf8"
    );
    config = config.replace(
      /\/\*databaseName\*\//g,
      `mongodb://localhost:27017/${database}`
    );
    fs.writeFileSync(workingDirectory("./server/config/mongoose.js"), config);

    /* INSERTING .ENV CONFIG */
    let env = `PORT=${port}\nSECRET=${secret}`;
    fs.writeFileSync(workingDirectory("./server/.env"), env);

    /* INSTALLING PACKAGE DEPEDENCY */
    spinner.text = "Installing package depedency";
    spinner.color = "yellow";
    spinner.start();
    let JSONPath = path.join(process.cwd(), "./server");
    JSONPath = JSONPath.replace(/\s/g, `\\ `);
    await execa.command(`npm --prefix ${JSONPath} install ${JSONPath}`);
    spinner.text = chalk.green("Depedency successfully installed.");
    spinner.succeed();

    /* COMPLETED */
    let str = `${chalk.blue(
      `🎉 Congrats your server has been generated ! 🍻`
    )}\n\n${chalk.yellow(
      "Please run this command first to test everything generated successfully :"
    )}\n- backless prove\n\n${chalk.yellow(
      "To start your server run this command :"
    )}\n- backless serve\n\n${chalk.yellow(
      "To generate another model run this command :"
    )}\n- cd to your backless server\n- backless add --name <model_name> --attributes <key>:<data_type>,<key>:<data_types>`;

    console.clear();
    console.log(
      boxen(str, { padding: 1, borderColor: "red", borderStyle: "round" })
    );
  } catch (error) {
    if (error.message) {
      spinner.text = chalk.red(error.message);
      spinner.fail();
      return error;
    }
  }
};
