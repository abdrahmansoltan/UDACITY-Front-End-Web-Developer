/* Global Variables */

// Create a new date instance dynamically with JS
let d = new Date();
let newDate = d.toDateString(); // to get a better date format than it was written

// URL to retrieve weather info from api and the default country is USA
const baseURL = "https://api.openweathermap.org/data/2.5/weather?zip=";
// personal api key and adding to it "&units=metric" to get the tempreture in celsius unit
const apiKey = ",&appid=43fec62a8d6f0c1e4dd2c266d79261f0&units=metric";

// server link to post data
const server = "http://localhost:5500";

// content variables
let date = document.querySelector("#date");
let temp = document.querySelector("#temp");
let city = document.querySelector("#city");
let desc = document.querySelector("#desc");
let content = document.querySelector("#content");

/* Functions */
const generateData = () => {
  // value that the user types into the input and textarea
  const zip = document.querySelector("#zip").value,
    feeling = document.querySelector("#feelings").value;

  // weatherData return promise
  weatherData(zip).then((dt) => {
    if (dt) {
      const {
        main: { temp },
        name: city,
        sys: { country },
        weather: [{ description, icon }],
      } = dt;
      const info = [newDate, Math.round(temp), city, description, feeling, icon, country];
      postData(`${server}/add`, info);
      // calling updateUI function
      updateUI();
    }
  });
};
// to get weather data from api
const weatherData = async (zip) => {
  try {
    const res = await fetch(`${baseURL}${zip}${apiKey}`);
    const data = await res.json();
    if (data.cod != 200) {
      alert(data.message);
    }
    return data;
  } catch (error) {
    alert(`error: ${error}`);
  }
};

// postData function
const postData = async (url = "", info = []) => {
  const res = await fetch(url, {
    method: "POST",
    // credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(info), // body data type must match "Content-Type" header
  });

  try {
    const newData = await res.json();
    console.log("New Data: ", newData);
    return newData;
  } catch (error) {
    alert(`error: ${error}`);
  }
};

// function to get project data and update UI using this data
const updateUI = async () => {
  const res = await fetch(`${server}/all`);
  try {
    const finalData = await res.json();
    date.innerHTML = finalData[0];
    temp.innerHTML = `<img src="https://openweathermap.org/img/w/${finalData[5]}.png" alt"" /> ${finalData[1]}&deg;C`;
    city.innerHTML = `${finalData[2]}, ${finalData[6]}`;
    desc.innerHTML = finalData[3];
    content.innerHTML = finalData[4];
  } catch (error) {
    alert(`error: ${error}`);
  }
};

/* Event Listener */
// event listener to execute the generateData function when user click on the button
document.querySelector("#generate").addEventListener("click", generateData);