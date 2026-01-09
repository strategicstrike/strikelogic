body {
  margin: 0;
  font-family: Arial, sans-serif;
  background: #0b0f1a;
  color: #fff;
}

.hero {
  text-align: center;
  padding: 60px 20px;
  background: linear-gradient(#0b0f1a, #11172a);
}

.hero h1 {
  font-size: 40px;
  color: #4da6ff;
}

.hero-stats {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin: 30px 0;
  flex-wrap: wrap;
}

.box {
  background: #11172a;
  padding: 20px;
  border-radius: 10px;
  min-width: 160px;
}

.box.green h2 { color: #5cff9d; }
.box.red h2 { color: #ff6b6b; }

.cta {
  padding: 12px 25px;
  background: gold;
  border: none;
  border-radius: 6px;
  font-weight: bold;
}

.section {
  padding: 40px 20px;
  max-width: 1100px;
  margin: auto;
}

h2 {
  margin-bottom: 15px;
}

table {
  width: 100%;
  border-collapse: collapse;
  background: #11172a;
  border-radius: 10px;
  overflow: hidden;
}

th, td {
  padding: 12px;
  text-align: center;
}

th {
  background: #0f1530;
}

.status-running {
  color: #5cff9d;
}

.grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.card {
  background: #11172a;
  padding: 20px;
  border-radius: 10px;
}

.chart {
  background: #11172a;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.fake-chart {
  opacity: 0.6;
}

.stats-row {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
}

.profit {
  color: #5cff9d;
}

.status-hit {
  color: gold;
}

.disclaimer {
  background: #11172a;
  padding: 30px;
  text-align: center;
}

.warning {
  color: gold;
}
