let db, budgetVersion;

const request = indexedDB.open("BudgetDB", budgetVersion || 21);
(request.onupgradeneeded = function (a) {
  console.log("Upgrade needed in IndexDB");
  const { oldVersion: b } = a,
    c = a.newVersion || db.version;
  console.log(`DB Updated from version ${b} to ${c}`),
    (db = a.target.result),
    0 === db.objectStoreNames.length &&
      db.createObjectStore("BudgetStore", { autoIncrement: !0 });
}),
  (request.onerror = function (a) {
    console.log(`Woops! ${a.target.errorCode}`);
  });

function checkDatabase() {
  //   console.log("check db invoked");
  let a = db.transaction(["BudgetStore"], "readwrite");
  const b = a.objectStore("BudgetStore"),
    c = b.getAll();
  c.onsuccess = function () {
    0 < c.result.length &&
      fetch("/api/transaction/bulk", {
        method: "POST",
        body: JSON.stringify(c.result),
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
        },
      })
        .then((a) => a.json())
        .then((b) => {
          if (0 !== b.length) {
            a = db.transaction(["BudgetStore"], "readwrite");
            const b = a.objectStore("BudgetStore");
            b.clear(), console.log("Clearing store \uD83E\uDDF9");
          }
        });
  };
}

request.onsuccess = function (a) {
  //   console.log("success")
  (db = a.target.result),
    navigator.onLine &&
      (console.log("Server is online! \uD83D\uDDC4\uFE0F"), checkDatabase());
};
const saveRecord = (a) => {
  //   console.log("Save record invoked");
  const b = db.transaction(["BudgetStore"], "readwrite"),
    c = b.objectStore("BudgetStore");
  c.add(a);
};
window.addEventListener("online", checkDatabase);
