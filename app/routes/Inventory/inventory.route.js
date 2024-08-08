const routeBaseUrl = "/api/inventory"; 
const inventory = require("../../controllers/inventory");
const Validation= require("../Inventory/inventoryValidation");

module.exports = app => {
  app.post(routeBaseUrl + "/addItem",Validation.addItemSchema, inventory.addItem);
  app.get(routeBaseUrl + "/getListOfItems",  inventory.getListOfItems);
  app.get(routeBaseUrl + "/getItemDetail",  inventory.getItemDetail);
  app.put(routeBaseUrl + "/updateItemDetail",Validation.updateItemSchema,inventory.updateItemDetail);
  app.delete(routeBaseUrl + "/deleteItemDetail",  inventory.deleteItemDetail);

}