"use strict";
const { validate } = use("Validator");
const Database = use("Database");

class EmployeeController {
  async insertEmployee({ request, response }) {
    const { name_employe, rate } = request.all();
    const rules = {
      name_employe: "required",
      rate: "required",
    };

    const validation = await validate(request.all(), rules);
    if (validation.fails()) {
      response.status(400);
      return validation.messages();
    }
    try {
      const res = await Database.raw(
        `select * from "user-management"."f_create_employees"('${name_employe}', ${rate})`
      );
      return {
        messages: "Succesfully Insert Employee",
        data: res.rows,
      };
    } catch (error) {
      response.status(500).send(error.message);
    }
  }

  async updateEmployee({ request, response, params }) {
    let id_employe = params.idEmploye
    const { name_employe, rate } = request.all();
    const rules = {
      name_employe: "required",
      rate: "required",
    };

    const validation = await validate(request.all(), rules);
    if (validation.fails()) {
      response.status(400);
      return validation.messages();
    }

    if (id_employe < 0) {
      response.status(400);
      return {
        messages: "Id Must Be Positive",
      };
    }

    try {
      const res = await Database.raw(
        `select * from "user-management"."f_update_employees"(${id_employe}, 
        '${name_employe}', ${rate})`
      );
      if (res.rows.length === 0) {
        return {
          messages: "Id Not Found",
        };
      } else {
        return {
          messages: "Succesfully Update Employee",
          data: res.rows,
        };
      }
    } catch (error) {
      response.status(500).send(error.message);
    }
  }
}

module.exports = EmployeeController;
