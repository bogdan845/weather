// check, set and get values from local storage
const setStyles = localStorage.getItem('weatherStyles') ? 
    JSON.parse(localStorage.getItem('weatherStyles')) : {};
localStorage.setItem('weatherStyles', JSON.stringify(setStyles));
const getStylesList = JSON.parse(localStorage.getItem('weatherStyles'));

// get settings btn
const getSettingsBtn = document.getElementById('settings');

// main menu
const getMainMenuBtn = document.getElementById('main-menu');

// button for style options (fonts, colors)
const getStylesBtn = document.getElementById('styles-btn');

// menu with styles (fonts, colors)
const getMenuStyles = document.getElementById('styles-menu');

// menu with colors
const getMenuColor = document.getElementById('colors');

// menu with fonts
const getMenuFont = document.getElementById('fonts');

// block with weather
const getWeatherBlock = document.getElementById('weather-block');

// whole wrap
const getWeatherWrap = document.getElementById('weather-wrap');

// list for cities
const getCitiesList = document.getElementById('cities-list');

// get location (top panel)
const getLocation = document.getElementById('currentLocation');

// Month names
const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec"
];

// Day names
const dayName = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday'
]

// date obj
const date = new Date();

// current date
const currentDate = date.getDate() + ' ' + monthNames[date.getMonth()] + ' ' + date.getFullYear();

// key for obj from json.file
const getDayName = dayName[date.getDay()];


/*
** CLASS UI
*/
class UI {
    constructor() { }

    // setting buttons (settings, styles)
    settings(element, className) {
        element.classList.toggle(className);
    }

    // set active day period
    setActiveDayPeriod(target) {
        if (target.classList.contains('info-list__item')) {
            getWeatherBlock.classList = 'weather-block ' +
                'show-' + target.parentNode.getAttribute('data-period');
        } else { }
    }

    // change font, theme and set local storage for styles
    setStyles(target, neededClass, neededData, key) {
        if (target.classList.contains(neededClass)) {
            getStylesList[key] = target.getAttribute(neededData);
            localStorage.setItem('weatherStyles', JSON.stringify(getStylesList));
        } else { }
    }

    // save selected font and theme to local storage
    saveStyles(obj, element) {
        element.classList = 'weather-wrap';
        for (let key in obj) {
            element.classList += ' ' + obj[key];
        }
    }
}


/*
** UI CLASS INITIALIZATION
*/
const initUI = new UI();


/*
** MENU BUTTON (settings)
*/
getSettingsBtn.addEventListener('click', function (e) {
    this.classList.toggle('active');
    initUI.settings(getMainMenuBtn, 'active');
});


/*
** FONT AND THEME BUTTON
*/
getStylesBtn.addEventListener('click', () => {
    initUI.settings(getMenuStyles, 'active');
});


/*
** CLICK EVENT FOR SHOWING CLICKED PERIOD OF DAY
*/
getWeatherBlock.addEventListener('click', (e) => {
    initUI.setActiveDayPeriod(e.target);
});


/*
** CLICK EVENT FOR COLORS
*/
getMenuColor.addEventListener('click', (e) => {
    initUI.setStyles(e.target, 'menu__color--item', 'data-theme', 'theme');
    initUI.saveStyles(getStylesList, getWeatherWrap);
});


/*
** CLICK EVENT FOR FONTS
*/
getMenuFont.addEventListener('click', (e) => {
    initUI.setStyles(e.target, 'menu__font--item', 'data-font', 'font');
    initUI.saveStyles(getStylesList, getWeatherWrap);
});


/*
** CLASS DATA
*/
class Data {

    constructor() { }

    // output cities
    outputCities(data, element) {
        for (var key in data) {
            element.innerHTML += `<li class="menu__item">${key}</li>`;
        }
    }

    // output weather data
    outputWeather(data, element,city, day) {
        element.innerHTML = '';
        data[city][day].map((item) => {
            element.innerHTML +=
                `<ul class="info-list ${item.time}" data-period=${item.time}>
                    <li class="info-list__item ">
                        ${item.time}
                    </li>
    
                    <li class="info-list__item temperature">
                        ${item.temp}
                    </li>
    
                    <li class="info-list__item">
                        <span class="far fa-calendar-alt"></span>
                        ${currentDate}
                    </li>
    
                    <li class="info-list__item">
                        ${item.wet}
                        <span class="fas fa-tint"></span>
                    </li>
    
                    <li class="info-list__item">
                        <span class="fas fa-wind"></span>
                        ${item.wind}
                    </li>
    
                    <li class="info-list__item">
                        ${item.wea}
                        <span class="fas fa-cloud-sun"></span>
                    </li>
                    <li class="info-list__item" style='width: 100%'>
                        <div class="${item.time + '-weather ' + item.wea}"></div>
                    </li>
                </ul>`;
        });
    }

    // output slected city and country (top panel)
    outputLocaion(element, city, country) {
        element.innerHTML = city + ", " + country;
    }
}


/*
** DATA CLASS INITIALLIZATION
*/
const initData = new Data();


/*
** GET DATA FROM JSON FILE
*/
const getData = async () => {
    const res = await fetch('https://my-json-server.typicode.com/bogdan845/weather-data/db');
    const data = await (res.json());

    // set and output saved styles from local storage with loaded data
    const displayWeather = await( () => {
        (initUI.saveStyles(getStylesList, getWeatherWrap));
        (document.body.classList.remove("awaiting"));
    });
    displayWeather();

    // output citites from data
    initData.outputCities(data, getCitiesList);

    // get created items (cities);
    let getMenuItems = document.getElementsByClassName("menu__item");

    // get city data (city, country)
    let cityData = {};

    // check and set local storage
    let cityInfo = localStorage.getItem("weatherCity") ? 
        localStorage.getItem("weatherCity", JSON.stringify(cityData)) : 
        localStorage.setItem("weatherCity", JSON.stringify({ "city": "Kiev", "country": "Ukraine" }));

    // get values from local storage (city)
    let getCityData = JSON.parse(localStorage.getItem("weatherCity"));

    // click event for each city
    Array.from(getMenuItems).forEach((item) => {
        item.addEventListener('click', function () {

            // close menu
            getSettingsBtn.classList.remove("active");
            getMainMenuBtn.classList.remove("active");

            // get selected values
            cityData = { city: this.innerText, country: data[this.innerText].country }

            // set local storage when click on city
            localStorage.setItem("weatherCity", JSON.stringify(cityData));

            // get values from local storage
            getCityData = JSON.parse(localStorage.getItem("weatherCity"));

            // output weather dynamically for clicked city
            initData.outputWeather(data, getWeatherBlock, getCityData.city, getDayName);
            initData.outputLocaion(getLocation,  getCityData.city,  getCityData.country);
        });
    });

    // output saved weather for current city
    initData.outputWeather(data, getWeatherBlock, getCityData.city, getDayName);
    initData.outputLocaion(getLocation,  getCityData.city,  getCityData.country);
}
getData();


/*
** DISPLAY CURRENT DAY PERIOD
*/
const dayPeriod = (time) => {
    if (time >= 4 && time < 12) {
        getWeatherBlock.classList.add('show-morning');
    } else if (time >= 12 && time < 18) {
        getWeatherBlock.classList.add('show-day');
    } else if (time >= 18 && time <= 23) {
        getWeatherBlock.classList.add('show-evening');
    } else {
        getWeatherBlock.classList.add('show-night');
    }
}
dayPeriod(date.getHours());