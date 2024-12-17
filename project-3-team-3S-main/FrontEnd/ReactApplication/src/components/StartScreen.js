import { useNavigate } from 'react-router-dom';
import './CSS/StartScreen.css';
import APIFetcher from '../Classes/ApiFecther';
import { useEffect, useState} from 'react';
import Translator from './Translator';
import Popup from 'reactjs-popup';
import LanguagePopup from './Language';
import MusicPlayer from './Musicplayer';
import OrderMenu from './OrderMenu.js';


const EXTAPI = new APIFetcher();
const WeatherData = await EXTAPI.GetWeather("College Station","US");

/**
 * Displays the start screen of the application,
 * including weather information, a clock, and navigation buttons.
 * @param {string} CurrentLanguage - The current language code for translations.
 * @param {function} SetLanguage - Function to update the current language.
 * @returns {JSX.Element} - The rendered StartScreen component.
 */
function StartScreen({CurrentLanguage,SetLanguage}) {

  const [LanguagePopupStatus,SetLanguagePopupStatus] = useState(false);
  const[CurrentTime,SetCurrentTime] = useState(new Date());
  const[CurrentDisplay,SetCurrentDisplay] = useState("");
  const [CurrentWeather,SetCurrentWeather] = useState(WeatherData.weather[0].main);
  const [isAccessibilityMode, setIsAccessibilityMode] = useState(false);

   /**
    * Toggles the accessibility mode for the application.
    * @returns {void}
    */
    const toggleAccessibility = () => {
        setIsAccessibilityMode((prev) => !prev);
    };
   

  //handles the real time clock behavior
  useEffect(() => {
  const current_interval = setInterval(()=>{
    SetCurrentTime((new Date()));
   },1000);
   return () => clearInterval(current_interval);
  },[])

  //allows for realtime update of photo based on current weather AND TIME
  useEffect(()=>{

      if(CurrentTime.getHours == 3){
        SetCurrentDisplay("Darkness");
      }
      else if(CurrentTime.getHours() >=  6 && CurrentTime.getHours() < 18){
        SetCurrentDisplay(CurrentWeather +"_DAY");
      }
      else{
        SetCurrentDisplay(CurrentWeather +"_NIGHT");
      }
      console.log(CurrentTime.getHours());
  },[CurrentDisplay,CurrentTime])


    const navigate = useNavigate();


  /**
   * Handles navigation to the order page.
   * @returns {void}
   */
  const handleStartOrder = () => {
    //BackgroundAudio.play(); commenting out while testing
    navigate("/Order");
  };


  /**
   * Handles navigation to the login pin page when the logo is clicked.
   * @returns {void}
   */
  const handleLogoClick = () => {
    navigate("/Loginpin");
  };

  return (
    <div className="welcome-screen">
      

      <button onClick={handleLogoClick} className="logo-button">
        <img src="pngegg.png" alt="Panda Logo" className="panda-logo" />
      </button>
      <div className='weather-display'>
        
        <img src={CurrentDisplay+'.gif'} alt='Weather status' className='WeatherState'></img>
      <Translator text = {"Current Weather: "+ WeatherData.weather[0].description} language={CurrentLanguage}></Translator>
      <br></br>
      <Translator  text="Current Temperature" language={CurrentLanguage} /> {((WeatherData.main.temp - 273.15) * 1.8 + 32).toFixed(2)}°F
      <br></br>
      { CurrentTime.toLocaleString()}
      </div>
      <button className="start-order-button" onClick={handleStartOrder}> <Translator  text="Start Order" language={CurrentLanguage} /> </button>

      <Popup  id = "LanguagePopup" className='LanguagePopup' open={LanguagePopupStatus} onClose={() => {SetLanguagePopupStatus(false)}}>
        <button className="LangCloseBtn" onClick={() => {SetLanguagePopupStatus(false)}}> X </button>
        <LanguagePopup className = "LanguagePopupContent"SetLanguagePopupStatus={SetLanguagePopupStatus} CurrentLanguage={CurrentLanguage} SetLanguage={SetLanguage}></LanguagePopup>
      </Popup>
    
      <div className="bottom-buttons">
        <button className="bottom-button" onClick={() => {SetLanguagePopupStatus(true)}} > <Translator  text="Language" language={CurrentLanguage} /> 🗣️</button>
    
      </div>
    </div>
  );
}

export default StartScreen;
