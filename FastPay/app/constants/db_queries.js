export default {
  CREATE_PASSENGER_TABLE:
    "CREATE TABLE IF NOT EXISTS passenger_table(passenger_id INTEGER PRIMARY KEY AUTOINCREMENT, passenger_name NVARCHAR(50) DEFAULT 'کاربر جدید', passenger_phone INT(15) NOT NULL UNIQUE, passenger_walletCharge INTEGER NOT NULL DEFAULT 0, passenger_imageUri TEXT DEFAULT 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Circle-icons-profile.svg/1200px-Circle-icons-profile.svg.png')",
  INSERT_PASSENGER: "INSERT INTO passenger_table (passenger_phone) VALUES (?)",
  DROP_PASSENGER_TABLE: "DROP TABLE IF EXISTS passenger_table",
  FETCH_PASSENGERS: "SELECT * FROM passenger_table",
  GET_WALLET_CHARGE_BY_PHONE_NUMBER: "SELECT passenger_walletCharge FROM passenger_table WHERE passenger_phone = ?",
  EDIT_PASSENGER_WALLET_CHARGE_BY_PHONE_NUMBER:
    "UPDATE passenger_table SET passenger_walletCharge=? WHERE passenger_phone=?",
  DELETE_PASSENGER_BY_PHONE_NUMBER: "DELETE FROM passenger_table WHERE passenger_phone= ?",
  CREATE_DRIVER_TABLE:
    "CREATE TABLE IF NOT EXISTS driver_table(driver_id INTEGER PRIMARY KEY AUTOINCREMENT, driver_username VARCHAR(50) NOT NULL UNIQUE, driver_password VARCHAR(30) NOT NULL, driver_phone INT(15) NOT NULL, driver_firstName NVARCHAR(50) NOT NULL, driver_lastName NVARCHAR(50) NOT NULL, driver_acceptorCode INT(20) NOT NULL UNIQUE, driver_carModel NVARCHAR(50) NOT NULL, driver_numberplate NVARCHAR(50) NOT NULL, driver_imageUrl TEXT UNIQUE)",
  INSERT_DRIVER:
    "INSERT INTO driver_table (driver_username,driver_password,driver_phone,driver_firstName,driver_lastName,driver_acceptorCode,driver_carModel,driver_numberplate, driver_imageUrl) VALUES (?,?,?,?,?,?,?,?,?)",
  FETCH_DRIVER_INFO_BY_CODE: "SELECT * FROM driver_table WHERE driver_acceptorCode = ?",
  FETCH_PASSENGER_INFO_BY_PHONE_NUMBER: "SELECT * FROM passenger_table WHERE passenger_phone= ?",
  DROP_DRIVER_TABLE: "DROP TABLE IF EXISTS driver_table",
  CREATE_TRANSACTION_TABLE:
    "CREATE TABLE IF NOT EXISTS transaction_table(transaction_id INTEGER PRIMARY KEY AUTOINCREMENT, transaction_type VARCHAR(20) NOT NULL ,transaction_cost NVARCHAR(50) NOT NULL, transaction_dateTime VARCHAR(50) NOT NULL, transaction_source NVARCHAR(50), transaction_destination NVARCHAR(50), passenger_id INTEGER, driver_id INTEGER, FOREIGN KEY (passenger_id) REFERENCES passenger_table (passenger_id) ON DELETE CASCADE ON UPDATE CASCADE, FOREIGN KEY (driver_id) REFERENCES driver_table (driver_id) ON DELETE CASCADE ON UPDATE CASCADE)",
  INSERT_TRANSACTION:
    "INSERT INTO transaction_table (transaction_type, transaction_cost, transaction_dateTime, transaction_source, transaction_destination, passenger_id, driver_id) VALUES (?,?,?,?,?,?,?)",
  GET_PASSENGER_ID_BY_PHONE_NUMBER: "SELECT passenger_id FROM passenger_table WHERE passenger_phone = ?",
  FETCH_TRANSACTIONS_BY_PASSENGER_ID:
    "SELECT * FROM transaction_table WHERE passenger_id = ? ORDER BY transaction_dateTime DESC",
  DROP_TRANSACTION_TABLE: "DROP TABLE IF EXISTS transaction_table",
  GET_DRIVER_NAME_BY_ID: "SELECT driver_firstName,driver_lastName FROM driver_table WHERE driver_id = ?",
  GET_DRIVER_IMAGE_BY_ID: "SELECT driver_imageUrl FROM driver_table WHERE driver_id = ?",
  GET_DRIVER_CODE_BY_ID: "SELECT driver_acceptorCode FROM driver_table WHERE driver_id = ?",
  EDIT_PASSENGER_INFO_BY_PHONE_NUMBER:
    "UPDATE passenger_table SET passenger_imageUri=?,passenger_name=?,passenger_phone=? WHERE passenger_phone=?",
  CREATE_OFFENDING_TABLE:
    "CREATE TABLE IF NOT EXISTS offending_table(offending_id INTEGER PRIMARY KEY AUTOINCREMENT, offending_text TEXT NOT NULL, offending_status VARCHAR(20) DEFAULT 'pending', transaction_id INTEGER, FOREIGN KEY (transaction_id) REFERENCES transaction_table (transaction_id) ON DELETE CASCADE ON UPDATE CASCADE)",
  INSERT_OFFENDING: "INSERT INTO offending_table (offending_text, transaction_id) VALUES (?,?)",
  FETCH_OFFENDINGS: "SELECT * FROM offending_table",
  CREATE_MANAGER_TABLE:
    "CREATE TABLE IF NOT EXISTS manager_table(manager_id INTEGER PRIMARY KEY AUTOINCREMENT, manager_username NVARCHAR(50) NOT NULL, manager_password NVARCHAR(50) NOT NULL)",
  INSERT_MANAGER: "INSERT INTO manager_table (manager_username, manager_password) VALUES (?,?)",
  CHECK_IF_DRIVER_EXISTS:
    "SELECT EXISTS (SELECT * FROM driver_table WHERE driver_username = ? AND driver_password = ? LIMIT 1)",
  CHECK_IF_MANAGER_EXISTS:
    "SELECT EXISTS (SELECT * FROM manager_table WHERE manager_username = ? AND manager_password = ? LIMIT 1)",
};
