import React from "react";
import Translator from "./Translator";
import "./CSS/Language.css";
/**
 * Creates the popup content which is a menu that allows the toggling and updating of the language used by Translator 
 * @component
 * @example
 *  <LanguagePopup className = "LanguagePopupContent"SetLanguagePopupStatus={SetLanguagePopupStatus} CurrentLanguage={CurrentLanguage} SetLanguage={SetLanguage}></LanguagePopup>
 * @param {string} CurrrentLanguae - String containing the current google language code used by Translator
 * @param {Function} SetLanguage - Function that updates the current Lanugage code 
 * @returns {JSX.Element} - Returns the jsx for the content to be used by the popup
 */
function LanguagePopup({CurrentLanguage,SetLanguage}) {


    return (

        <div className="LangaugeContent">
            <label className="LanguageText" ><Translator text="Choose a Language" language={CurrentLanguage}></Translator> </label>
            <div className="Language-grid">
            <button className="LanguageBtn" onClick={() => {SetLanguage("en")}}>English</button>
            <button className="LanguageBtn" onClick={() => {SetLanguage("es")}}>Español</button>
            <button className="LanguageBtn" onClick={() => {SetLanguage("ja")}}>日本語</button>
            <button className="LanguageBtn" onClick={() => {SetLanguage("hi")}}>हिन्दी</button>
            <button className="LanguageBtn" onClick={() => {SetLanguage("zh-CN")}}>中文 (简体)</button>
            <button className="LanguageBtn" onClick={() => {SetLanguage("ar")}}>العربية</button>
            </div>
            <div className="Current-Language-Display">
            <label> <Translator text="Current Language:" language={CurrentLanguage}></Translator> </label>
                <br></br>
                {
                    ((CurrentLanguage === "es")&&(<text> Español </text>)) ||
                    ((CurrentLanguage === "en")&&(<text> English </text>)) ||
                    (CurrentLanguage === "ja")&&(<text> 日本語 </text>) ||
                    (CurrentLanguage === "hi")&&(<text> हिन्दी </text>) ||
                    (CurrentLanguage === "zh-CN")&&(<text> 中文 </text>) ||
                    (CurrentLanguage === "ar")&&(<text> العربية </text>) 
                }
            
            </div>
        </div>
    );
}

export default LanguagePopup;