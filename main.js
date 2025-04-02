let currentPairs = ['EURUSD', 'GBPUSD', 'USDJPY', 'XAUUSD'];
let lastPrices = {};

const API_URL = 'https://api.exchangerate-api.com/v4/latest/USD';

async function getForexData() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        return data.rates;
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}

async function showSignals() {
    const signalsList = document.getElementById('signalsList');
    signalsList.innerHTML = '<p>Loading signals...</p>';
    
    const rates = await getForexData();
    if (!rates) {
        signalsList.innerHTML = '<p>Error loading data. Please try again.</p>';
        return;
    }
    
    signalsList.innerHTML = '';
    currentPairs.forEach(pair => {
        const signal = createSignalCard(pair, rates);
        signalsList.appendChild(signal);
    });
}

function createSignalCard(pair, rates) {
    const baseCurrency = pair.substring(0, 3);
    const quoteCurrency = pair.substring(3, 6);
    const rate = rates[quoteCurrency] / rates[baseCurrency];
    
    const lastPrice = lastPrices[pair] || rate;
    lastPrices[pair] = rate;
    
    const trend = rate > lastPrice ? 'buy' : 'sell';
    const strength = Math.abs(rate - lastPrice) > 0.0005 ? 'Strong' : 'Weak';
    
    const div = document.createElement('div');
    div.className = 'signal-card';
    div.innerHTML = `
        <h3>${pair}</h3>
        <p>Current Rate: ${rate.toFixed(4)}</p>
        <p>Direction: <span class="signal-${trend}">
            ${trend.toUpperCase()}
        </span></p>
        <p>Signal Strength: ${strength}</p>
        <p>Entry: ${rate.toFixed(4)}</p>
        <p>SL: ${(trend === 'buy' ? rate * 0.998 : rate * 1.002).toFixed(4)}</p>
        <p>TP: ${(trend === 'buy' ? rate * 1.002 : rate * 0.998).toFixed(4)}</p>
    `;
    return div;
}

function showAnalysis() {
    const signalsList = document.getElementById('signalsList');
    signalsList.innerHTML = `
        <div class="tradingview-widget-container">
            <div id="technical-analysis"></div>
        </div>
    `;
    
    new TradingView.widget({
        "width": "100%",
        "height": 500,
        "symbol": "EURUSD",
        "interval": "15",
        "timezone": "Etc/UTC",
        "theme": "dark",
        "style": "1",
        "locale": "en",
        "toolbar_bg": "#f1f3f6",
        "enable_publishing": false,
        "allow_symbol_change": true,
        "container_id": "technical-analysis"
    });
}

function showNews() {
    const signalsList = document.getElementById('signalsList');
    signalsList.innerHTML = `
        <h2>Market News</h2>
        <div class="news-card">
            <h3>EUR/USD Market Update</h3>
            <p>Current trend analysis and key levels</p>
            <small>Updated: ${new Date().toLocaleTimeString()}</small>
        </div>
        <div class="news-card">
            <h3>XAUUSD Technical Analysis</h3>
            <p>Gold price movement and support/resistance levels</p>
            <small>Updated: ${new Date().toLocaleTimeString()}</small>
        </div>
        <div class="news-card">
            <h3>GBP/USD Overview</h3>
            <p>Latest price action and market sentiment</p>
            <small>Updated: ${new Date().toLocaleTimeString()}</small>
        </div>
    `;
}

// Update signals every minute
setInterval(showSignals, 60000);

// Initialize
showSignals();
