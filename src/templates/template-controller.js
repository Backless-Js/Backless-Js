import { Template, templateSchema } from "../models/TEMPLATE";

class TemplateController {
  static async create(req, res, next) {
    try {
      let input = {};
      const keys = Object.keys(req.body);
      const schemaKeys = Object.keys(templateSchema.obj)
      if (keys.length !== 0) {
        schemaKeys.forEach((schemaKey) => {
          keys.forEach((key) => {
            if (schemaKey === key) {
              if (req.body[key].length !== 0) {
                input[key] = req.body[key];
              } else {
                throw { message: "Value cannot be empty" }
              }
            }
          });
        })
        if (Object.keys(input).length === 0) {
          next({ message: "no input key found!" })
        } else {
          console.log(input, 'INI INPUT');
          const created = await Template.create(input);
          res.status(201).json({
            message: "Template created successfully.",
            Template: created,
          });
        }
      } else {
        next({ message: "Key is not found or empty" })
      }
    } catch (error) {
      next(error);
    }
  }

  static async findOne(req, res, next) {
    try {
      const { id } = req.params;
      const data = await Template.findOne({ _id: id });

      if (!data) {
        throw new Error("Data not found");
      } else {
        res.status(200).json(data);
      }
    } catch (error) {
      next(error);
    }
  }

  static async findAll(req, res, next) {
    try {
      let query = {};
      if (req.query.search) {
        let search = new RegExp(req.query.search);
        query = {
          $or: [
            //backless-add-query
          ],
        };
      }
      /* Query above is for filtering data through query request you may alter or delete it */

      const data = await Template.find(query);

      if (data.length < 1) {
        res.status(200).json({
          message: "There is no such data in Template",
        });
      } else {
        res.status(200).json(data);
      }
    } catch (error) {
      next(error);
    }
  }

  static async updateOnePatch(req, res, next) {
    try {
      const { id } = req.params;
      let input = {};
      const keys = Object.keys(req.body);

      keys.forEach((key) => {
        input[key] = req.body[key];
      });
      input.updated = new Date();

      const updated = await Template.findOneAndUpdate({ _id: id }, input, {
        new: true,
      });
      if (updated) {
        res.status(201).json({
          message: "Template Has been updated",
          updatedTEMPLATE: updated,
        });
      } else {
        throw new Error("Data not found");
      }
    } catch (error) {
      next(error);
    }
  }

  static async updateOnePut(req, res, next) {
    try {
      const { id } = req.params;
      let input = {};
      const keys = Object.keys(req.body);

      keys.forEach((key) => {
        input[key] = req.body[key];
      });
      input.updated = new Date();

      const updated = await Template.findOneAndUpdate({ _id: id }, input, {
        new: true,
      });
      if (updated) {
        res.status(201).json({
          message: "Template Has been updated",
          updatedTEMPLATE: updated,
        });
      } else {
        throw new Error("Data not found");
      }
    } catch (error) {
      next(error);
    }
  }

  static async deleteOne(req, res, next) {
    try {
      const { id } = req.params;
      const deleted = await Template.findOneAndDelete({ _id: id });
      if (deleted) {
        res.status(200).json({
          message: "Template has been deleted.",
          deletedTEMPLATE: deleted,
        });
      } else {
        throw new Error("Data not found");
      }
    } catch (error) {
      next(error);
    }
  }
}

export default TemplateController;
