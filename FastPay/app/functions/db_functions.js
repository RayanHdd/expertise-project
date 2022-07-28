export const createOrDropTable = (db, tableName, query) => {
  db.transaction((txn) => {
    txn.executeSql(
      `SELECT name FROM sqlite_master WHERE type='table' AND name='${tableName}'`,
      [],
      (tx, res) => {
        console.log("create or drop execute success results: " + JSON.stringify(res));
        console.log("create or drop execute success transaction: " + JSON.stringify(tx));
        console.log("item:", res.rows.length);
        txn.executeSql(query, []);
      },
      (_, error) => {
        alert("create or drop table execute error: ", error);
      }
    );
  });
};

export const manipulateData = (db, query, data, successTxt = null, failTxt = null) => {
  db.transaction((tx) => {
    tx.executeSql(
      query,
      data,
      (tx, results) => {
        console.log("manipulate execute success results: " + JSON.stringify(results));
        console.log("manipulate execute success transaction: " + JSON.stringify(tx));
        console.log("Results", results.rowsAffected);
        if (results.rowsAffected > 0) {
          console.log("Data Changed Successfully....");
          if (successTxt !== null)
            toast.show(successTxt, {
              type: "normal",
              duration: 3000,
            });
        } else {
          console.error("Failed to change...");
        }
      },
      (_, error) => {
        if (failTxt !== null)
          toast.show(failTxt, {
            type: "normal",
            duration: 3000,
          });
        console.error("manipulate table execute error: ", error);
      }
    );
  });
};

export const fetchData = (db, query, data = []) => {
  return new Promise((resolve) => {
    const temp = [];
    db.transaction((tx) => {
      tx.executeSql(
        query,
        data,
        (tx, results) => {
          for (let i = 0; i < results.rows.length; ++i) temp.push(results.rows.item(i));
          resolve(temp);
        },
        (_, error) => {
          console.log("fetching data execute error: " + error);
        }
      );
    });
    return temp;
  });
};
