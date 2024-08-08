const routeBaseUrl = "/api/transaction"; 
const transaction = require("../../controllers/transactionController");
const Validation= require("../Transaction/transactionValidation");

module.exports = app => {
  app.post(routeBaseUrl + "/createTransaction",Validation.createTransactionSchema,transaction.createTransaction);
  app.get(routeBaseUrl + "/getListOfTransaction",  transaction.getListOfTransaction);
  app.get(routeBaseUrl + "/getTransactionDetail",  transaction.getTransactionDetail);
 }