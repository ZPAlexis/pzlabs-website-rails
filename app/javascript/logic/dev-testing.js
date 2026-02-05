/*
import { recordCoinCollected } from './api.js';

document.addEventListener('DOMContentLoaded', () => {
    const button = document.getElementById('apiTest');

    if (button) {
        const handleCoinCollection = async () => {
            const coinName = button.dataset.coin || 'UnknownCoin';
            button.disabled = true;
            button.textContent = 'Collecting...';

            try {
                const result = await recordCoinCollected(coinName);
                
                alert(`${coinName} collected successfully!`);
                button.textContent = `Collected! "${coinName}"`;

            } catch (error) {
                alert(`Failed to record coin: ${error.message}`);
                console.error('UI Handler caught:', error);
                button.textContent = `Collect ${coinName} (Failed)`;

            } finally {
                button.disabled = false;
            }
        };

        button.addEventListener('click', handleCoinCollection);
    }
});
*/