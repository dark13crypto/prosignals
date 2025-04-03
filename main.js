const indicators = calculateIndicators(historicalData[pair]);
    const direction = indicators.rsi > 70 ? 'sell' : indicators.rsi < 30 ? 'buy' : 'neutral';
    const confidence = Math.abs(50 - indicators.rsi);
    
    const div = document.createElement('div');
    div.className = 'signal-card';
    
    const confidenceClass = confidence > 75 ? 'high' : confidence > 50 ? 'medium' : 'low';
    
    div.innerHTML = `
        <h3>${pair}</h3>
        <p>Signal: <span class="signal-${direction}">${direction.toUpperCase()}</span></p>
        <p>Confidence: <span class="confidence-${confidenceClass}">${confidence.toFixed(1)}%</span></p>
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
        <div class="trade-levels">
            <p>Entry: ${rate.toFixed(4)}</p>
            <p>Stop Loss: ${(direction === 'buy' ? rate * 0.998 : rate * 1.002).toFixed(4)}</p>
            <p>Take Profit: ${(direction === 'buy' ? rate * 1.002 : rate * 0.998).toFixed(4)}</p>
        </div>
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
            <h3>EUR/USD Analysis</h3>
            <p>Current trend analysis and key levels</p>
            <small>Updated: ${new Date().toLocaleTimeString()}</small>
        </div>
        <div class="news-card">
            <h3>XAUUSD Technical Analysis</h3>
            <p>Gold price movement and support/resistance levels</p>
            <small>Updated: ${new Date().toLocaleTimeString()}</small>
        </div>
    `;
}

function showSettings() {
    const modal = document.getElementById('settingsModal');
    if (modal) modal.style.display = 'block';
}

function closeSettings() {
    const modal = document.getElementById('settingsModal');
    if (modal) modal.style.display = 'none';
}

function saveSettings() {
    settings.riskLevel = document.getElementById('riskLevel').value;
    settings.notifications = document.getElementById('enableNotifications').checked;
    settings.threshold = parseInt(document.getElementById('signalThreshold').value);
    settings.advancedAnalysis = document.getElementById('enableAdvancedAnalysis').checked;
    closeSettings();
    showSignals();
}

document.addEventListener('DOMContentLoaded', () => {
    showSignals();
    setInterval(showSignals, 60000);
});