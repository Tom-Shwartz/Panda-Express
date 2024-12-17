import React, { useEffect, useRef, useState } from "react";
import "./CSS/MusicPlayer.css"


function ChangeAudio(inputAudioList,CurrentAudio,setSelectedAudio) {
 let nextIndex = inputAudioList.indexOf(CurrentAudio) + 1;
    if(nextIndex >= inputAudioList.length){
        nextIndex = 0;
    }
        setSelectedAudio(inputAudioList[nextIndex]);
    
}

/**
 * Component that creates a music player that can be interacted with 
 * @component
 * @example
 * <MusicPlayer inputAudioList={AudioList}></MusicPlayer>
 * @param {Array} inputAudioList - array of the strings containing the names for the songs that can be played 
 * @returns {JSX.Element} returns the jsx for the music player menu that displays an interactive music menu
 */
function MusicPlayer({inputAudioList}) {
    const [Volume,setVolume] = useState(0.05);
    const [SelectedAudio,setSelectedAudio] = useState(inputAudioList[0]);
    const musicRef = useRef(null);


    const VolumeUpdate = (event) =>{
        setVolume(event.target.value);
        musicRef.current.volume = event.target.value;
    }
    
    //handles the volume setting on play to avoid issues with audio randomly spiking
    useEffect(()=>{
        musicRef.current.volume = Volume;
    },[SelectedAudio])

    return(
        <div className="audioplayer">
            <audio key={SelectedAudio} autoPlay ref={musicRef}   onEnded={() => ChangeAudio(inputAudioList,SelectedAudio,setSelectedAudio)}>
                <source src={SelectedAudio}></source>
                {console.log(SelectedAudio)}
            </audio>
            <label  className="VolumeLabel"> Volume 
            <input className="VolumeSlider" type="range" min ="0"  max =".3" value={Volume} onChange={VolumeUpdate} step={0.01}></input>
            </label>

            <button className="SkipSongButton"  onClick={() => ChangeAudio(inputAudioList,SelectedAudio,setSelectedAudio)}> <img className = "next-image" alt="next symbol" src="Next.png"></img> Skip </button>
            <button className="PlaySongButton" onClick={ () => musicRef.current.play()}> <img alt="play symbol" className = "play-image"src="Play.jpg"></img> Play </button>
        </div>
    );

}
export default MusicPlayer