//============GOOGLE AUTOCOMPLETE=============//
const center = { lat: 50.064192, lng: -130.605469 };
// Create a bounding box with sides ~10km away from the center point
const defaultBounds = {
  north: center.lat + 0.1,
  south: center.lat - 0.1,
  east: center.lng + 0.1,
  west: center.lng - 0.1,
};

function initializeAutocomplete(id, bounds) {
  const input = document.getElementById(id);
  const options = {
    bounds: bounds,
    componentRestrictions: { country: "us" },
    fields: ["address_components", "geometry", "icon", "name"],
    strictBounds: false,
  };
  return new google.maps.places.Autocomplete(input, options);
}

const autocompleteStart = initializeAutocomplete("startLocation", defaultBounds);
const autocompleteEnd = initializeAutocomplete("endLocation", defaultBounds);

function initMap() {
  // Create the map
  var map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: -34.397, lng: 150.644},
      zoom: 8
  });

  // Setup the places autocomplete
  var input = document.getElementById('searchTextField');
  var autocomplete = new google.maps.places.Autocomplete(input);

  // Bind the map's bounds (viewport) property to the autocomplete component
  autocomplete.bindTo('bounds', map);
}


//=============== DATE PICKER WIDGET ===============
function setupDatePicker(id) {
  $(function () {
    $(`#${id}`).datepicker({
      dateFormat: 'mm-dd-yy', // Example date format
      minDate: 0, // Set minimum date to today
    });
  });
}

setupDatePicker('datepicker');
setupDatePicker('datepicker1');

// Form submission event listener
document.getElementById('submitForm').addEventListener('click', function(event) {
  event.preventDefault();

  const startLocation = document.getElementById('startLocation').value;
  const endLocation = document.getElementById('endLocation').value;
  const departureDate = document.getElementById('datepicker').value;
  const returnDate = document.getElementById('datepicker1').value;

  if (startLocation.trim() === '' || endLocation.trim() === '' || departureDate.trim() === '') {
    alert('Please fill in all required fields.');
    return;
  }

  localStorage.setItem('searchInfo', JSON.stringify({
    startLocation,
    endLocation,
    departureDate,
    returnDate,
  }));

  window.location.href = 'flight.html';
});

// Add event listeners to radio buttons
const oneWayOption = document.getElementById('a__option');
const roundTripOption = document.getElementById('b__option');
const returnDateInput = document.getElementById('datepicker1');

oneWayOption.addEventListener('change', function() {
  if (oneWayOption.checked) {
    returnDateInput.disabled = true;
    returnDateInput.value = '';
  }
});

roundTripOption.addEventListener('change', function() {
  if (roundTripOption.checked) {
    returnDateInput.disabled = false;
  }
});

window.onload = function() {
  // Get references to the input fields
  var startLocationInput = document.getElementById("startLocation");
  var endLocationInput = document.getElementById("endLocation");
  var departureDateInput = document.getElementById("datepicker");
  var returnDateInput = document.getElementById("datepicker1");

  // Clear the input fields
  startLocationInput.value = "";
  endLocationInput.value = "";
  departureDateInput.value = "";
  returnDateInput.value = "";
}

