app.createSignalCard = function(pair, rates) {
    try {
        const div = document.createElement('div');
        div.className = 'signal-card';
        
        const rate = rates[pair.substring(3)] / rates[pair.substring(0, 3)];
        const rsi = Math.random() * 100; // Simulado para exemplo
        const direction = rsi > 70 ? 'sell' : rsi < 30 ? 'buy' : 'neutral';
        const confidence = Math.abs(50 - rsi);
        const confidenceClass = confidence > 75 ? 'high' : confidence > 50 ? 'medium' : 'low';

        div.innerHTML = `
            <h3>${pair}</h3>
            <p>Signal: <span class="signal-${direction}">${direction.toUpperCase()}</span></p>
            <p>Confidence: <span class="confidence-${confidenceClass}">${confidence.toFixed(1)}%</span></p>
            <div class="indicator-panel">
                <div class="indicator">
                    <div>RSI</div>
                    <div class="indicator-value">${rsi.toFixed(1)}</div>
                </div>
                <div class="indicator">
                    <div>Price</div>
                    <div class="indicator-value">${rate.toFixed(4)}</div>
                </div>
            </div>
            <div class="trade-levels">
                <p>Entry: ${rate.toFixed(4)}</p>
                <p>Stop Loss: ${(direction === 'buy' ? rate * 0.998 : rate * 1.002).toFixed(4)}</p>
                <p>Take Profit: ${(direction === 'buy' ? rate * 1.002 : rate * 0.998).toFixed(4)}</p>
            </div>`;

        return div;
    } catch (error) {
        console.error('Error creating signal card:', error);
        const errorDiv = document.createElement('div');
        errorDiv.className = 'signal-card error';
        errorDiv.textContent = 'Error loading signal';
        return errorDiv;
    }
};

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    try {
        app.showSignals();
        setInterval(app.showSignals.bind(app), 60000);
    } catch (error) {
        console.error('Initialization error:', error);
    }
});