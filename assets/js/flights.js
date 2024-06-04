
//============ FLIGHT API =============//
// Get DOM Elements for the second modal content
const rootEl = document.querySelector('#flight-tickets');
const goingFrom = document.querySelector('#startLocation');
const goingTo = document.querySelector('#endLocation');
const departureDate = document.querySelector('#datepicker');
const arrivalDate = document.querySelector('#datepicker1');
const party = document.querySelector('#adults');
const fareType = document.querySelector('input[name="fareType"]:checked');
const cabinType = document.querySelector('input[name="cabinType"]:checked');

const searchList = 15;
//Available to use once June starts?
//const rapidApiKey = 'dba5bf0dd6msh430f1928362915fp11ae10jsnb87b31f34026';
const rapidApiKey = 'fddfb7654amshf20d9f62b70e3c8p1f2569jsn802e49acdd94';
//localStorage.clear();

function storeData() {
  //console.log(goingFrom.value);
  //console.log(goingTo.value);
  //console.log(departureDate.value);
  //console.log(arrivalDate.value);
  //console.log(party.value);
  //console.log(fareType);
  //console.log(cabinType);  
  
  const flightCard = {
        fromDate: '2024-10-23',
        toDate: '2024-10-27',
        fromLoc: 'NYC',
        toLoc: 'NYC',
        class: 'ECO',
        type: 'ONE_WAY',
        passengers: 1
    }
    // ONE_WAY || ROUND_TRIP
    // ECO || BUS || PEC || FST
    
    let flight = JSON.parse(localStorage.getItem('flight'));
    if (flight == null || flight == '') {
        flight = flightCard;
    }
    localStorage.setItem('flight', JSON.stringify(flight));
    return;
}

function getIataFrom(city) {
    const settings = {
        async: true,
        crossDomain: true,
        url: `https://airports15.p.rapidapi.com/airports?name=${city}&page=1&page_size=10&sorted_by=icao`,
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': rapidApiKey,
            'X-RapidAPI-Host': 'airports15.p.rapidapi.com'
        }
    };

    $.ajax(settings).done(function (response) {        
        for (i=0; i<response.data.length; i++) {
            if (response.data[i].iata_code !== "") {        
                console.log(`Code: ${response.data[i].iata_code}`);

                let flight = JSON.parse(localStorage.getItem('flight'));
                flight.fromLoc = response.data[i].iata_code;
                localStorage.setItem('flight', JSON.stringify(flight));

                return;
            }
        }
        console.log(`No viable IATA-coded airport near ${city}`);
        return;
    });
}

function getIataTo(city) {
    const settings = {
        async: true,
        crossDomain: true,
        url: `https://airports15.p.rapidapi.com/airports?name=${city}&page=1&page_size=10&sorted_by=icao`,
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': rapidApiKey,
            'X-RapidAPI-Host': 'airports15.p.rapidapi.com'
        }
    };

    $.ajax(settings).done(function (response) {        
        for (i=0; i<response.data.length; i++) {
            if (response.data[i].iata_code !== "") {                
                console.log(`Code: ${response.data[i].iata_code}`);

                let flight = JSON.parse(localStorage.getItem('flight'));
                flight.toLoc = response.data[i].iata_code;
                localStorage.setItem('flight', JSON.stringify(flight));
                
                return;
            }
        }
        console.log(`No viable IATA-coded airport near ${city}`);
        return;
    });
}

function getFlights() {
    //const rootEl = document.querySelector('#flight-tickets');

    getIataFrom('Seattle');
    getIataTo('Atlanta');

    let flight = JSON.parse(localStorage.getItem('flight'));
    
    const settings = {
        async: true,
        crossDomain: true,
        url: `https://priceline-com-provider.p.rapidapi.com/v1/flights/search?itinerary_type=${flight.type}&class_type=${flight.class}&location_arrival=${flight.toLoc}&location_departure=${flight.fromLoc}&date_departure=${flight.fromDate}&sort_order=PRICE&date_departure_return=${flight.toDate}&number_of_passengers=${flight.passengers}&price_min=100&price_max=20000`,
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': rapidApiKey,
            'X-RapidAPI-Host': 'priceline-com-provider.p.rapidapi.com'
        }
    };

    $.ajax(settings).done(function (response) {
        console.log('GetFlights');
        console.log(response);

        for (let i=0; i<searchList; i++) {
            let flightData = response.data.listings[i].slices[0].segments;
            const ticket = document.createElement('div');
            ticket.classList.add('flight-ticket'); 
            const generalInfo = document.createElement('div');
            generalInfo.classList.add('box', 'general-info');

            const div1 = document.createElement('div'); 
            div1.append(`$${response.data.listings[i].totalPriceWithDecimal.price}`);
            const div2 = document.createElement('div');
            div2.append(`${flight.class} / ${flight.type} / ${flight.passengers}`);
            const div4 = document.createElement('div');
            div4.append(`${response.data.listings[i].airlines[0].name}`);
            generalInfo.append(div1);
            generalInfo.append(div2);
            generalInfo.append(div4);
            
            ticket.append(generalInfo);
            const flightInfo = document.createElement('div');
            flightInfo.classList.add('box'); 
            
            for (let j=0; j<flightData.length; j++) { 
                const departureDateTime = flightData[j].departInfo.time.dateTime.split('T');
                let departureDate = departureDateTime[0].split('-');
                departureDate = (`${departureDate[1]}.${departureDate[2]}.${departureDate[0]}`);
                let departureTime = departureDateTime[1].split(':');
                departureTime = `${departureTime[0]}:${departureTime[1]}`;
                const arrivalDateTime = flightData[j].arrivalInfo.time.dateTime.split('T');
                let arrivalDate = arrivalDateTime[0].split('-');
                arrivalDate = (`${arrivalDate[1]}.${arrivalDate[2]}.${arrivalDate[0]}`);
                let arrivalTime = arrivalDateTime[1].split(':');
                arrivalTime = `${arrivalTime[0]}:${arrivalTime[1]}`;

                const div5 = document.createElement('div');
                div5.textContent = `Flight #${flightData[j].flightNumber}`;
                const div6 = document.createElement('div');
                div6.textContent = `${flightData[j].departInfo.airport.code} ✈ ${flightData[j].arrivalInfo.airport.code}`;
                const div7 = document.createElement('div');
                div7.textContent = `Dep. ${departureTime}  ${departureDate}`;
                const div9 = document.createElement('div');
                div9.textContent = `Arr. ${arrivalTime}  ${arrivalDate}`;
                flightInfo.append(div5);
                flightInfo.append(div6);
                flightInfo.append(div7);
                flightInfo.append(div9);
                
                if ((j+1) < flightData.length) {
                  const div10 = document.createElement('div');
                  div10.textContent = `⇓`;
                  flightInfo.append(div10); 
                }
            }
            ticket.append(flightInfo);
            rootEl.append(ticket);
        }
    });
}

$(document).ready(function() {
    // When the button inside the first modal is clicked
    storeData();
    console.log('here');
    getFlights();
});

