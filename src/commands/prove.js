import execa from "execa";
import yargonaut from "yargonaut";
import figlet from "figlet";
import ora from "ora";
import fs from "fs-extra";
import path from "path";
const chalk = yargonaut.chalk();
let spinner = ora();

export default async function prove() {
  try {
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
    spinner.start();
    if (
      !fs.existsSync(path.join(process.cwd(), "./server")) &&
      !fs.existsSync(path.join(process.cwd(), "./models"))
    ) {
      throw new Error(
        "Please change directory to your working directory or server directory."
      );
    } else {
      let mvcPath;
      if (fs.existsSync(path.join(process.cwd(), "./server"))) {
        mvcPath = "./server";
      } else if (fs.existsSync(path.join(process.cwd(), "./models"))) {
        mvcPath = "./";
      }
      let JSONPath = path.join(process.cwd(), mvcPath);
      JSONPath = JSONPath.replace(/\s/g, `\\ `);
      spinner.text = chalk.green(
        "Wait a moment while we make sure our server was generated correctly"
      );
      await execa.command(`npm run test --prefix ${JSONPath}`);
      spinner.text = chalk.green(
        "All features are good to go, you can start server now 🍻"
      );
      spinner.succeed();
    }
  } catch (error) {
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
    spinner.text = chalk.red("Failed to starting your server.");
    spinner.fail();
    spinner.text = chalk.yellow(error.message);
    spinner.fail();
  }
}
