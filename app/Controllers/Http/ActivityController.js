"use strict";
const Database = use("Database");
const { validate } = use("Validator");

class ActivityController {
  async insertActivity({ request, response }) {
    const {
      title_activity,
      id_project,
      start_date,
      end_date,
      start_time,
      end_time,
    } = request.all();

    const rules = {
      title_activity: "required",
      id_project: "required",
      start_date: "required",
      end_date: "required",
      start_time: "required",
      end_time: "required",
    };

    const validation = await validate(request.all(), rules);
    if (validation.fails()) {
      response.status(400);
      return validation.messages();
    }

    try {
      await Database.raw(
        `select * from "user-management"."f_create_activities"('${title_activity}', ${id_project}, '${start_date}', '${end_date}', '${start_time}', '${end_time}')`
      );
      const result = await Database.raw(
        'select * from "user-management"."f_list_activity"()'
      );
      return {
        messages: "Succesfully Insert Activity",
        data: result.rows,
      };
    } catch (error) {
      response.status(500).send(error.message);
    }
  }

  async getListActivity() {
    try {
      const result = await Database.raw(
        'select * from "user-management"."f_list_activity"()'
      );
      return {
        messages: "Succesfully Get List Activities",
        data: result.rows,
      };
    } catch (error) {
      return {
        messages: error.message,
        status: 500,
      };
    }
  }

  async updateActivity({ request, response, params }) {
    let id_activity = params.idActivity;
    const {
      title_activity,
      id_project,
      start_date,
      end_date,
      start_time,
      end_time,
    } = request.all();
    const rules = {
      title_activity: "required",
      id_project: "required",
      start_date: "required",
      end_date: "required",
      start_time: "required",
      end_time: "required",
    };

    const validation = await validate(request.all(), rules);
    if (validation.fails()) {
      response.status(400);
      return validation.messages();
    }

    if (id_activity < 0) {
      response.status(400);
      return {
        messages: "Id Must Be Positive",
      };
    }

    try {
      const res = await Database.raw(
        `select * from "user-management"."f_update_activities"(${id_activity}, '${title_activity}', ${id_project}, '${start_date}', '${end_date}', '${start_time}', '${end_time}')`
      );
      if (res.rows.length === 0) {
        return {
          messages: "Id Not Found",
        };
      }
      const result = await Database.raw(
        'select * from "user-management"."f_list_activity"()'
      );
      return {
        messages: "Succesfully Update Activity",
        data: result.rows,
      };
    } catch (error) {
      response.status(500).send(error.message);
    }
  }

  async deleteActivity({ request, response, params }) {
    const id_activity = params.idActivity;

    if (id_activity < 0) {
      response.status(400);
      return {
        messages: "Id Must Be Positive",
      };
    }

    try {
      const res = await Database.raw(
        `select * from "user-management"."f_delete_activity"(${id_activity})`
      );
      if (res.rows.length === 0) {
        return {
          messages: "Id Not Found",
        };
      }

      return {
        messages: "Succesfully Delete Activity",
      };
    } catch (error) {
      response.status(500).send(error.message);
    }
  }

  async filterActivity({ response, params }) {
    let id_project = params.idProject;

    if (id_project < 0) {
      response.status(400);
      return {
        messages: "Id Must Be Positive",
      };
    }

    try {
      const result = await Database.raw(
        `select * from "user-management"."f_filter_activities"('{${id_project}}')`
      );
      if (result.rows.length === 0) {
        return {
          messages: "Data Activity Not Found",
        };
      } else {
        return {
          messages: "Succesfully Filter Activity",
          data: result.rows,
        };
      }
    } catch (error) {
      response.status(500).send(error.message);
    }
  }
}

module.exports = ActivityController;
