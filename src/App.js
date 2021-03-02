import React, { useRef, useState, useEffect } from 'react';
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

const DrumButton = ({url, trigger, keyCode, volume, soundName, handleSound, power}) => {
  const [active, setActive] = useState(false)
  const audioRef = useRef()
 
  useEffect(() => {
    
      if(power) {
        document.addEventListener('keydown', handleKeyPress)
        // WebDevSimp świetnie to tłumaczy: return to cleanup i wykona się przed nowym renderem (componentWillUnmount??)
        return () => document.removeEventListener('keydown', handleKeyPress)
      } else {
        return
      }
  }, [volume])

  function playSound() {
    if(!(power && audioRef.current)) {
      return
    }
    audioRef.current.currentTime = 0
    audioRef.current.volume = volume / 100
    audioRef.current.play()
    handleSound(soundName)
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
      <div className="drum-letter">{trigger}</div>
    </div>
  );
}

const InfoBox = ({volume, soundName, bankName}) => {
  return (
  <div className='info-box'>
    <p>Volume: {volume}</p>
    <p>Bank: {bankName}</p>
    <p>Sound: {soundName}</p>
  </div>);
}

const VolumeSlider = ({volume, changeVolume, power}) => {
  return (
    <div>
      <input className="volume-slider" onChange={power ? changeVolume : null} value={power ? volume  : 0} type="range" min="0" max="100" />
    </div>
  );
}

const BankSwitch = ({handleBankSwitch, bankFloatProp, power}) => {
  return (
    <>
      <h4>Bank</h4>
      <div className="switch-background">
        <div 
        className="switch" 
        onClick={power ? handleBankSwitch : null}
        style={{float: bankFloatProp}}/>
      </div> 
    </> 
  );
}

const PowerSwitch = ({handlePowerSwitch, powerFloatProp}) => {
  return (
    <>
      <h4>Power</h4>
      <div className="switch-background">
        <div 
        className="switch" 
        onClick={handlePowerSwitch}
        style={{float: powerFloatProp}}>
          {powerFloatProp === 'right' && <p className="switch-on">ON</p>}
          {powerFloatProp === 'left' && <p className="switch-off">OFF</p>}
        </div>
      </div> 
    </> 
  );
}

function App(){
  const [power, setPower] = React.useState(true)
  const [volume, setVolume] = React.useState(50)
  // jakoś w state ustawisz info do wyświetlania na ezz, tak jak ten gość to zrobił
  // i potem jakoś na onclick (w atrybutach w App na DrumButton jakoś zmienisz wartość soundName)
  const [soundName, setSoundName] = React.useState('')
  // jak coś tu nie będzie działać to spójrz na dół w rady
  const [bank, setBank] = React.useState(bankOne)
  const [bankName, setBankName] = React.useState('Smooth Piano Kit')
  const [bankFloatProp, setBankFloatProp] = React.useState('right')
  const [powerFloatProp, setPowerFloatProp] = React.useState('right')

  function changeVolume(event) {
    // to powoduje ponowny rendering
    setVolume(event.target.value)
  }

  function handleSound(sound) {
    setSoundName(sound)
  }

  function handleBankSwitch() {
    if(bankFloatProp === 'right') {
      setBank(bankOne)
      setBankName('Heater Kit')
      setBankFloatProp('left')
    } else {
      setBank(bankTwo)
      setBankName('Smooth Piano Kit')
      setBankFloatProp('right')
    }
  }

  function handlePowerSwitch() {
    if(powerFloatProp === 'right') {
      setPowerFloatProp('left')
      setPower(!power)
    } else {
      setPowerFloatProp('right')
      setPower(!power)
      setVolume(50)
    }

    if(power) {
      setVolume(0)
      setSoundName('')
      setBankName('')
    }
  }
 
  return (
    <div className="wrapper">
      <div className="drums-container" id="drum-machine">
        <h2>DRUM MACHINE</h2>  
        <div className='drum-pads'>
          {bank.map(clip =>  
            <DrumButton 
            clip={clip}
            key={clip.id} 
            soundName={clip.id}
            url={clip.url} 
            trigger={clip.keyTrigger}
            keyCode={clip.keyCode} 
            volume={volume}
            handleSound={handleSound}
            power={power}/> 
            )}
        </div>  
        <div className="control-panel">
          <InfoBox volume={volume} soundName={soundName} bankName={bankName}/>
          {/* to potem też możesz jakoś przefaktorować na dynamiczny Switch komponent do którego będziesz dawać różne propsy i w zależności od tego będzie miał funkcję power i bank, ale to dopiero na SAAAAMIUTKI koniec*/}
          <div className='controls'>
            <BankSwitch handleBankSwitch={handleBankSwitch} bankFloatProp={bankFloatProp} power={power}/>
            <VolumeSlider volume={volume} changeVolume={changeVolume} power={power}/>
            <PowerSwitch handlePowerSwitch={handlePowerSwitch} powerFloatProp={powerFloatProp} />
          </div>
        </div>
      </div> 
    </div>
  )
}

export default App;


// A NA SAM SAM SAM SAMIUTKI KONIEC: dodaj wszędzie komentarze żeby powtórzyć kod i jeszcze lepiej wszystko zrozumieć

// TASKI:
// - wyświetlanie się defaultowego banka po ponownym włączeniu
// - wystylować ładniej (slider, przyciski...)
// - ŻEBY JUŻ BYŁ GOTOWY POD PORTFOLIO!! 
    // - dodać speed i recording features stąd: (obejrzyj jeszcze raz i spróbuj sam zaimplementować) --> https://www.youtube.com/watch?v=HTTaO1IjjlM&ab_channel=LandonSchlangen


// PYTANIA DO KACPERRA:
 // o co chodzi z tymi eventami dokładnie w listenerach?
  // czemu działa bez '[]' z tym returnem, i na odwrót, ale wywala błąd jeśli nie ma obu? 
    // zapytać jednak potem Kacpra czemu nie działało to rozwiązanie i jak dokładnie działa ten hook useRef i kiedy current się przypisuje
  // zapytać także kacpra o działanie tego add event listenera i że ten drugi return rozumiem się nie wykona zanim event się nie stanie tak??


// info do hooków: ZROBIĆ TEŻ TAK Z INNYMI OGLĄDAJĄC FILMIKI!!!!
// useState:
// - jeśli wywołasz funkcję w useState, zamiast dawać samą wartość, to przypisze (wywoła) się ona tylko raz, a standardowo dzieje się to za każdym razem(10:45 Kyle video) (it enhances performance)
// - używaj funckji z parametrem prevValue kiedy robisz setState! inaczej jeśli próbujesz zrobić np. setCount(count++) i w next linijce znowu to samo to i tak ostatecznie count doda się tylko raz, bo dzieje się nadpisanie count (bo count sprawdza aktualną wartość i wartość stanu(count) zmienia się dopiero po nowym renderze)
// - obiekty się nie mergują w setState!!, zwraca się całowicie nowy obiekt ---> musisz wtedy użyć spread operator, żeby skopiowały się wszystkie wartości, a potem nadpisać inne (np. setState(prevState => {return { ...prevState, count: prevState.coount - 1}}))  ---> ale ogólnie lepiej jest zostawić obiekty w spokoju i tworzyć kilka useState