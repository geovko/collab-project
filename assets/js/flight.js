//============GOOGLE AUTOCOMPLETE=============//
const center = { lat: 50.064192, lng: -130.605469 };
// Create a bounding box with sides ~10km away from the center point
const defaultBounds = {
  north: center.lat + 0.1,
  south: center.lat - 0.1,
  east: center.lng + 0.1,
  west: center.lng - 0.1,
};
const input = document.getElementById("startLocation");
const options = {
  bounds: defaultBounds,
  componentRestrictions: { country: "us" },
  fields: ["address_components", "geometry", "icon", "name"],
  strictBounds: false,
};
const autocomplete = new google.maps.places.Autocomplete(input, options);

const centerTwo = { lat: 50.064192, lng: -130.605469 };
// Create a bounding box with sides ~10km away from the center point
const defaultBoundsTwo = {
  north: center.lat + 0.1,
  south: center.lat - 0.1,
  east: center.lng + 0.1,
  west: center.lng - 0.1,
};
const inputTwo = document.getElementById("endLocation");
const optionsTwo = {
  bounds: defaultBounds,
  componentRestrictions: { country: "us" },
  fields: ["address_components", "geometry", "icon", "name"],
  strictBounds: false,
};
const autocompleteTwo = new google.maps.places.Autocomplete(inputTwo, optionsTwo);
//============GOOGLE AUTOCOMPLETE END=============//

/*=============== DATE PICKER WIDGET ===============*/
$(function () {
  $('#datepicker').datepicker({
    dateFormat: 'yy-mm-dd', // Example date format
    minDate: 0, // Set minimum date to today
    // Add more options as needed
  });
});

$(function () {
  $('#datepicker1').datepicker({
    dateFormat: 'yy-mm-dd',
    minDate: 0,
    // Add more options as needed
  });
});

// Form submission event listener
document.getElementById('submitForm').addEventListener('click', function(event) {
  // Prevent the default form submission behavior
  event.preventDefault();

  // Get form data
  const fromLocation = document.getElementById('startLocation').value;
  const toLocation = document.getElementById('endLocation').value;
  const departureDate = document.getElementById('datepicker').value;
  const returnDate = document.getElementById('datepicker1').value;

  // Check if any of the form fields are empty
  if (fromLocation.trim() === '' || toLocation.trim() === '' || departureDate.trim() === '') {
    // If any of the fields are empty, show an alert or other message to remind the user to fill in all fields
    alert('Please fill in all required fields.');
    return; // Exit the function without proceeding to the redirection
  }

  // If all fields are filled, proceed with storing data in localStorage and redirecting to the result page
  localStorage.setItem('searchInfo', JSON.stringify({
    fromLocation,
    toLocation,
    departureDate,
    returnDate,
  }));

  // Redirect to result page
  window.location.href = 'flight.html';
});

// Add an event listener to radio buttons
const oneWayOption = document.getElementById('a-option');
const roundTripOption = document.getElementById('b-option');
const returnDateInput = document.getElementById('datepicker1');

oneWayOption.addEventListener('change', function() {
  if (oneWayOption.checked) {
    returnDateInput.disabled = true; // Disable return date input
    returnDateInput.value = ''; // Clear return date input value
  }
});

roundTripOption.addEventListener('change', function() {
  if (roundTripOption.checked) {
    returnDateInput.disabled = false; // Enable return date input
  }
});

