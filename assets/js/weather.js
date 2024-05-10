// Select the weather form
const weatherForm = document.querySelector('.weather__form');

// Add event listener to the form
weatherForm.addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent form submission
    
    // Redirect to weather.html
    window.location.href = 'weather.html';
});

