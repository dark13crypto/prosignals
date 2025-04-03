function calculateMACD(prices) {
    const ema12 = prices.reduce((a, b) => a + b, 0) / prices.length;
    const ema26 = prices.reduce((a, b) => a + b, 0) / prices.length;
    return {
        macd: ema12 - ema26,
        signal: 0,
        histogram: ema12 - ema26
    };
}

function calculateATR(prices) {
    if (prices.length < 2) return 0;
    let sum = 0;
    for(let i = 1; i < prices.length; i++) {
        sum += Math.abs(prices[i] - prices[i-1]);
    }
    return sum / (prices.length - 1);
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
        </div>`;
    
    return div;
}

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    showSignals();
    setInterval(showSignals, 60000);
});