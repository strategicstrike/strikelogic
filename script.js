const liveTrades = [
  {
    date: "08 Jan",
    index: "NIFTY",
    strike: "22150 CE",
    entry: 145,
    t1: 165,
    t2: 185,
    sl: 115,
    status: "Running"
  }
];

const closedTrades = [
  {
    date: "05 Jan",
    index: "NIFTY",
    strike: "22000 PE",
    entry: 135,
    exit: 165,
    pnl: "+₹3,000"
  },
  {
    date: "03 Jan",
    index: "BANKNIFTY",
    strike: "43200 CE",
    entry: 210,
    exit: 140,
    pnl: "-₹4,200"
  }
];

liveTrades.forEach(t => {
  liveTradesBody.innerHTML += `
    <tr>
      <td>${t.date}</td>
      <td>${t.index}</td>
      <td>${t.strike}</td>
      <td>${t.entry}</td>
      <td>${t.t1}</td>
      <td>${t.t2}</td>
      <td>${t.sl}</td>
      <td class="status-running">● ${t.status}</td>
    </tr>`;
});

closedTrades.forEach(t => {
  closedTradesBody.innerHTML += `
    <tr>
      <td>${t.date}</td>
      <td>${t.index}</td>
      <td>${t.strike}</td>
      <td>${t.entry}</td>
      <td>${t.exit}</td>
      <td>${t.pnl}</td>
    </tr>`;
});

const liveTradesBody = document.getElementById("liveTrades");
const closedTradesBody = document.getElementById("closedTrades");
