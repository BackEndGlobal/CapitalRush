let cash = 10000;
let day = 1;
let selectedStock = null;

const stocks = [
  {
    symbol: "NVT",
    name: "NovaTech",
    price: 120,
    history: [120],
    holdings: 0
  },
  {
    symbol: "APX",
    name: "Apex Energy",
    price: 75,
    history: [75],
    holdings: 0
  },
  {
    symbol: "MTB",
    name: "MetroBank",
    price: 52,
    history: [52],
    holdings: 0
  },
  {
    symbol: "TTM",
    name: "Titan Motors",
    price: 95,
    history: [95],
    holdings: 0
  },
  {
    symbol: "BTW",
    name: "ByteWave AI",
    price: 180,
    history: [180],
    holdings: 0
  }
];

const cashElement = document.getElementById("cash");
const portfolioElement = document.getElementById("portfolio");
const wealthElement = document.getElementById("wealth");
const dayElement = document.getElementById("day");
const stockList = document.getElementById("stock-list");
const holdingsElement = document.getElementById("holdings");
const selectedStockElement = document.getElementById("selected-stock");
const priceElement = document.getElementById("price");
const changeElement = document.getElementById("change");
const quantityElement = document.getElementById("quantity");
const messageElement = document.getElementById("message");
const newsElement = document.getElementById("news");

function updateUI() {
  stockList.innerHTML = "";

  stocks.forEach(stock => {
    const div = document.createElement("div");
    div.className = "stock";

    div.innerHTML = `
      <div>
        <div class="stock-name">${stock.name}</div>
        <small>${stock.symbol}</small>
      </div>

      <div class="stock-price">
        $${stock.price.toFixed(2)}
      </div>
    `;

    div.onclick = () => selectStock(stock);

    stockList.appendChild(div);
  });

  const portfolioValue = stocks.reduce(
    (total, stock) => total + stock.price * stock.holdings,
    0
  );

  cashElement.textContent = `$${cash.toFixed(2)}`;
  portfolioElement.textContent = `$${portfolioValue.toFixed(2)}`;
  wealthElement.textContent = `$${(cash + portfolioValue).toFixed(2)}`;
  dayElement.textContent = `Day ${day} / 30`;

  holdingsElement.innerHTML = "";

  stocks.forEach(stock => {
    if (stock.holdings > 0) {
      holdingsElement.innerHTML += `
        <p>
          <strong>${stock.symbol}</strong>
          — ${stock.holdings} shares
          — $${(stock.price * stock.holdings).toFixed(2)}
        </p>
      `;
    }
  });

  if (holdingsElement.innerHTML === "") {
    holdingsElement.innerHTML = "<p>No holdings yet.</p>";
  }
}

function selectStock(stock) {
  selectedStock = stock;

  selectedStockElement.textContent =
    `${stock.name} (${stock.symbol})`;

  priceElement.textContent =
    `$${stock.price.toFixed(2)}`;

  drawChart(stock);

  messageElement.textContent = "";
}

function buyStock() {
  if (!selectedStock) {
    messageElement.textContent = "Select a stock first.";
    return;
  }

  const quantity = Number(quantityElement.value);

  if (quantity <= 0) {
    messageElement.textContent = "Enter a valid quantity.";
    return;
  }

  const cost = selectedStock.price * quantity;

  if (cost > cash) {
    messageElement.textContent = "Not enough cash.";
    return;
  }

  cash -= cost;
  selectedStock.holdings += quantity;

  messageElement.textContent =
    `Bought ${quantity} ${selectedStock.symbol} shares.`;

  updateUI();
  selectStock(selectedStock);
}

function sellStock() {
  if (!selectedStock) {
    messageElement.textContent = "Select a stock first.";
    return;
  }

  const quantity = Number(quantityElement.value);

  if (quantity > selectedStock.holdings) {
    messageElement.textContent = "You don't own enough shares.";
    return;
  }

  const revenue = selectedStock.price * quantity;

  cash += revenue;
  selectedStock.holdings -= quantity;

  messageElement.textContent =
    `Sold ${quantity} ${selectedStock.symbol} shares.`;

  updateUI();
  selectStock(selectedStock);
}

function advanceDay() {
  if (day >= 30) {
    messageElement.textContent = "The game is over!";
    return;
  }

  day++;

  stocks.forEach(stock => {
    const movement = (Math.random() - 0.5) * 0.2;

    stock.price *= 1 + movement;

    if (stock.price < 1) {
      stock.price = 1;
    }

    stock.history.push(stock.price);

    if (stock.history.length > 30) {
      stock.history.shift();
    }
  });

  const events = [
    "Tech sector sees increased investor interest.",
    "Markets remain cautious after economic data.",
    "A major company announces strong earnings.",
    "Investors move money into safer assets.",
    "AI stocks attract heavy trading activity.",
    "Energy prices fluctuate sharply."
  ];

  newsElement.textContent =
    events[Math.floor(Math.random() * events.length)];

  updateUI();

  if (selectedStock) {
    selectStock(selectedStock);
  }
}

function drawChart(stock) {
  const canvas = document.getElementById("chart");
  const ctx = canvas.getContext("2d");

  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const history = stock.history;

  if (history.length < 2) return;

  const min = Math.min(...history);
  const max = Math.max(...history);

  ctx.beginPath();

  history.forEach((price, index) => {
    const x =
      (index / (history.length - 1)) *
      canvas.width;

    const y =
      canvas.height -
      ((price - min) / (max - min || 1)) *
        canvas.height;

    if (index === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  });

  ctx.strokeStyle = "#3b82f6";
  ctx.lineWidth = 3;
  ctx.stroke();
}

document
  .getElementById("buy")
  .addEventListener("click", buyStock);

document
  .getElementById("sell")
  .addEventListener("click", sellStock);

document
  .getElementById("next-day")
  .addEventListener("click", advanceDay);

updateUI();
