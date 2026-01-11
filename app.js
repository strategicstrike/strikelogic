// 🔥 FIREBASE CONFIG (YOUR DATABASE)
var firebaseConfig = {
  databaseURL: "https://strike-logic-default-rtdb.asia-southeast1.firebasedatabase.app/"
};

firebase.initializeApp(firebaseConfig);
var db = firebase.database();

// 🔐 ADMIN LOGIN
function login() {
  const pass = document.getElementById("adminPassword").value;
  if (pass === "225522") {
    document.getElementById("loginBox").style.display = "none";
    document.getElementById("adminPanel").classList.remove("hidden");
  } else {
    alert("Wrong password");
  }
}

// ➕ ADD TRADE
function addTrade() {
  const index = indexName.value;
  const strike = strike.value;
  const entry = Number(document.getElementById("entry").value);
  const exit = Number(document.getElementById("exit").value);
  const qty = Number(document.getElementById("qty").value);

  let points = exit ? exit - entry : 0;
  let pnl = points * qty;

  const trade = {
    index,
    strike,
    entry,
    exit,
    qty,
    points,
    pnl,
    time: new Date().toLocaleString()
  };

  db.ref("trades").push(trade);

  alert("Trade Added");
}

// 📡 LOAD TRADES FOR ALL USERS
db.ref("trades").on("value", snapshot => {
  tradeList.innerHTML = "";
  snapshot.forEach(child => {
    const t = child.val();
    let cls = t.pnl >= 0 ? "profit" : "loss";

    tradeList.innerHTML += `
      <div class="trade">
        <b>${t.index} – ${t.strike}</b><br>
        Entry: ₹${t.entry} | Exit: ₹${t.exit || "Running"}<br>
        Qty: ${t.qty}<br>
        Points: ${t.points}<br>
        <span class="${cls}">P/L: ₹${t.pnl}</span><br>
        <small>${t.time}</small>
      </div>
    `;
  });
});
