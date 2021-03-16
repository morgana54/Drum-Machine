import React, { useRef, useState, useEffect, useCallback } from 'react';
import './index.css'
import { bankOne, bankTwo } from './banksData'

const InfoBox = ({volume, soundIdCurrentlyPlaying, bankIdCurrentlyPlaying}) => {
  return (
  <div className='info-box'>
    <span>Volume: {volume}</span>
    <span>Bank: {bankIdCurrentlyPlaying}</span>
    <span>Sound: {soundIdCurrentlyPlaying}</span>
  </div>);
}

const VolumeSlider = ({volume, changeVolume, disabled}) => {
  return (
    <div>
      {/* If disabled is true then just block whole volume slider */}
      <input disabled={disabled} className="volume-slider" onChange={changeVolume} value={volume} type="range" min="0" max="100" />
    </div>
  );
}
// isRight means if the switch is on the right or not (so the left;)
const Switch = ({isRight, setIsRight, label, disabled, labelRight = '', labelLeft = ''}) => (
  <>
    <h4>{label}</h4>
    <div className="switch-background">
      <div
      className="switch" 
      // equivalent of: if (!disabled) { setIsRight(!isRight) }
      onClick={() => !disabled && setIsRight(!isRight)}
      style={{float: isRight ? 'right' : 'left'}}>
      {isRight ? labelRight : labelLeft}
      </div>
    </div> 
  </>
)

// soundIdCurrentlyPlaying={clip.id}
// url={clip.url} 
// trigger={clip.keyTrigger}
// keyCode={clip.keyCode} 
// @CR do not use more parameters than you need
const DrumButton = ({
  clip: { url, keyTrigger: trigger, keyCode, id: soundIdCurrentlyPlaying },
  volume,
  setSoundIdCurrentlyPlaying,
  isMachineOn,
  recording,
  setRecording
}) => {
  const [active, setActive] = useState(false)
  const audioRef = useRef()
  console.log(trigger)
  // @CR (optional) register only one event in App instead of in 9 in DrumButtons
  // Handle key press
  useEffect(() => {
    
    // If drums are turned off do nothing
    if(!isMachineOn) {
      return
    }
    // Declare callback
    const cb = (event) => {
      // console.log('eff ' + trigger)
      // If code of pressed button equals one of the drum's one - playSound
      if(event.keyCode === keyCode) {
        playSound(isMachineOn, volume, trigger)
      } 
    }
    document.addEventListener('keydown', cb)
    // WebDev super to tłumaczy: 
    // return to cleanup i wykona się przed nowym renderem
    return () => document.removeEventListener('keydown', cb)
  }, [isMachineOn, volume])

  // Zmienilismy zaleznosc playSound od isMachineOn i volume ze scope'a (closure'a) na parametry
  // przez co nasza funkcja jest duzo bardziej przewidywalna i łatwiejsza do debugowania
  function playSound(isMachineOn, volume, trigger) {
    if(!(isMachineOn && audioRef.current)) {
      return
    }
    audioRef.current.currentTime = 0
    audioRef.current.volume = volume / 100
    audioRef.current.play()
    setSoundIdCurrentlyPlaying(soundIdCurrentlyPlaying)
    setActive(true)
    setRecording(prevRecording => prevRecording + trigger + '')
    setTimeout(() => setActive(false), 200)
  }

  return (
    <div className={`drum-pad ${active && "drum-pad--active"}`} onClick={() => playSound(isMachineOn, volume, trigger)}>
      <audio ref={audioRef} src={url} id={trigger}></audio>
      <div className="drum-letter">{trigger}</div>
    </div>
  );
}

function App(){
  const [isMachineOn, setIsMachineOn] = React.useState(true)
  // Volume is a number from 0 to 100
  const [volume, setVolume] = React.useState(50)
  const [soundIdCurrentlyPlaying, setSoundIdCurrentlyPlaying] = React.useState('')
  // @CR you should store bankId instead e.g 'bankOne' || 'bankTwo'
  const [bankCurrentlyPlaying, setBankCurrentlyPlaying] = React.useState(bankOne)
  const [bankIdCurrentlyPlaying, setBankIdCurrentlyPlaying] = React.useState('Heater Kit')
  const [recording, setRecording] = React.useState("")
  const [recordingPlaying, setRecordingPlaying] = React.useState(false)

  async function playRecording() {
    if(recordingPlaying) {
      return
    }
    setRecordingPlaying(true)

    const letters = recording.split('')

    for(const letter of letters) {
      const $audio = document.querySelector(`#${letter}`)
      $audio.currentTime = 0
      $audio.volume = volume / 100
      $audio.play()

      await new Promise(res => $audio.onended = res)
    }

    setRecordingPlaying(false)
  }

  // @CR read about useCallback, watch webdev simplified and memoization
  const changeVolume = useCallback((event) => {
    // to powoduje ponowny rendering
      setVolume(event.target.value)
  }, [setVolume])

  function handlePowerSwitch(newIsOn) {
    // By that you make it more digestible
    // @CR replace magic numbers with well named constants
    const MEDIUM_VOLUME = 50
    const ZERO_VOLUME = 0
    
    setIsMachineOn(newIsOn)
    setVolume(newIsOn ? MEDIUM_VOLUME : ZERO_VOLUME)
  }

 
  return (
    <div className="wrapper">
      <div className="drums-container" id="drum-machine">
        <h2>DRUM MACHINE</h2>  
        <div className='drum-pads'>
        {bankCurrentlyPlaying.map(clip =>  
          <DrumButton 
          clip={clip}
          key={clip.id} 
          volume={volume}
          setSoundIdCurrentlyPlaying={setSoundIdCurrentlyPlaying}
          isMachineOn={isMachineOn}
          recording={recording}
          setRecording={setRecording}/> 
        )}
        </div>  
        <div className="recordingBox">
          <h3>{recording}</h3>
          {recording && (
            <div className="recordingButtons">
            {/* USTAW TAKŻE LIMIT DŁUGOŚCI RYTMU! */}
              <button className="playBtn" onClick={playRecording}>play</button>
              <button className="clearBtn" onClick={() => setRecording("")}>clear</button>
            </div>
          )}
        </div>
        <div className="control-panel">
          <InfoBox 
          volume={volume} 
          soundIdCurrentlyPlaying={!isMachineOn ? '' : soundIdCurrentlyPlaying} 
          bankIdCurrentlyPlaying={!isMachineOn ? '' : bankIdCurrentlyPlaying} />
          <div className='controls'>
            <Switch
              disabled={!isMachineOn}
              isRight={bankIdCurrentlyPlaying === 'Heater Kit'}
              setIsRight={(newIsRight) => {
                setBankIdCurrentlyPlaying(newIsRight ?  'Heater Kit' : 'Smooth Piano Kit')
                setBankCurrentlyPlaying(newIsRight ? bankOne : bankTwo)
              }}
              label='Bank'
            />
            <VolumeSlider 
            volume={volume} 
            changeVolume={changeVolume} 
            disabled={!isMachineOn}/>
            <Switch
              isRight={isMachineOn}
              setIsRight={handlePowerSwitch}
              labelRight={<span className="switch-on">ON</span>}
              labelLeft={<span className="switch-off">OFF</span>}
              label='Power'
            />
          </div>
        </div>
      </div> 
    </div>
  )
}

export default App;