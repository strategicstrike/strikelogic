// 🔥 Firebase Config (YOUR DATABASE)
const firebaseConfig = {
  databaseURL: "https://strike-logic-default-rtdb.asia-southeast1.firebasedatabase.app/"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// 🔐 ADMIN PASSWORD
const ADMIN_PASSWORD = "225522";

// 🔑 ELEMENTS
const loginBtn = document.getElementById("loginBtn");
const passwordInput = document.getElementById("adminPassword");
const adminPanel = document.getElementById("adminPanel");

const liveTrades = document.getElementById("liveTrades");
const closedTrades = document.getElementById("closedTrades");

const index = document.getElementById("index");
const strike = document.getElementById("strike");
const type = document.getElementById("type");
const entry = document.getElementById("entry");
const sl = document.getElementById("sl");
const t1 = document.getElementById("t1");
const t2 = document.getElementById("t2");
const t3 = document.getElementById("t3");
const exit = document.getElementById("exit");
const qty = document.getElementById("qty");
const logic = document.getElementById("logic");
const message = document.getElementById("message");

// 🔐 ADMIN LOGIN
loginBtn.onclick = () => {
  if (passwordInput.value === ADMIN_PASSWORD) {
    adminPanel.classList.remove("hidden");
    alert("Admin Login Successful");
  } else {
    alert("Wrong Password");
  }
};

// ➕ ADD TRADE
function addTrade() {
  if (!entry.value || !qty.value) {
    alert("Entry & Quantity required");
    return;
  }

  const trade = {
    index: index.value,
    strike: strike.value,
    type: type.value,
    entry: Number(entry.value),
    sl: Number(sl.value),
    t1: Number(t1.value),
    t2: Number(t2.value),
    t3: Number(t3.value),
    exit: exit.value ? Number(exit.value) : null,
    qty: Number(qty.value),
    logic: logic.value,
    message: message.value || "",
    status: exit.value ? "CLOSED" : "LIVE",
    time: new Date().toLocaleString()
  };

  db.ref("trades").push(trade);
  alert("Trade Added");
  clearInputs();
}

// 🧹 CLEAR INPUTS
function clearInputs() {
  entry.value = "";
  sl.value = "";
  t1.value = "";
  t2.value = "";
  t3.value = "";
  exit.value = "";
  qty.value = "";
  logic.value = "";
  message.value = "";
}

// 📡 FETCH & DISPLAY TRADES
db.ref("trades").on("value", snap => {
  liveTrades.innerHTML = "";
  closedTrades.innerHTML = "";

  const data = snap.val();
  if (!data) return;

  Object.keys(data).reverse().forEach(id => {
    const t = data[id];

    let pnlHTML = "";
    if (t.status === "CLOSED") {
      const pnl = (t.exit - t.entry) * t.qty;
      pnlHTML = pnl >= 0
        ? `<p class="profit">Profit: ₹${pnl}</p>`
        : `<p class="loss">Loss: ₹${pnl}</p>`;
    }

    const card = document.createElement("div");
    card.className = "tradeCard";
    card.innerHTML = `
      <b>${t.index} ${t.strike} (${t.type})</b>
      <p>Entry: ${t.entry} | SL: ${t.sl}</p>
      <p>T1: ${t.t1} | T2: ${t.t2} | T3: ${t.t3}</p>
      <p>Exit: ${t.exit ?? "-"}</p>
      <p>Qty: ${t.qty}</p>
      ${pnlHTML}
      <p><b>Logic:</b> ${t.logic}</p>
      ${t.message ? `<p><b>Update:</b> ${t.message}</p>` : ""}
      <small>${t.time}</small>
      <div class="adminBtns hidden">
        <button onclick="closeTrade('${id}', ${t.entry}, ${t.qty})">Close Trade</button>
        <button onclick="deleteTrade('${id}')">Delete</button>
      </div>
    `;

    if (t.status === "LIVE") {
      liveTrades.appendChild(card);
    } else {
      closedTrades.appendChild(card);
    }
  });

  // SHOW ADMIN BUTTONS IF LOGGED IN
  if (!adminPanel.classList.contains("hidden")) {
    document.querySelectorAll(".adminBtns").forEach(b => b.classList.remove("hidden"));
  }
});

// 🔴 CLOSE TRADE
function closeTrade(id, entry, qty) {
  const exitPrice = prompt("Enter Exit Price");
  if (!exitPrice) return;

  db.ref("trades/" + id).update({
    exit: Number(exitPrice),
    status: "CLOSED"
  });
}

// ❌ DELETE TRADE
function deleteTrade(id) {
  if (confirm("Are you sure to delete this trade?")) {
    db.ref("trades/" + id).remove();
  }
}
