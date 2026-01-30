/**
 * Odysseus Bank - Mockup Navigation & Interactions
 */

// Navigation helper
function navigateTo(url) {
    window.location.href = url;
}

// Initialize navigation links
document.addEventListener('DOMContentLoaded', function() {
    // Auto-redirect for processing page
    if (window.location.pathname.includes('processing.html')) {
        setTimeout(() => {
            navigateTo('success.html');
        }, 2000);
    }

    // Enable "Next" button when account number has enough digits
    const accountInput = document.getElementById('account-input');
    const nextBtn = document.querySelector('button[disabled]');

    if (accountInput && nextBtn) {
        accountInput.addEventListener('input', function() {
            const value = this.value.replace(/\s/g, '');
            if (value.length >= 10) {
                nextBtn.disabled = false;
                nextBtn.classList.remove('bg-gray-200', 'dark:bg-gray-800', 'text-gray-400', 'dark:text-gray-500', 'cursor-not-allowed');
                nextBtn.classList.add('bg-primary', 'text-white', 'cursor-pointer', 'hover:bg-primary/90');
            } else {
                nextBtn.disabled = true;
                nextBtn.classList.add('bg-gray-200', 'dark:bg-gray-800', 'text-gray-400', 'dark:text-gray-500', 'cursor-not-allowed');
                nextBtn.classList.remove('bg-primary', 'text-white', 'cursor-pointer', 'hover:bg-primary/90');
            }
        });
    }

    // Keypad functionality for amount pages
    const keypadBtns = document.querySelectorAll('.keypad-btn');
    const amountDisplay = document.querySelector('[data-amount-display]');

    if (keypadBtns.length > 0 && amountDisplay) {
        let amount = '';

        keypadBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const value = this.textContent.trim();

                if (value === 'backspace' || this.querySelector('.material-symbols-outlined')) {
                    amount = amount.slice(0, -1);
                } else if (value === '.') {
                    if (!amount.includes('.')) {
                        amount += value;
                    }
                } else {
                    amount += value;
                }

                // Format and display
                const formatted = amount ? parseFloat(amount || 0).toFixed(2) : '0.00';
                amountDisplay.textContent = formatted;
            });
        });
    }

    // Quick amount chips
    const quickChips = document.querySelectorAll('[data-quick-amount]');
    quickChips.forEach(chip => {
        chip.addEventListener('click', function() {
            const amount = this.getAttribute('data-quick-amount');
            if (amountDisplay) {
                amountDisplay.textContent = parseFloat(amount).toFixed(2);
            }
            // Update active state
            quickChips.forEach(c => c.classList.remove('bg-primary', 'text-white'));
            this.classList.add('bg-primary', 'text-white');
        });
    });
});

// Dark mode toggle (optional utility)
function toggleDarkMode() {
    document.documentElement.classList.toggle('dark');
}
