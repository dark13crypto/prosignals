async function showSignals() {
    const signalsList = document.getElementById('signalsList');
    signalsList.innerHTML = '<p>Analyzing market data...</p>';
    
    const rates = await getForexData();
    if (!rates) {
        signalsList.innerHTML = '<p>Error loading data. Retrying...</p>';
        return;
    }
    
    signalsList.innerHTML = '';
    for (const pair of currentPairs) {
        const signal = await createSignalCard(pair, rates);
        signalsList.appendChild(signal);
    }
}

async function createSignalCard(pair, rates) {
    const baseCurrency = pair.substring(0, 3);
    const quoteCurrency = pair.substring(3, 6);
    const rate = rates[quoteCurrency] / rates[baseCurrency];
    
    if (!historicalData[pair]) {
        historicalData[pair] = [];
    }
    historicalData[pair].push(rate);
    if (historicalData[pair].length > 100) {
        historicalData[pair].shift();
    }

    const indicators = await calculateTechnicalIndicators(historicalData[pair]);
    const analysis = analyzeSignals(indicators, rate);
    
    const div = document.createElement('div');
    div.className = 'signal-card';
    
    const confidenceClass = analysis.confidence > 75 ? 'high' : analysis.confidence > 50 ? 'medium' : 'low';
    
    div.innerHTML = `
        <h3>${pair}</h3>
        <p>Current Rate: ${rate.toFixed(4)}</p>
        <p>Signal: <span class="signal-${analysis.direction}">
            ${analysis.direction.toUpperCase()}
        </span></p>
        <p>Confidence: <span class="confidence-${confidenceClass}">
            ${analysis.confidence.toFixed(1)}%
        </span></p>
        <div class="indicator-panel">
            <div class="indicator">
                <div>RSI</div>
                <div class="indicator-value">${indicators.rsi.toFixed(1)}</div>
            </div>
            <div class="indicator">
                <div>MACD</div>
                <div class="indicator-value">${indicators.macd.histogram.toFixed(4)}</div>
            </div>
            <div class="indicator">
                <div>ATR</div>
                <div class="indicator-value">${indicators.atr.toFixed(4)}</div>
            </div>
        </div>
        <p>Entry: ${rate.toFixed(4)}</p>
        <p>SL: ${(analysis.direction === 'buy' ? rate * 0.998 : rate * 1.002).toFixed(4)}</p>
        <p>TP: ${(analysis.direction === 'buy' ? rate * 1.002 : rate * 0.998).toFixed(4)}</p>
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