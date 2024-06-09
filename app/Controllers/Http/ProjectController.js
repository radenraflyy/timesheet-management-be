"use strict";
const { validate } = use("Validator");
const Database = use("Database");

class ProjectController {
  async insertProject({ request, response }) {
    const { name } = request.all();
    const rules = {
      name: "required",
    };

    const validation = await validate(request.all(), rules);
    if (validation.fails()) {
      response.status(400);
      return validation.messages();
    }

    try {
      const result = await Database.raw(
        `select * from "user-management"."f_create_project"('${name}')`
      );
      return {
        messages: "Succesfully Insert Project",
        data: result.rows,
      };
    } catch (error) {
      response.status(500).send(error.message);
    }
  }

  async getProjectList() {
    const show = await Database.raw(
      `SELECT * FROM "user-management"."f_filter_projects"()`
    );

    return {
      messages: "Succesfully Show Projects",
      data: show.rows,
    };
  }
}

module.exports = ProjectController;
