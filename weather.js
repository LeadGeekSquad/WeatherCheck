require('dotenv').config();

document.getElementById("getWeatherBtn").addEventListener('click',() => {

    //getting the location value from cityInput
    const location = document.getElementById("cityInput").value;

    //if location is empty, we return from here and ask to enter the city name
    if(location === "") {
        const empty = document.getElementById("weatherResult");
        empty.innerHTML = `
                            <h4 style="color:red;">Please enter the city name</h4>
                          `;
        return;                  
    }

    //checking the response
    //if any other response code other than 200 we return error
    const checkResponse = ((response) => {
        const resp_code = response.status;

        return response.json().then(body => {
            if(resp_code === 200) {
                return body;
            } else {
                //throw new Error(`Error ${body.error.code}: ${body.error.message}`);
                throw new Error(`Error: ${body.error.message}`);
            }
        });
    });

    //if the response seems to be valid, we fetch the weather details
    const getWeatherInfo = ((data) => {

        const condition_icon_url = "https:"+data.current.condition.icon;
        const condition_icon_text = data.current.condition.text;

        const result = document.getElementById("weatherResult");
        // result.innerText = Math.round(data.current.temp_c) + "° C" + "\n" + 
        //                    Math.round(data.current.temp_f) + "° F" + "\n" +
        //                    "Condition: " + data.current.condition.text + "\n" +
                           
        //                    "Name: " + data.location.name + "\n" +
        //                    "Region: " + data.location.region + "\n" +
        //                    "Country: " + data.location.country + "\n" +
        //                    "LocalTime: " + data.location.localtime ;

        result.innerHTML = `
                            <h3> ${data.location.name} </h3>
                            <h4> ${Math.round(data.current.temp_c)}° C </h4>
                            <h4> ${Math.round(data.current.temp_f)}° F </h4>
                            <h4> ${data.current.condition.text} </h4>
                            <img src="${condition_icon_url}" alt="${condition_icon_text}" style="width: 90px; height: 90px; vertical-align: middle; margin-top: 5px"><br>
                            Region: ${data.location.region}<br>
                            Country: ${data.location.country}<br>
                            LocalTime: ${data.location.localtime}
                            `;
        

    });

    //if any error is thrown from the above methods, it will be caught here
    const getError = ((error) => {
        console.error('Error:', error.message);
        const show_error = document.getElementById("weatherResult");
        //show_error.innerText = error.message;
        show_error.innerHTML = `<h4 style="color:red;">${error.message}</h4><br>
                                <h4 style="color:red;">Please enter a valid name of the city.</h4>
                                `;
    })
    
    const API_KEY = process.env.WEATHER_API_KEY ;
    //fetching the data and using input location in the api request
    const obj = fetch(`https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${location}&aqi=yes`);

    //using the object with promises
    obj
    .then(response=>checkResponse(response))
    .then(data=>getWeatherInfo(data))
    .catch(error=>getError(error));
})