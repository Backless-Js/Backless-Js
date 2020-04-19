const nodeError = [
  "Error",
  "EvalError",
  "InternalError",
  "RangeError",
  "ReferenceError",
  "SyntaxError",
  "TypeError",
  "URIError",
];
const mongooseError = [
  "MongooseError",
  "DisconnectedError",
  "DivergentArrayError",
  "MissingSchemaError",
  "DocumentNotFoundError",
  "MissingSchemaError",
  "ObjectExpectedError",
  "ObjectParameterError",
  "OverwriteModelError",
  "ParallelSaveError",
  "StrictModeError",
  "VersionError",
];
const mongooseErrorFromClient = [
  "CastError",
  "ValidatorError",
  "ValidationError",
];
const jwtError = ["TokenExpiredError", "JsonWebTokenError", "NotBeforeError"];

function nodeErrorMessage(message) {
  switch (message) {
    case "User not found":
      return 403;
    case "Not Authorized": {
      return 401;
    }
    case "no input key found!":
    case "Key is not found or empty":
    case "Token is undefined":
    case "Email is Invalid!":
    case "Password is Invalid!":
      return 400;
    case "Item id not found":
    case "Item not found":
    case "Data not found":
      return 404;
    default: {
      return 500;
    }
  }
}

function errorHelper(errorObject) {
  let statusCode = 500;
  let returnObj = {
    error: errorObject,
  };
  if (jwtError.includes(errorObject.name)) {
    statusCode = 403;
    returnObj.message = "Token is Invalid";
    returnObj.source = "jwt";
  } else if (nodeError.includes(errorObject.name)) {
    returnObj.error = JSON.parse(
      JSON.stringify(errorObject, ["message", "arguments", "type", "name"])
    );
    returnObj.source = "node";
    statusCode = nodeErrorMessage(errorObject.message);
    returnObj.message = errorObject.message;
  } else if (mongooseError.includes(errorObject.name)) {
    returnObj.source = "database";
    returnObj.message = "Error from server";
  } else if (mongooseErrorFromClient.includes(errorObject.name)) {
    returnObj.source = "database";
    errorObject.message
      ? (returnObj.message = errorObject.message)
      : (returnObj.message = "Bad Request");
    statusCode = 400;
  } else if (errorObject.message === "Page not found 404") {
    returnObj.source = "Route error page not found";
    returnObj.message = "Page not found 404";
    statusCode = 404;
  } else {
    returnObj.source = "unknown error";
    returnObj.message = "Something error";
  }
  returnObj.statusCode = statusCode;

  return returnObj;
}

export default function (err, req, res, next) {
  let errorToSend = errorHelper(err);
  res.status(errorToSend.statusCode).json(errorToSend);
}
