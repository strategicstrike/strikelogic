// ================= FIREBASE CONFIG =================
const firebaseConfig = {
  databaseURL: "https://strike-logic-default-rtdb.asia-southeast1.firebasedatabase.app/"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// ================= ADMIN LOGIN =================
const ADMIN_PASSWORD = "225522";

const loginBtn = document.getElementById("loginBtn");
const passwordInput = document.getElementById("adminPassword");
const adminSection = document.getElementById("adminSection");

loginBtn.addEventListener("click", () => {
  const pass = passwordInput.value.trim();

  if (pass === ADMIN_PASSWORD) {
    alert("Admin Login Successful");
    adminSection.classList.remove("hidden");
    passwordInput.value = "";
  } else {
    alert("Wrong Password");
  }
});

// ================= ADD TRADE =================
function addTrade() {
  const symbol = document.getElementById("symbol").value;
  const entry = Number(document.getElementById("entry").value);
  const exit = document.getElementById("exit").value;
  const qty = Number(document.getElementById("qty").value);
  const logic = document.getElementById("logic").value;

  const trade = {
    symbol,
    entry,
    exit: exit ? Number(exit) : null,
    qty,
    logic,
    time: new Date().toLocaleString()
  };

  db.ref("trades").push(trade);
  alert("Trade Saved");
}

// ================= DISPLAY TRADES =================
db.ref("trades").on("value", (snapshot) => {
  const liveDiv = document.getElementById("liveTrades");
  const closedDiv = document.getElementById("closedTrades");
  const pnlDiv = document.getElementById("monthlyPnL");

  liveDiv.innerHTML = "";
  closedDiv.innerHTML = "";

  let totalPnL = 0;

  snapshot.forEach((child) => {
    const t = child.val();

    if (t.exit === null) {
      liveDiv.innerHTML += `
        <div class="trade">
          <b>${t.symbol}</b><br>
          Entry: ${t.entry}<br>
          Qty: ${t.qty}<br>
          Logic: ${t.logic}
        </div>`;
    } else {
      const pnl = (t.exit - t.entry) * t.qty;
      totalPnL += pnl;

      closedDiv.innerHTML += `
        <div class="trade">
          <b>${t.symbol}</b><br>
          Entry: ${t.entry} | Exit: ${t.exit}<br>
          Qty: ${t.qty}<br>
          <span class="${pnl >= 0 ? "green" : "red"}">
            Profit: ₹${pnl}
          </span>
        </div>`;
    }
  });

  pnlDiv.innerText = `₹${totalPnL}`;
});
