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

//============ FLIGHT API =============//
// Get DOM Elements for the second modal content
const rootEl = document.querySelector('#second__modal__content');

const flightType = 'ROUND_TRIP';
    // ONE_WAY ROUND_TRIP
    // using round trip just outputs more information
const flightClass = 'ECO';
    // ECO BUS PEC FST
const arrivalLoc = 'NYC';
const departLoc = 'LON';
const departDate = '2024-10-02';
const returnDate = '2024-10-03';
const passengers = '1';

const searchList = 10;
const rapidApiKey = 'dba5bf0dd6msh430f1928362915fp11ae10jsnb87b31f34026'

function getFlights() {
  const settings = {
      async: true,
      crossDomain: true,
      url: `https://priceline-com-provider.p.rapidapi.com/v1/flights/search?itinerary_type=${flightType}&class_type=${flightClass}&location_arrival=${arrivalLoc}&location_departure=${departLoc}&date_departure=${departDate}&sort_order=PRICE&date_departure_return=${returnDate}&number_of_passengers=${passengers}&price_min=100&price_max=20000`,
      method: 'GET',
      headers: {
          'X-RapidAPI-Key': rapidApiKey,
          'X-RapidAPI-Host': 'priceline-com-provider.p.rapidapi.com'
      }
  };

  $.ajax(settings).done(function (response) {
    for (let i=0; i<searchList; i++) {
        let flightData = response.data.listings[i].slices[0].segments;
        const ticket = document.createElement('div');
        ticket.classList.add('flight-ticket');
        ticket.textContent = '====== Next Flight ======';
        const generalInfo = document.createElement('div');
        generalInfo.classList.add('box'); 

        const div1 = document.createElement('div');
        div1.textContent = `Airline: ${response.data.listings[i].airlines[0].name}`;
        const div2 = document.createElement('div');
        div2.textContent = `Class: ${flightClass}`;
        const div3 = document.createElement('div');
        div3.textContent = `Price: $${response.data.listings[i].totalPriceWithDecimal.price}`;
        const div4 = document.createElement('div');
        div4.textContent = `For: ${passengers} passenger(s), ${flightType}`;
        generalInfo.append(div1);
        generalInfo.append(div2);
        generalInfo.append(div3);
        generalInfo.append(div4);
        
        ticket.append(generalInfo);
        const flightInfo = document.createElement('div');
        flightInfo.classList.add('box'); 
        
        for (let j=0; j<flightData.length; j++) {
            console.log(response);
            
            const departureTime = flightData[j].departInfo.time.dateTime.split('T');
            const arrivalTime = flightData[j].arrivalInfo.time.dateTime.split('T');

            const div5 = document.createElement('div');
            div5.textContent = `-----`;
            const div6 = document.createElement('div');
            div6.textContent = `Flight No.: ${flightData[j].flightNumber}`;
            const div7 = document.createElement('div');
            div7.textContent = `Departure: ${flightData[j].departInfo.airport.name}`;
            const div8 = document.createElement('div');
            div8.textContent = `Date: ${departureTime[0]} at ${departureTime[1]}`;
            const div9 = document.createElement('div');
            div9.textContent = `Arrival: ${flightData[j].arrivalInfo.airport.name}`;
            const div10 = document.createElement('div');
            div10.textContent = `Date: ${arrivalTime[0]} at ${arrivalTime[1]}`;
            
            flightInfo.append(div5);
            flightInfo.append(div6);
            flightInfo.append(div7);
            flightInfo.append(div8);
            flightInfo.append(div9);
            flightInfo.append(div10); 
        }
        ticket.append(flightInfo);
        rootEl.append(ticket);
    }
  });
}

//============ SECOND MODAL =============//
// Get DOM Elements for the second modal
const secondModal = document.querySelector('#second__modal');
const closeSecondBtn = document.querySelector('#closeSecondModal');

// Event listeners for the second modal
closeSecondBtn.addEventListener('click', closeSecondModal);
window.addEventListener('click', outsideClickSecond);

// Open the second modal
function openSecondModal() {
    secondModal.style.display = 'block';
}

// Close the second modal
function closeSecondModal() {
    secondModal.style.display = 'none';
}

// Close the second modal if clicked outside
function outsideClickSecond(e) {
    if (e.target == secondModal) {
        secondModal.style.display = 'none';
    }
}

$(document).ready(function() {
    // When the button inside the first modal is clicked
    $("#submitForm").click(function(event) {
        // Prevent the default form submission behavior
        event.preventDefault();
        // Your code to open the second modal here
        openSecondModal();
        // code to get flight information here
        getFlights()
    });
});

