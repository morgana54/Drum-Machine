import React, { useRef, useState } from 'react';
import './index.css'

const bankOne = [
  {
    keyCode: 81,
    keyTrigger: 'Q',
    id: 'Heater-1',
    url: 'https://s3.amazonaws.com/freecodecamp/drums/Heater-1.mp3'
  },
  {
    keyCode: 87,
    keyTrigger: 'W',
    id: 'Heater-2',
    url: 'https://s3.amazonaws.com/freecodecamp/drums/Heater-2.mp3'
  },
  {
    keyCode: 69,
    keyTrigger: 'E',
    id: 'Heater-3',
    url: 'https://s3.amazonaws.com/freecodecamp/drums/Heater-3.mp3'
  },
  {
    keyCode: 65,
    keyTrigger: 'A',
    id: 'Heater-4',
    url: 'https://s3.amazonaws.com/freecodecamp/drums/Heater-4_1.mp3'
  },
  {
    keyCode: 83,
    keyTrigger: 'S',
    id: 'Clap',
    url: 'https://s3.amazonaws.com/freecodecamp/drums/Heater-6.mp3'
  },
  {
    keyCode: 68,
    keyTrigger: 'D',
    id: 'Open-HH',
    url: 'https://s3.amazonaws.com/freecodecamp/drums/Dsc_Oh.mp3'
  },
  {
    keyCode: 90,
    keyTrigger: 'Z',
    id: "Kick-n'-Hat",
    url: 'https://s3.amazonaws.com/freecodecamp/drums/Kick_n_Hat.mp3'
  },
  {
    keyCode: 88,
    keyTrigger: 'X',
    id: 'Kick',
    url: 'https://s3.amazonaws.com/freecodecamp/drums/RP4_KICK_1.mp3'
  },
  {
    keyCode: 67,
    keyTrigger: 'C',
    id: 'Closed-HH',
    url: 'https://s3.amazonaws.com/freecodecamp/drums/Cev_H2.mp3'
  }
];


const bankTwo = [
  {
    keyCode: 81,
    keyTrigger: 'Q',
    id: 'Chord-1',
    url: 'https://s3.amazonaws.com/freecodecamp/drums/Chord_1.mp3'
  },
  {
    keyCode: 87,
    keyTrigger: 'W',
    id: 'Chord-2',
    url: 'https://s3.amazonaws.com/freecodecamp/drums/Chord_2.mp3'
  },
  {
    keyCode: 69,
    keyTrigger: 'E',
    id: 'Chord-3',
    url: 'https://s3.amazonaws.com/freecodecamp/drums/Chord_3.mp3'
  },
  {
    keyCode: 65,
    keyTrigger: 'A',
    id: 'Shaker',
    url: 'https://s3.amazonaws.com/freecodecamp/drums/Give_us_a_light.mp3'
  },
  {
    keyCode: 83,
    keyTrigger: 'S',
    id: 'Open-HH',
    url: 'https://s3.amazonaws.com/freecodecamp/drums/Dry_Ohh.mp3'
  },
  {
    keyCode: 68,
    keyTrigger: 'D',
    id: 'Closed-HH',
    url: 'https://s3.amazonaws.com/freecodecamp/drums/Bld_H1.mp3'
  },
  {
    keyCode: 90,
    keyTrigger: 'Z',
    id: 'Punchy-Kick',
    url: 'https://s3.amazonaws.com/freecodecamp/drums/punchy_kick_1.mp3'
  },
  {
    keyCode: 88,
    keyTrigger: 'X',
    id: 'Side-Stick',
    url: 'https://s3.amazonaws.com/freecodecamp/drums/side_stick_1.mp3'
  },
  {
    keyCode: 67,
    keyTrigger: 'C',
    id: 'Snare',
    url: 'https://s3.amazonaws.com/freecodecamp/drums/Brk_Snr.mp3'
  }
];

const DrumButton = ({url, trigger, keyCode, volume}) => {
  const [active, setActive] = useState(false)
  const audioRef = useRef()
 
  // o co chodzi z tymi eventami dokładnie w listenerach?
  // czemu działa bez '[]' z tym returnem, i na odwrót, ale wywala błąd jeśli nie ma obu? 
    // zapytać jednak potem Kacpra czemu nie działało to rozwiązanie i jak dokładnie działa ten hook useRef i kiedy current się przypisuje
  // zapytać także kacpra o działanie tego add event listenera i że ten drugi return rozumiem się nie wykona zanim event się nie stanie tak??

  React.useEffect(() => {
    document.addEventListener('keydown', handleKeyPress)
    // czemu gość robi to w filmiku? skoro działa bez? jaka jest tego logika?
    // return () => document.removeEventListener('keydown', handleKeyPress)
  }, [])

  function playSound() {
    audioRef.current.currentTime = 0
    audioRef.current.play()
    audioRef.current.volume = volume / 100
    setActive(true)
    setTimeout(() => setActive(false), 200)
  }

  function handleKeyPress(event) {  
    if(event.keyCode === keyCode) {
      playSound()
    } else {
      return
    } 
  }

  return (
    <div className={`drum-pad ${active && "drum-pad--active"}`} onClick={playSound}>
      <audio ref={audioRef} src={url}></audio>
      {trigger}
    </div>
  );
}

const InfoBox = ({volume}) => {
  // tutaj będziesz używał warunków żeby w danym momencie zdisplayować jedną rzecz lub inną
  return (<p>Volume: {volume}</p>);
}

const VolumeSlider = ({volume, changeVolume}) => {
  return (
    <div>
      <input onChange={changeVolume} value={volume} type="range" min="0" max="100" />
    </div>
  );
}

// TWÓJ CEL: przekazać volume z Controls Container do DrumButton


const ControlsContainer = ({volume, changeVolume}) => {
  

  return (
    <div>
      <InfoBox volume={volume}/>
      <VolumeSlider volume={volume} changeVolume={changeVolume}/>
    </div>  
  );
}

function App () {
const [volume, setValue] = React.useState(50)

function changeVolume(event) {
    // change volume variable
    // to powoduje także ponowny rendering
    setValue(event.target.value)
}

    return (
    <div className="wrapper">
        <div className="drums-container" id="drum-machine">
        <h2>Play the Drums!</h2>      
        {bankOne.map(clip =>  
        <DrumButton 
        clip={clip}
        key={clip.id} 
        url={clip.url} 
        trigger={clip.keyTrigger}
        keyCode={clip.keyCode} 
        volume={volume}/> 
        )}
        {/* przez ten cntrlcontainer mozesz przekazac propsy do infoboxa, jakby przez dwa komponenty po kolei */}
        <ControlsContainer />
        </div> 
    </div>
    )
}

export default App;


// POWER i BANK COMPONENTS NA KONIEC!!
// A NA SAM SAM SAM SAMIUTKI KONIEC: dodaj wszędzie komentarze żeby powtórzyć kod i jeszcze lepiej wszystko zrozumieć

// TASKI:
// - volume połączyć z guzikami 
// - triggery żeby się wyświetlały w InfoBoxie




// info do hooków: ZROBIĆ TEŻ TAK Z INNYMI OGLĄDAJĄC FILMIKI!!!!
// useState:
// - jeśli wywołasz funkcję w useState, zamiast dawać samą wartość, to przypisze (wywoła) się ona tylko raz, a standardowo dzieje się to za każdym razem(10:45 Kyle video) (it enhances performance)
// - używaj funckji z parametrem prevValue kiedy robisz setState! inaczej jeśli próbujesz zrobić np. setCount(count++) i w next linijce znowu to samo to i tak ostatecznie count doda się tylko raz, bo dzieje się nadpisanie count (bo count sprawdza aktualną wartość i wartość stanu(count) zmienia się dopiero po nowym renderze)
// - obiekty się nie mergują w setState!!, zwraca się całowicie nowy obiekt ---> musisz wtedy użyć spread operator, żeby skopiowały się wszystkie wartości, a potem nadpisać inne (np. setState(prevState => {return { ...prevState, count: prevState.coount - 1}}))  ---> ale ogólnie lepiej jest zostawić obiekty w spokoju i tworzyć kilka useState