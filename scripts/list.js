window.addEventListener('load', () => {
    checkFunc();
    fetchData();
});

function myFunction() {
    toggleViews("map-view", "list-view");
}

function myFunction1() {
    toggleViews("list-view", "map-view");
}

function toggleViews(showId, hideId) {
    document.getElementById(showId).style.display = "flex";
    document.getElementById(hideId).style.display = "none";
}

async function checkFunc() {
    try {
        const x = document.getElementById("loginHeader");
        const y = document.getElementById("logoutHeader");

        if (localStorage.getItem("username") === "admin" && localStorage.getItem("password") === "admin") {
            x.style.display = "none";
            y.style.display = "flex";
            document.getElementById("paybutton").disabled = false;
        } else {
            y.style.display = "none";
            x.style.display = "flex";
        }
    } catch (error) {
        console.error("Error in checkFunc:", error);
    }
}

const urlParams = new URLSearchParams(window.location.search);
const cityName = urlParams.get('city');

const locationApiUrl = `https://tripadvisor16.p.rapidapi.com/api/v1/hotels/searchLocation?query=${cityName}`;
const hotelsApiBaseUrl = 'https://tripadvisor16.p.rapidapi.com/api/v1/hotels/';

const options = {
    method: 'GET',
    headers: {
        'X-RapidAPI-Key': 'f9cede9f3cmsh377fec5d24089dcp108e87jsnf6f62198673b',
        'X-RapidAPI-Host': 'tripadvisor16.p.rapidapi.com'
    }
};

async function fetchData() {
    try {
        await delay(1000);

        const locationResponse = await fetch(locationApiUrl, options);
        const locationResult = await locationResponse.json();

        const geoId = locationResult.data[0]?.geoId;
        if (geoId) {
            updateUI(geoId);
        } else {
            console.error('Invalid response from searchLocation API');
        }
    } catch (error) {
        console.error("Error in fetchData:", error);
    }
}

async function updateUI(cityGeoId) {
    const checkInDate = '2024-01-11';
    const checkOutDate = '2024-09-05';

    const hotelsApiUrl = `${hotelsApiBaseUrl}searchHotels?geoId=${cityGeoId}&checkIn=${checkInDate}&checkOut=${checkOutDate}`;

    try {
        const hotelsResponse = await fetch(hotelsApiUrl, options);
        const hotelsResult = await hotelsResponse.json();

        if (hotelsResult.data.data && hotelsResult.data.data.length > 0) {
            populateList(hotelsResult.data.data);
        } else {
            console.error('No hotels found');
        }
    } catch (error) {
        console.error("Error in updateUI:", error);
    }
}

function populateList(hotelsData) {
    const listContainer = document.getElementById("list-view");

    hotelsData.forEach((hotel) => {
        const hotelItem = document.createElement("div");
        hotelItem.classList.add("hotel-list-item");

        // Replace {width} and {height} with actual values, e.g., 800 and 600
        const imageSrc = hotel.cardPhotos[0].sizes.urlTemplate
            .replace('{width}', 200)
            .replace('{height}', 200);

        hotelItem.innerHTML = `
            <div class="image"><img src="${imageSrc}" alt="${hotel.title}"></div>
            <div class="textDiv">
                <h3>${hotel.title}</h3>
                ${generateStarRating(hotel.bubbleRating.rating)}
                <p>${hotel.secondaryInfo}</p>
            </div>
        `;

        listContainer.appendChild(hotelItem);
    });
}


function generateStarRating(rating) {
    // Implement logic to generate star icons based on the rating
    // You may use Font Awesome or other icon libraries for this
    // Example: <span class="fa fa-star checked"></span>
    return "<span>Star Rating: " + rating + "</span>";
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}