const form = document.getElementById('contactForm');
const submitBtn = document.getElementById('submitBtn');
const messageDiv = document.getElementById('formResultMessage');

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Disable button
    submitBtn.disabled = true;
    submitBtn.textContent = 'Verzenden...';
    
    // Get form data
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        message: document.getElementById('message').value
    };
    
    try {
        // Send to Cloudflare Worker
        const response = await fetch('/api/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });
        
        const result = await response.json();
        
        if (response.ok) {
            // Success
            messageDiv.className = 'message success show';
            messageDiv.textContent = 'Bedankt! Je bericht is verzonden.';
            form.reset();
        } else {
            // Error
            messageDiv.className = 'message error show';
            messageDiv.textContent = result.error || 'Er ging iets mis. Probeer het later opnieuw.';
        }
    } catch (error) {
        messageDiv.className = 'message error show';
        messageDiv.textContent = 'Er ging iets mis. Probeer het later opnieuw.';
    }
    
    // Re-enable button
    submitBtn.disabled = false;
    submitBtn.textContent = 'Verstuur';
    
    // Hide message after 5 seconds
    setTimeout(() => {
        messageDiv.className = 'message';
    }, 5000);
});