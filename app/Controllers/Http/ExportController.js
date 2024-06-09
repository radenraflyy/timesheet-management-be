"use strict";
const { startCase, flattenDeep } = require("lodash");
const xl = require("excel4node");
const Database = use("Database");
const bluebird = require("bluebird");
const { validate } = use("Validator");
const fs = require("fs");
const path = require("path");
const CsvParser = require("json2csv").Parser;
const moment = require("moment");
const Env = use("Env");

class ExportController {
  async downloadActivity({ response }) {
    try {
      const dateTime = moment().utcOffset("+07:00").toObject();
      const list = await Database.raw(
        'select * from "user-management"."f_list_activity"()'
      );

      const export_data = list.rows.map(function (item, i) {
        return {
          Id: item.id_activities,
          Title_Activity: item.title,
          Id_Project: item.id_project_,
          Project_Name: item.project_name,
          Start_Date: moment(item.start_date_).format("yyyy-MM-DD"),
          End_Date: moment(item.end_date_).format("yyyy-MM-DD"),
          Start_Time: item.start_time_,
          End_Time: item.end_time_,
          Duration: item.duration_,
          Creaed_at: moment(item.created_at_).format("yyyy-MM-DD HH:mm:ss"),
          Updated_at: moment(item.updated_at_).format("yyyy-MM-DD HH:mm:ss"),
        };
      });

      const csvFields = [
        "ID",
        "Title Activity",
        "Id Project",
        "Project Name",
        "Start Date",
        "End Date",
        "Start Time",
        "End Time",
        "Duration",
        "Created At",
        "Updated At",
      ];

      const csvParser = new CsvParser({ csvFields });
      const csvData = csvParser.parse(export_data);
      const name = `list_activity_${dateTime.hours}${dateTime.minutes}${dateTime.seconds}.csv`;
      const path = "./uploads/public/list_activity/";
      fs.writeFileSync(path + name, csvData);
      return response.download(path + name, name);
    } catch (error) {
      console.error("Export Error:", error);
      return response
        .status(500)
        .send({ message: "Export failed", error: error.message });
    }
  }
}

module.exports = ExportController;
