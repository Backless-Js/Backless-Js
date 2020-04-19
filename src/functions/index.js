import fs from "fs-extra";
import path from "path";

function toPascalCase(input) {
  input = input.replace(/(\w)(\w*)/g, function (g0, g1, g2) {
    return g1.toUpperCase() + g2.toLowerCase();
  });
  return input;
}

function routeSource(relativePath, model) {
  const indexPath = path.join(process.cwd(), relativePath);
  let indexRoute = fs.readFileSync(indexPath, "utf8");

  indexRoute = indexRoute.replace(
    /\/\/backless-route-source/g,
    `import ${model.toLowerCase()}Routes from "./${model.toLowerCase()}"\n//backless-route-source`
  );

  indexRoute = indexRoute.replace(
    /\/\/backless-add-route/g,
    `routes.use("/${model.toLowerCase()}", ${model.toLowerCase()}Routes)\n//backless-add-route`
  );

  fs.writeFileSync(indexPath, indexRoute);
}

function addRouting(relTemplatePath, relativeDest, modelname) {
  const filePath = path.join(process.cwd(), relativeDest);
  let message;
  if (fs.existsSync(filePath)) {
    message = "File already exists, remove or rename file first";
    console.log(message);
  } else {
    const templatePath = path.join(__dirname, relTemplatePath);
    let file = fs.readFileSync(templatePath, "utf8");
    file = file.replace(/template/, modelname.toLowerCase());

    fs.writeFileSync(filePath, file);
    message = "File has been created.";
  }
  return { message };
}

function addController(
  relTemplatePath,
  relativeDest,
  modelname,
  modelStructureInput
) {
  const filePath = path.join(process.cwd(), relativeDest);
  let message;

  if (fs.existsSync(filePath)) {
    message = "File already exists, remove or rename file first";
    console.log(message);
  } else {
    const templatePath = path.join(__dirname, relTemplatePath);
    let file = fs.readFileSync(templatePath, "utf8");

    modelStructureInput.forEach((el) => {
      if (el.type === "string") {
        file = file.replace(
          /\/\/backless-add-query/,
          `{ ${el.name}: { $regex: search, $options: "i" } },\n            //backless-add-query`
        );
      } else {
        file = file.replace(/\/\/backless-add-query/, `//backless-add-query`);
      }
    });

    file = file.replace(/Template/g, toPascalCase(modelname));
    file = file.replace(/template/g, modelname);
    file = file.replace(/TEMPLATE/g, toPascalCase(modelname));

    fs.writeFileSync(filePath, file);
    message = "File has been created.";
  }
  return { message };
}

function addModel(
  relTemplatePath,
  relativeDest,
  modelname,
  modelStructureInput
) {
  const filePath = path.join(process.cwd(), relativeDest);
  let message;

  if (fs.existsSync(filePath)) {
    message = "File already exists, remove or rename file first";
    console.log(message);
  } else {
    const templatePath = path.join(__dirname, relTemplatePath);
    let file = fs.readFileSync(templatePath, "utf8");

    modelStructureInput.forEach((el) => {
      file = file.replace(
        /\/\/backless-add-models/g,
        `${el.name}: { type: ${toPascalCase(
          el.type
        )} }, \n  \/\/backless-add-models`
      );
    });

    file = file.replace(/template/g, modelname);
    file = file.replace(/Template/g, toPascalCase(modelname));

    fs.writeFileSync(filePath, file);
    message = "File has been created.";
  }
  return { message };
}

function generateTest(
  relTemplatePath,
  relativeDest,
  modelname,
  modelStructureInput
) {
  const filePath = path.join(process.cwd(), relativeDest);
  let message;

  if (fs.existsSync(filePath)) {
    message = "File already exists, remove or rename file first";
    console.log(message);
  } else {
    const templatePath = path.join(__dirname, relTemplatePath);
    let file = fs.readFileSync(templatePath, "utf8");

    modelStructureInput.forEach((el) => {
      if (el.type === "string") {
        file = file.replace(
          /\/\/backless-test/g,
          `${el.name}: "foobar",\n      //backless-test`
        );
      } else if (el.type === "number") {
        file = file.replace(
          /\/\/backless-test/g,
          `${el.name}: ${+23},\n      //backless-test`
        );
      } else if (el.type === "boolean") {
        file = file.replace(
          /\/\/backless-test/g,
          `${el.name}: ${true},\n      //backless-test`
        );
      } else {
        file = file.replace(
          /\/\/backless-test/g,
          `${el.name}: ["foobar", "barfoo"],\n      //backless-test`
        );
      }
    });

    file = file.replace(/Contoh/g, toPascalCase(modelname));
    file = file.replace(/contoh/g, modelname);
    file = file.replace(/CONTOH/g, toPascalCase(modelname));
    fs.writeFileSync(filePath, file);
    message = "File has been created.";
  }
  return { message };
}

function generateDocumentation(
  relTemplatePath,
  relativeDest,
  modelname,
  modelStructureInput
) {
  const templatePath = path.join(__dirname, relTemplatePath);
  const destination = path.join(process.cwd(), relativeDest);
  let message;

  if (!fs.existsSync(destination)) {
    message = "Readme.md does not exist";
    console.log(message);
  } else {
    let readmeTemp = fs.readFileSync(templatePath, "utf8");
    let userReadme = fs.readFileSync(destination, "utf8");

    //do some regex
    readmeTemp = readmeTemp.replace(/TEMPLATE_ROUTE/g, modelname.toLowerCase());
    readmeTemp = readmeTemp.replace(/TEMPLATE_CAPS/g, modelname.toUpperCase());
    readmeTemp = readmeTemp.replace(/Template/g, toPascalCase(modelname));
    readmeTemp = readmeTemp.replace(/template/g, modelname);
    readmeTemp = readmeTemp.replace(/TEMPLATE/g, toPascalCase(modelname));

    modelStructureInput.forEach((el) => {
      //fill response in readme
      readmeTemp = readmeTemp.replace(
        /\/\/backless-add-model/g,
        `\n          "${el.name}": "<${el.type}>",//backless-add-model`
      );
      //fill body in readme
      readmeTemp = readmeTemp.replace(
        /\/\/backless-add-body/g,
        `\n    - \`${el.name}\`:\`${toPascalCase(el.type)}\`//backless-add-body`
      );
    });
    readmeTemp = readmeTemp.replace(/\/\/backless-add-model/g, "");
    readmeTemp = readmeTemp.replace(/\/\/backless-add-body/g, "");

    userReadme = userReadme.replace(
      /\[comment\]\: \# \(reserved for adding new model\)/,
      readmeTemp
    );

    fs.writeFileSync(destination, userReadme);
    message = "Readme has been generated.";
  }
  return { message };
}

export {
  toPascalCase,
  routeSource,
  addRouting,
  addController,
  addModel,
  generateDocumentation,
  generateTest,
};
