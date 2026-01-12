firebase.initializeApp({
  databaseURL: "https://strike-logic-default-rtdb.asia-southeast1.firebasedatabase.app/"
});

const db = firebase.database();
let isAdmin = false;

/* ADMIN LOGIN */
function adminLogin() {
  const pass = document.getElementById("adminPassword").value;
  if (pass === "225522") {
    isAdmin = true;
    document.getElementById("adminPanel").classList.remove("hidden");
    document.getElementById("loginSection").classList.add("hidden");
  } else {
    alert("Wrong password");
  }
}

/* SAVE TRADE */
function saveTrade() {
  if (!isAdmin) return;

  const trade = {
    index: index.value,
    strike: strike.value,
    entry: +entry.value,
    sl: +sl.value,
    t1: +t1.value,
    t2: +t2.value,
    t3: +t3.value,
    exit: +exit.value || 0,
    qty: +qty.value,
    logic: logic.value,
    status: status.value,
    time: new Date().toLocaleString()
  };

  const id = db.ref("trades").push().key;
  db.ref("trades/" + id).set(trade);

  if (trade.exit > 0) updateMonthlyPL(trade);
}

/* MONTHLY P&L */
function updateMonthlyPL(trade) {
  const month = new Date().toISOString().slice(0,7);
  const profit = (trade.exit - trade.entry) * trade.qty;

  db.ref("monthlyPL/" + month).transaction(v => (v || 0) + profit);
}

/* BROADCAST */
function sendBroadcast() {
  db.ref("broadcast").set(broadcastMsg.value);
}

/* LOAD BROADCAST */
db.ref("broadcast").on("value", s => {
  broadcastBox.innerText = s.val() || "";
});

/* LOAD TRADES */
db.ref("trades").on("value", snap => {
  liveTrades.innerHTML = "";
  closedTrades.innerHTML = "";

  snap.forEach(child => {
    const t = child.val();
    const pnl = t.exit ? (t.exit - t.entry) * t.qty : 0;

    const div = document.createElement("div");
    div.className = `tradeCard ${t.status}`;
    div.innerHTML = `
      <span class="badge ${t.status}">${t.status}</span>
      <h3>${t.index} ${t.strike}</h3>
      <p>Entry: ${t.entry} | SL: ${t.sl}</p>
      <p>T1: ${t.t1} | T2: ${t.t2} | T3: ${t.t3}</p>
      <p>Exit: ${t.exit || "-"}</p>
      <p>Qty: ${t.qty}</p>
      <p><b>${t.exit ? "Profit: ₹" + pnl : "Running Trade"}</b></p>
      <p>Logic: ${t.logic}</p>
      <small>${t.time}</small>
    `;

    if (t.status === "LIVE") liveTrades.appendChild(div);
    else closedTrades.appendChild(div);
  });
});

/* LOAD MONTHLY P&L */
db.ref("monthlyPL").on("value", snap => {
  monthlyPL.innerHTML = "";
  snap.forEach(m => {
    monthlyPL.innerHTML += `<p>${m.key}: ₹${m.val()}</p>`;
  });
});

/* PUSH NOTIFICATION */
if ("Notification" in window) Notification.requestPermission();

db.ref("trades").limitToLast(1).on("child_added", s => {
  if (Notification.permission === "granted") {
    new Notification("New Trade Alert", {
      body: s.val().index + " " + s.val().strike
    });
  }
});
