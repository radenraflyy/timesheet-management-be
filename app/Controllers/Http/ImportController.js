"use strict";
const fs = require("fs");
const Database = use("Database");
const csv = require("csvtojson");

class ImportController {
  async importActivity({ request, response }) {
    try {
      const reqFile = request.file("file_csv", {
        extnames: ["csv"],
      }).tmpPath;

      if (!reqFile) {
        return {
          messages: "File Not Found",
        };
      }

      const dataImport = await csv().fromFile(reqFile);

      const result = [];
      for (const row of dataImport) {
        const insert = await Database.raw(
          `select * from "user-management"."f_create_activities"('${row.Title_Activity}', ${row.Id_Project}, '${row.Start_Date}', '${row.End_Date}', '${row.Start_Time}', '${row.End_Time}')`
        );
        result.push(insert);
      }

      fs.unlinkSync(reqFile);

      return {
        messages: "Successfully Import Activity",
        data: result,
      };
    } catch (error) {
      response.status(500).send(error.message);
    }
  }
}

module.exports = ImportController;
