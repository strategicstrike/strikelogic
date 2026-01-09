// ===============================
// STRIKE LOGIC – FINAL SCRIPT.JS
// ===============================

// Load saved trades
let trades = JSON.parse(localStorage.getItem("trades")) || [];

// ADD NEW TRADE
function addTrade() {
  const entry = Number(document.getElementById("entry").value);
  const exit = Number(document.getElementById("exit").value);
  const sl = Number(document.getElementById("stoploss").value);

  if (!entry || !exit || !sl) {
    alert("Please fill Entry, Exit and Stop Loss");
    return;
  }

  const risk = Math.abs(entry - sl);
  const reward = Math.abs(exit - entry);
  const rr = risk !== 0 ? (reward / risk).toFixed(2) : "0";

  const pnl = (exit - entry).toFixed(2);

  const trade = {
    date: document.getElementById("date").value,
    index: document.getElementById("index").value,
    strike: document.getElementById("strike").value,
    type: document.getElementById("type").value,
    entry: entry,
    exit: exit,
    pnl: pnl,
    rr: rr
  };

  trades.push(trade);
  localStorage.setItem("trades", JSON.stringify(trades));

  renderTrades();
  clearForm();
}

// CLEAR FORM AFTER SAVE
function clearForm() {
  document.getElementById("entry").value = "";
  document.getElementById("exit").value = "";
  document.getElementById("stoploss").value = "";
  document.getElementById("strike").value = "";
  document.getElementById("logic").value = "";
}

// RENDER TRADES + DASHBOARD
function renderTrades() {
  const tbody = document.getElementById("history");
  tbody.innerHTML = "";

  let wins = 0;
  let totalPnL = 0;
  let totalRR = 0;
  let maxLoss = 0;

  trades.forEach(trade => {
    const pnl = Number(trade.pnl);

    totalPnL += pnl;
    totalRR += Number(trade.rr);

    if (pnl > 0) wins++;
    if (pnl < maxLoss) maxLoss = pnl;

    tbody.innerHTML += `
      <tr>
        <td>${trade.date}</td>
        <td>${trade.index}</td>
        <td>${trade.strike}</td>
        <td>${trade.type}</td>
        <td>${trade.entry}</td>
        <td>${trade.exit}</td>
        <td style="color:${pnl >= 0 ? '#5cff9d' : '#ff6b6b'}">
          ${pnl}
        </td>
        <td>${trade.rr}</td>
      </tr>
    `;
  });

  // DASHBOARD UPDATE
  document.getElementById("totalTrades").innerText = trades.length;

  document.getElementById("winRate").innerText =
    trades.length ? ((wins / trades.length) * 100).toFixed(1) + "%" : "0%";

  document.getElementById("totalPnL").innerText = totalPnL.toFixed(2);

  document.getElementById("avgRR").innerText =
    trades.length ? (totalRR / trades.length).toFixed(2) : "0";

  document.getElementById("maxLoss").innerText = maxLoss.toFixed(2);
}

// INITIAL LOAD
renderTrades();
