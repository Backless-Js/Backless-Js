import mongoose from "mongoose";
const Schema = mongoose.Schema;
const templateSchema = new Schema({
  //backless-add-models
  /* In order backless to work please do not delete above comment */
  created: {
    type: Date,
  },
  updated: {
    type: Date,
  },
});

const Template = mongoose.model("Template", templateSchema);
export { Template, templateSchema };
