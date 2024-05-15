$(function() {
  //============ DATEPICKERS =============//
  $("#datepicker, #datepicker1").datepicker({
    minDate: 0 
  });

   //============ BUTTON HANDLER =============//
   $("input[name='fareType']").change(function() {
    var selectedValue = $("input[name='fareType']:checked").val();
    if (selectedValue === "oneWay") {
      $("#datepicker1").datepicker("option", "disabled", true);
    } else {
      $("#datepicker1").datepicker("option", "disabled", false);
    }
  });

  // Call the initMap function to initialize Google Autocomplete
  initMap();
});

//============ GOOGLE AUTOCOMPLETE =============//
const center = { lat: 50.064192, lng: -130.605469 };
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
  var map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: -34.397, lng: 150.644},
      zoom: 8
  });

  var input = document.getElementById('searchTextField');
  var autocomplete = new google.maps.places.Autocomplete(input);

  autocomplete.bindTo('bounds', map);
}

//============ MODAL =============//
// Get DOM Elements
const modal = document.querySelector('#my__modal');
const modalBtn = document.querySelector('#modal__button');
const closeBtn = document.querySelector('.close');

// Events
modalBtn.addEventListener('click', openModal);
closeBtn.addEventListener('click', closeModal);
window.addEventListener('click', outsideClick);

// Open
function openModal() {
  modal.style.display = 'block';
}

// Close
function closeModal() {
  modal.style.display = 'none';
}

// Close If Outside Click
function outsideClick(e) {
  if (e.target == modal) {
    modal.style.display = 'none';
  }
}

$(document).ready(function() {
  // When the button is clicked
  $("#modal__button").click(function(event) {
      // Prevent the default link behavior
      event.preventDefault();
      // Your code to open the modal here
      openModal();
  });
});
