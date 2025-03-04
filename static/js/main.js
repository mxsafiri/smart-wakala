/**
 * Smart Wakala - Main JavaScript file
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function(tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // Initialize popovers
    const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
    popoverTriggerList.map(function(popoverTriggerEl) {
        return new bootstrap.Popover(popoverTriggerEl);
    });

    // Auto-hide alert messages after 5 seconds
    const alertList = document.querySelectorAll('.alert');
    alertList.forEach(function(alert) {
        setTimeout(function() {
            const bsAlert = new bootstrap.Alert(alert);
            bsAlert.close();
        }, 5000);
    });

    // Phone number formatting
    const phoneInputs = document.querySelectorAll('input[type="tel"]');
    phoneInputs.forEach(function(input) {
        input.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 0) {
                if (value.length <= 3) {
                    value = '+' + value;
                } else if (value.length <= 6) {
                    value = '+' + value.substring(0, 3) + ' ' + value.substring(3);
                } else if (value.length <= 9) {
                    value = '+' + value.substring(0, 3) + ' ' + value.substring(3, 6) + ' ' + value.substring(6);
                } else {
                    value = '+' + value.substring(0, 3) + ' ' + value.substring(3, 6) + ' ' + value.substring(6, 9) + ' ' + value.substring(9);
                }
            }
            e.target.value = value;
        });
    });

    // Form validation
    const forms = document.querySelectorAll('.needs-validation');
    Array.from(forms).forEach(form => {
        form.addEventListener('submit', event => {
            if (!form.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
            }
            form.classList.add('was-validated');
        }, false);
    });

    // Transaction type change handler
    const transactionTypeSelect = document.getElementById('transactionType');
    if (transactionTypeSelect) {
        transactionTypeSelect.addEventListener('change', function() {
            const amountLabel = document.querySelector('label[for="amount"]');
            if (this.value === 'deposit') {
                amountLabel.textContent = 'Deposit Amount (TSh)';
            } else if (this.value === 'withdrawal') {
                amountLabel.textContent = 'Withdrawal Amount (TSh)';
            } else {
                amountLabel.textContent = 'Transfer Amount (TSh)';
            }
        });
    }
});
