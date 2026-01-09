const ADMIN_PASSWORD = "225522";
const loginBtn = document.getElementById("loginBtn");
const loginMessage = document.getElementById("loginMessage");
const loginSection = document.getElementById("loginSection");
const adminPanel = document.getElementById("adminPanel");
let IS_ADMIN = false;
let liveTrades = JSON.parse(localStorage.getItem("liveTrades")) || [];
let closedTrades = JSON.parse(localStorage.getItem("closedTrades")) || [];

loginBtn.addEventListener("click", ()=>{
  const pass = document.getElementById("adminPassword").value;
  if(pass===ADMIN_PASSWORD){
    loginSection.classList.add("hidden");
    adminPanel.classList.remove("hidden");
    IS_ADMIN=true;
    renderLiveTrades();
    renderHistory();
  } else { loginMessage.textContent="Incorrect Password!"; loginMessage.style.color="red"; }
});

document.getElementById("addTradeBtn").addEventListener("click",()=>{
  const fileInput=document.getElementById("screenshot");
  const file=fileInput.files[0];
  const reader=new FileReader();
  reader.onload=function(e){
    const trade={
      date:new Date().toLocaleDateString(),
      index:document.getElementById("index").value,
      strike:document.getElementById("strike").value,
      type:document.getElementById("type").value,
      entry:Number(document.getElementById("entry").value),
      sl:Number(document.getElementById("sl").value),
      t1:Number(document.getElementById("t1").value),
      t2:Number(document.getElementById("t2").value),
      t3:Number(document.getElementById("t3").value),
      logic:document.getElementById("logic").value,
      entryTime:new Date().toLocaleTimeString(),
      status:"Running",
      rr1:0, rr2:0, rr3:0,
      chart:e.target.result||null
    };
    const risk=trade.entry-trade.sl;
    trade.rr1=((trade.t1-trade.entry)/risk).toFixed(2);
    trade.rr2=((trade.t2-trade.entry)/risk).toFixed(2);
    trade.rr3=((trade.t3-trade.entry)/risk).toFixed(2);
    liveTrades.push(trade);
    localStorage.setItem("liveTrades",JSON.stringify(liveTrades));
    renderLiveTrades();
    alert("Trade Added Successfully!");
  };
  if(file){reader.readAsDataURL(file);} else {reader.onload({target:{result:null}});}
});

const container=document.getElementById("tradeContainer");
function renderLiveTrades(){
  container.innerHTML="";
  liveTrades.forEach((t,index)=>{
    if(!IS_ADMIN){ container.innerHTML+=`<div class="trade-card"><h3>${t.index} ${t.strike} (${t.type})</h3><p>🔒 Premium Trade</p></div>`; }
    else{
      container.innerHTML+=`<div class="trade-card"><h3>${t.index} ${t.strike} (${t.type})</h3>
        <div class="trade-row"><span>Entry</span><span>${t.entry}</span></div>
        <div class="trade-row"><span>SL</span><span>${t.sl}</span></div>
        <div class="trade-row"><span>T1</span><span>${t.t1} (R:R ${t.rr1})</span></div>
        <div class="trade-row"><span>T2</span><span>${t.t2} (R:R ${t.rr2})</span></div>
        <div class="trade-row"><span>T3</span><span>${t.t3} (R:R ${t.rr3})</span></div>
        <div class="trade-row"><span>Logic</span><span>${t.logic}</span></div>
        <div class="trade-row"><span>Entry Time</span><span>${t.entryTime}</span></div>
        <div class="trade-row status-running"><span>Status</span><span>${t.status}</span></div>
        <button onclick="closeTrade(${index})">Mark as Closed</button>
      </div>`;
    }
  });
}

function closeTrade(index){
  const trade=liveTrades[index];
  const exit=prompt("Enter Exit Price for this trade:");
  if(exit){
    trade.exit=Number(exit);
    const risk=trade.entry-trade.sl;
    const avgTarget=(trade.t1+trade.t2+trade.t3)/3;
    trade.pnl=((trade.exit-trade.entry)*1).toFixed(2);
    trade.rr=((avgTarget-trade.entry)/risk).toFixed(2);
    trade.status="Closed";
    closedTrades.push(trade);
    localStorage.setItem("closedTrades",JSON.stringify(closedTrades));
    liveTrades.splice(index,1);
    localStorage.setItem("liveTrades",JSON.stringify(liveTrades));
    renderLiveTrades(); renderHistory();
  }
}

const historyTable=document.getElementById("historyTable");
function renderHistory(){
  historyTable.innerHTML="";
  closedTrades.forEach(t=>{
    historyTable.innerHTML+=`<tr>
      <td>${t.date}</td>
      <td>${t.index}</td>
      <td>${t.strike}</td>
      <td>${t.entry}</td>
      <td>${t.exit||"-"}</td>
      <td>${t.pnl||"-"}</td>
      <td>${t.rr||"-"}</td>
      <td>${t.chart?`<img src="${t.chart}" width="80"/>`:"-"}</td>
    </tr>`;
  });
}

renderLiveTrades(); renderHistory();
