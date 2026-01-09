let trades = JSON.parse(localStorage.getItem("trades")) || [];

function addTrade() {
  const now = new Date();

  trades.push({
    date: now.toLocaleDateString("en-IN"),
    entryTime: now.toLocaleTimeString("en-IN"),
    exitTime: "-",
    index: index.value,
    strike: strike.value,
    type: type.value,
    entry: Number(entry.value),
    sl: Number(sl.value),
    t1: Number(t1.value),
    t2: Number(t2.value),
    qty: Number(qty.value),
    logic: logic.value.split("\n"),
    status: "RUNNING",
    pnl: 0
  });

  saveTrades();
}

function exitTrade(i) {
  const now = new Date();
  const exitPrice = prompt("Enter Exit Price");

  if (!exitPrice) return;

  trades[i].exitTime = now.toLocaleTimeString("en-IN");
  trades[i].pnl = (exitPrice - trades[i].entry) * trades[i].qty;
  trades[i].status = "EXITED";

  saveTrades();
}

function saveTrades() {
  localStorage.setItem("trades", JSON.stringify(trades));
  renderTrades();
}

function renderTrades() {
  history.innerHTML = "";

  let totalProfit = 0;
  let runningTrades = 0;

  trades.forEach((t, i) => {
    if (t.status === "RUNNING") runningTrades++;
    totalProfit += t.pnl;

    history.innerHTML += `
      <div class="trade">
        <b>${t.index} ${t.strike} ${t.type}</b>
        <span class="badge ${t.status === "RUNNING" ? "running" : "exited"}">${t.status}</span><br>
        <small>${t.date} | Entry: ${t.entryTime} | Exit: ${t.exitTime}</small><br>
        Entry: ₹${t.entry} | SL: ₹${t.sl} | Qty: ${t.qty}<br>
        P&L: ₹${t.pnl.toFixed(2)}

        <div class="logic-box">
          <b>Entry Logic:</b>
          <ul>${t.logic.map(l => `<li>${l}</li>`).join("")}</ul>
        </div>

        ${t.status === "RUNNING"
          ? `<button class="exit-btn" onclick="exitTrade(${i})">EXIT TRADE</button>`
          : ""}
      </div>
    `;
  });

  document.getElementById("total").innerText = trades.length;
  document.getElementById("running").innerText = runningTrades;
  document.getElementById("profit").innerText = "₹" + totalProfit.toFixed(2);
}

renderTrades();
