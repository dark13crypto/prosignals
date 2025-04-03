function initializeTimeframeButtons() {
    const buttons = document.querySelectorAll('.tf-button');
    buttons.forEach(button => {
        button.addEventListener('click', (e) => {
            buttons.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            showSignals();
        });
    });
}

function initializeCurrencySelector() {
    const selector = document.getElementById('currencyPairSelector');
    selector.addEventListener('change', showSignals);
}

function setupTradingViewWidget() {
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
        "container_id": "tradingview-widget"
    });
}

function loadSettings() {
    const savedSettings = localStorage.getItem('forexSettings');
    if (savedSettings) {
        settings = JSON.parse(savedSettings);
        document.getElementById('riskLevel').value = settings.riskLevel;
        document.getElementById('enableNotifications').checked = settings.notifications;
        document.getElementById('signalThreshold').value = settings.threshold;
        document.getElementById('enableAdvancedAnalysis').checked = settings.advancedAnalysis;
    }
}