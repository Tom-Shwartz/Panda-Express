const GoogleKey = process.env.REACT_APP_GOOGLE_KEY;
const WeatherKey = process.env.REACT_APP_WEATHER_KEY;
/**
 * Class that handles the external api calls to Google translate and the open weather api 
 * @class
 * @example
 * DB = new ApiFecther(); 
 * const weatherdata = DB.GetWeather(CollegeStation,US);
 */
class APIFetcher {


    constructor() {
       
        this.GoogleKey = GoogleKey;
        this.WeatherKey = WeatherKey;
        this.WeatherURL = "https://api.openweathermap.org/data/2.5/weather";
    }

    //gets weather data to access temp use
    async GetWeather(CityName,CountryCode) {
      
       const response = await fetch(this.WeatherURL+`?q=${CityName},${CountryCode}&appid=${this.WeatherKey}`);

        if(!(response.ok)) {
            throw new Error(' Can\'t reach weather api ');
        }

        const data = await response.json();
        console.log("following weather data is below");
        console.log(data);
        return data;
        
    }

    async GetTranslation(InputText, Language){
       const request = new URLSearchParams({
            q: InputText,
            target: Language,
            Format : 'text',
            key: GoogleKey
        });
        

        try {
            //note google api v2 doesn't use json but urlencoded instead
            const response = await fetch(`https://translation.googleapis.com/language/translate/v2`,{
                method: 'POST',
                headers:{
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: request.toString(),
            });
        
            if(!response.ok){
                throw new Error('Can\'t reach google services');
            }

            const data = await response.json();
        
          
            console.log("APi Translation response: " + data.data.translations[0].translatedText);
            
            return data.data.translations[0].translatedText;
         
        }
        catch (error) {
            console.error("Error getting translation", error);
            throw new Error("Failed to get translation")
        }

    }

}

export default APIFetcher