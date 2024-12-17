import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ManagerInterface from './components/ManagerInterface';
import './App.css';
import OrderMenu from './components/OrderMenu';
import StartScreen from './components/StartScreen';
import EmployeeLogin from './components/EmployeeLogin';
import CashierInterface from './components/CashierInterface';
import OrderClass from './Classes/Orders';
import Entrees from './components/Entrees';
import Cart from './components/Cart';
import Sides from './components/Sides';
import MusicPlayer from './components/Musicplayer';
import Extras from './components/Extras';
import { useEffect, useState } from 'react';
const {Combos} = require("./components/Combos");
const AudioList = ["Menu1.mp3","Menu2.mp3","Menu3.mp3","Menu4.mp3","Menu5.mp3"];

/**
 * The main application component that defines
 * routes, initializes the music player, and sets
 * up the language state for the application.
 * @returns {JSX.Element} - The rendered application component.
*/
function App() {

    
    /**
     * Fetches data from the backend API for debugging purposes.
     * @returns {Promise<void>}
     */
    fetch("http://localhost:8080/api")
    .then(response => {
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
      return response.json();
    })
    .then(json => console.log(json))
    .catch(error => console.error("Error:", error));

    const [CurrentLanguage,SetLanguage] =  useState('en');
  return (
    <Router>
      <MusicPlayer inputAudioList={AudioList}></MusicPlayer>
      <Routes>
        <Route path="/" element={ <StartScreen CurrentLanguage = {CurrentLanguage} SetLanguage = {SetLanguage}/>} />
        <Route path = "/Order" element = {<OrderMenu CurrentLanguage = {CurrentLanguage} SetLanguage = {SetLanguage}/>}/>
        <Route path = "/Loginpin" element = {<EmployeeLogin />}/>
        <Route path = "/Cashier" element = {<CashierInterface />} />
        <Route path = "/Manager" element = {<ManagerInterface />} />
        <Route path = "/Combos" element = {<Combos />}/>
        <Route path = "/Entrees" element = {<Entrees />} />
        <Route path = "/Sides" element = {<Sides />} />
        <Route path = "/Extras" element = {<Extras />} />
        <Route path = "/Cart" element = {<Cart />} />
      </Routes>
    </Router>
  );
}

export default App;

  