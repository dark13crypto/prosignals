function showNews() {
    const signalsList = document.getElementById('signalsList');
    const currentPair = getCurrentPair();
    
    signalsList.innerHTML = `
        <h2>Market News</h2>
        <div class="news-container" id="newsContainer">
            <div class="news-card">
                <h3>${currentPair} Market Update</h3>
                <p>Loading latest market analysis...</p>
                <small>Updated: ${new Date().toLocaleTimeString()}</small>
            </div>
        </div>
    `;
    
    fetchMarketNews(currentPair);
}

function showSettings() {
    document.getElementById('settingsModal').style.display = 'block';
}

function closeSettings() {
    document.getElementById('settingsModal').style.display = 'none';
}

function saveSettings() {
    settings.riskLevel = document.getElementById('riskLevel').value;
    settings.notifications = document.getElementById('enableNotifications').checked;
    settings.threshold = parseInt(document.getElementById('signalThreshold').value);
    closeSettings();
    showSignals();
}

// Helper Functions
function getCurrentPair() {
    return document.getElementById('currencyPairSelector').value || 'EURUSD';
}

function getSelectedTimeframe() {
    const activeButton = document.querySelector('.tf-button.active');
    return activeButton ? activeButton.getAttribute('data-tf') : '15';
}

async function fetchMarketNews(pair) {
    const newsContainer = document.getElementById('newsContainer');
    const marketConditions = analyzeMarketConditions();
    
    newsContainer.innerHTML = `
        <div class="news-card">
            <h3>${pair} Technical Analysis</h3>
            <p>Market Sentiment: ${marketConditions.sentiment}</p>
            <p>Trend: ${marketConditions.trend}</p>
            <p>Volatility: ${marketConditions.volatility}</p>
            <small>Updated: ${new Date().toLocaleTimeString()}</small>
        </div>
    `;
}

function analyzeMarketConditions() {
    return {
        sentiment: 'Bullish',
        volatility: 'Medium',
        trend: 'Upward'
    };
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    initializeTimeframeButtons();
    initializeCurrencySelector();
    showSignals();
    setInterval(showSignals, 60000);
});

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