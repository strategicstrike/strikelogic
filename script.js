// 🔥 Firebase config (YOUR LINK)
firebase.initializeApp({
  databaseURL: "https://strike-logic-default-rtdb.asia-southeast1.firebasedatabase.app"
});

const db = firebase.database();
const ADMIN_PASSWORD = "225522";

// Admin login
function adminLogin() {
  const pass = document.getElementById("adminPass").value;
  if (pass === ADMIN_PASSWORD) {
    document.getElementById("adminPanel").classList.remove("hidden");
    document.getElementById("loginStatus").innerText = "Logged in as Admin";
  } else {
    document.getElementById("loginStatus").innerText = "Wrong password";
  }
}

// Add trade
function addTrade() {
  const trade = {
    index: index.value,
    strike: strike.value,
    type: type.value,
    entry: Number(entry.value),
    sl: Number(sl.value),
    t1: Number(t1.value),
    t2: Number(t2.value),
    t3: Number(t3.value),
    exit: Number(exit.value),
    qty: Number(qty.value),
    logic: logic.value,
    time: new Date().toLocaleString()
  };

  db.ref("trades").push(trade);
  alert("Trade Saved");
}

// Read trades (for EVERYONE)
db.ref("trades").on("value", snap => {
  const data = snap.val();
  const list = document.getElementById("tradeList");
  list.innerHTML = "";

  for (let id in data) {
    const t = data[id];
    let pnl = "";
    if (t.exit && t.entry && t.qty) {
      const profit = (t.exit - t.entry) * t.qty;
      pnl = profit >= 0
        ? `<p class="profit">Profit: ₹${profit}</p>`
        : `<p class="loss">Loss: ₹${profit}</p>`;
    }

    list.innerHTML += `
      <div class="tradeCard">
        <b>${t.index} ${t.strike} (${t.type})</b>
        <p>Entry: ${t.entry} | SL: ${t.sl}</p>
        <p>T1: ${t.t1} | T2: ${t.t2} | T3: ${t.t3}</p>
        <p>Exit: ${t.exit || "-"}</p>
        <p>Qty: ${t.qty}</p>
        ${pnl}
        <p><b>Logic:</b> ${t.logic}</p>
        <p><small>${t.time}</small></p>
      </div>
    `;
  }
});
