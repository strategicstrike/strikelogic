import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  onValue,
  remove,
  update
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

/* 🔥 YOUR FIREBASE CONFIG */
const firebaseConfig = {
  databaseURL: "https://strike-logic-default-rtdb.asia-southeast1.firebasedatabase.app/"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const tradesRef = ref(db, "trades");

/* ➕ ADD / UPDATE TRADE */
window.addTrade = function () {
  const exitValue = document.getElementById("exit").value;

  const trade = {
    symbol: symbol.value,
    entry: Number(entry.value),
    exit: exitValue === "" ? null : Number(exitValue),
    qty: Number(qty.value),
    t1: Number(t1.value) || null,
    t2: Number(t2.value) || null,
    t3: Number(t3.value) || null,
    sl: Number(sl.value) || null,
    logic: logic.value,
    time: new Date().toLocaleString()
  };

  push(tradesRef, trade);
  clearForm();
};

/* 🔴 DELETE TRADE */
window.deleteTrade = function (id) {
  remove(ref(db, `trades/${id}`));
};

/* 🔄 LIVE LISTENER (MOST IMPORTANT PART) */
onValue(tradesRef, (snapshot) => {
  const data = snapshot.val();

  liveTrades.innerHTML = "";
  closedTrades.innerHTML = "";

  let monthlyPL = 0;

  for (let id in data) {
    const t = data[id];
    const isLive = t.exit === null;

    const pnl = isLive ? 0 : (t.exit - t.entry) * t.qty;
    monthlyPL += pnl;

    const div = document.createElement("div");
    div.className = "trade";

    div.innerHTML = `
      <b>${t.symbol}</b>
      <p>Entry: ${t.entry}</p>
      <p>Exit: ${t.exit ?? "Running"}</p>
      <p>Qty: ${t.qty}</p>
      <p>T1: ${t.t1 ?? "--"} | T2: ${t.t2 ?? "--"} | T3: ${t.t3 ?? "--"}</p>
      <p>SL: ${t.sl ?? "--"}</p>
      <p>${t.logic ?? ""}</p>
      <p class="${pnl >= 0 ? "profit" : "loss"}">P&L: ₹${pnl}</p>
      <button onclick="deleteTrade('${id}')">Delete</button>
    `;

    if (isLive) {
      liveTrades.appendChild(div);
    } else {
      closedTrades.appendChild(div);
    }
  }

  monthlyPLDiv.innerText = `₹${monthlyPL}`;
});

/* 🧹 CLEAR FORM */
function clearForm() {
  document.querySelectorAll("input, textarea").forEach(el => el.value = "");
}
