export default {
  CREATE_PASSENGER_TABLE:
    "CREATE TABLE IF NOT EXISTS passenger_table(passenger_id INTEGER PRIMARY KEY AUTOINCREMENT, passenger_name NVARCHAR(30), passenger_phone INT(15) NOT NULL UNIQUE, passenger_walletCharge INTEGER NOT NULL DEFAULT 0 )",
  INSERT_PASSENGER: "INSERT INTO passenger_table (passenger_phone) VALUES (?)",
  DROP_PASSENGER_TABLE: "DROP TABLE IF EXISTS passenger_table",
  FETCH_PASSENGERS: "SELECT * FROM passenger_table",
  GET_WALLET_CHARGE_BY_PHONE_NUMBER: "SELECT passenger_walletCharge FROM passenger_table WHERE passenger_phone = ?",
  EDIT_PASSENGER_WALLET_CHARGE_BY_PHONE_NUMBER:
    "UPDATE passenger_table SET passenger_walletCharge=? WHERE passenger_phone=?",
  DELETE_PASSENGER_BY_PHONE_NUMBER: "DELETE FROM passenger_table WHERE passenger_phone= ?",
  CREATE_DRIVER_TABLE:
    "CREATE TABLE IF NOT EXISTS driver_table(driver_id INTEGER PRIMARY KEY AUTOINCREMENT, driver_username VARCHAR(50) NOT NULL UNIQUE, driver_password VARCHAR(30) NOT NULL, driver_phone INT(15) NOT NULL, driver_firstName NVARCHAR(50) NOT NULL, driver_lastName NVARCHAR(50) NOT NULL, driver_acceptorCode INT(20) NOT NULL UNIQUE,driver_carModel NVARCHAR(50) NOT NULL, driver_numberplate NVARCHAR(50) NOT NULL)",
  INSERT_DRIVER:
    "INSERT INTO driver_table (driver_username,driver_password,driver_phone,driver_firstName,driver_lastName,driver_acceptorCode,driver_carModel,driver_numberplate) VALUES (?,?,?,?,?,?,?,?)",
  FETCH_DRIVER_INFO_BY_CODE: "SELECT * FROM driver_table WHERE driver_acceptorCode = ?",
  DROP_DRIVER_TABLE: "DROP TABLE IF EXISTS driver_table",
  CREATE_TRANSACTION_TABLE:
    "CREATE TABLE IF NOT EXISTS transaction_table(transaction_id INTEGER PRIMARY KEY AUTOINCREMENT, transaction_cost NVARCHAR(50) NOT NULL, transaction_dateTime VARCHAR(50) NOT NULL, transaction_source NVARCHAR(50), transaction_destination NVARCHAR(50), passenger_id INTEGER, driver_id INTEGER, FOREIGN KEY (passenger_id) REFERENCES passenger_table (passenger_id) ON DELETE CASCADE ON UPDATE CASCADE, FOREIGN KEY (driver_id) REFERENCES driver_table (driver_id) ON DELETE CASCADE ON UPDATE CASCADE)",
  INSERT_TRANSACTION:
    "INSERT INTO transaction_table (transaction_cost, transaction_dateTime, transaction_source, transaction_destination, passenger_id, driver_id) VALUES (?,?,?,?,?,?)",
  GET_PASSENGER_ID_BY_PHONE_NUMBER: "SELECT passenger_id FROM passenger_table WHERE passenger_phone = ?",
  FETCH_TRANSACTIONS_BY_PASSENGER_ID: "SELECT * FROM transaction_table WHERE passenger_id = ?",
  DROP_TRANSACTION_TABLE: "DROP TABLE IF EXISTS transaction_table",
};
