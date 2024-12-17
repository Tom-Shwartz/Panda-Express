import React, { useEffect, useState } from "react";
import APIFetcher from '../Classes/ApiFecther';
var EXTAPI = new APIFetcher();


    

    //Allows for the data to be retained even on refresh to prevent unnecessary api calls
 
    function StoreCacheMap(CacheMap){
      const CacheMapArray = Array.from(CacheMap.entries());
      localStorage.setItem("CachedTranslations",JSON.stringify(CacheMapArray));
    }

    function GetCacheMap(){
        const CacheMapArray = JSON.parse(localStorage.getItem("CachedTranslations"));
        if(CacheMapArray){
            return new Map(CacheMapArray);
        }
        else{
            return new Map();
        }
    }
/**
 * Creates the popup content which is a menu that allows the toggling and updating of the language used by Translator 
 * @component
 * @example
 * <Translator text = {"Current Weather: "+ WeatherData.weather[0].description} language={CurrentLanguage}></Translator>
 * 
 * @param {string} text - String containing text that will be translated
 * @param {string} language - String containing the current google language code used by Translator
 * @param {string} mode - String that contains the current mode or context the translator is being used in 
 * @returns {JSX.Element} - Returns the jsx for the content to be used by the popup
 */
function Translator({text,language,mode = "customer"}) { 
   
    const [translatedText,setTranslation] = useState(text);
    const [Cached_Translation,setCacheMap] = useState(GetCacheMap());
    
    let key = text+"_"+language;
    
    useEffect(() => { 
        
        async function TranslateText() {
            
            if(language !== 'en' && mode !== 'cashier'){
                if(Cached_Translation.has(key) && mode !== 'cashier'){
                    console.log("using cached translation:" + Cached_Translation.get(key) );

                    setTranslation(Cached_Translation.get(key));
                }
                else if(!Cached_Translation.has(key) && mode !== 'cashier'){
                    
                    
                    const Translation = await EXTAPI.GetTranslation(text,language);
                    console.log(Translation);
                    console.log("getting language through api call");
                    const TempMap =  (new Map(Cached_Translation));  
                    TempMap.set(key,Translation);
                    setCacheMap(TempMap);
                    setTranslation(Translation);
                    StoreCacheMap(TempMap);
                    console.log(key);
                }
            }
            else{
                setTranslation(text);
            }
            
        }
        TranslateText();
       
    },[text,language]);


    return translatedText;
}
export default Translator