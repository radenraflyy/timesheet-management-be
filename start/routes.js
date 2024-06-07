"use strict";
/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use("Route");

// api prefix
const api = "api/v1";

const exts = ["json", "table", "tablejson", "jsontable"];

// Endpoint Project
// api/v1/projects
Route.group(() => {
  Route.get("get", "ProjectController.getProjectList");
  Route.post("insert", "ProjectController.insertProject");
})
  .prefix(api + "/projects")
  .formats(exts);

// Endpoint Employee
// api/v1/employees
Route.group(() => {
  Route.post("insert", "EmployeeController.insertEmployee");
  Route.put("update/:idEmploye", "EmployeeController.updateEmployee");
})
  .prefix(api + "/employees")
  .formats(exts);

// Endpoint Timesheet Activity
// api/v1/timesheets
Route.group(() => {
  Route.post("insert", "ActivityController.insertActivity");
  Route.get("get", "ActivityController.getListActivity");
  Route.patch("update/:idActivity", "ActivityController.updateActivity");
  Route.delete("delete", "ActivityController.deleteActivity");
  Route.get("filter/:idProject", "ActivityController.filterActivity");
})
  .prefix(api + "/timesheets-activity")
  .formats(exts);
