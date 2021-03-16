import React, { useRef, useState, useEffect, useCallback } from 'react';
import './index.css'
import { bankOne, bankTwo } from './banksData'

// soundName={clip.id}
// url={clip.url} 
// trigger={clip.keyTrigger}
// keyCode={clip.keyCode} 
// @CR do not use more parameters than you need
const DrumButton = ({
  clip: { url, keyTrigger: trigger, keyCode, id: soundName },
  volume,
  setSoundName,
  power
}) => {
  const [active, setActive] = useState(false)
  const audioRef = useRef()
 
  // @CR (optional) register only one event in App instead of in 9 in DrumButtons
  useEffect(() => {
      if(!power) {
        return
      }
      const cb = (event) => {
        if(event.keyCode === keyCode) {
          playSound(power, volume)
        } 
      }
      document.addEventListener('keydown', cb)
      // WebDevSimp świetnie to tłumaczy: return to cleanup i wykona się przed nowym renderem (componentWillUnmount??)
      return () => document.removeEventListener('keydown', cb)
  }, [power, volume])

  // Zmienilismy zaleznosc playSound od power i volume ze scope'a (closure'a) na parametry
  // przez co nasza funkcja jest duzo bardziej przewidywalna i łatwiejsza do debugowania
  function playSound(power, volume) {
    if(!(power && audioRef.current)) {
      return
    }
    audioRef.current.currentTime = 0
    audioRef.current.volume = volume / 100
    audioRef.current.play()
    setSoundName(soundName)
    setActive(true)
    setTimeout(() => setActive(false), 200)
  }

  return (
    <div className={`drum-pad ${active && "drum-pad--active"}`} onClick={() => playSound(power, volume)}>
      <audio ref={audioRef} src={url}></audio>
      <div className="drum-letter">{trigger}</div>
    </div>
  );
}

const InfoBox = ({volume, soundName, bankName}) => {
  return (
  <div className='info-box'>
    {/* @CR span better */}
    <p>Volume: {volume}</p>
    <p>Bank: {bankName}</p>
    <p>Sound: {soundName}</p>
  </div>);
}

// @CR power -> disabled leverage native 'disabled' prop on input
const VolumeSlider = ({volume, changeVolume, power}) => {
  return (
    <div>
      <input disabled={!power} className="volume-slider" onChange={power ? changeVolume : null} value={power ? volume  : 0} type="range" min="0" max="100" />
    </div>
  );
}

const Switch = ({isRight, setIsRight, label, disabled, labelRight = '', labelLeft = ''}) => (
  <>
    <h4>{label}</h4>
    <div className="switch-background">
      <div
      className="switch" 
      // if (!disabled) { setEnabled(!enabled) }
      onClick={() => !disabled && setIsRight(!isRight)}
      style={{float: isRight ? 'right' : 'left'}}>
        {isRight ? labelRight : labelLeft}
        </div>
    </div> 
  </>
)

const PowerSwitch = ({handlePowerSwitch, powerFloatProp
// @CR bankId
}) => {
  return (
    <>
      <h4>Power</h4>
      <div className="switch-background">
        <div 
        className="switch" 
        onClick={handlePowerSwitch}
        style={{float: powerFloatProp}}>
          {/* bankId === 'bankOne' &&  */}
          {powerFloatProp === 'right' && <p className="switch-on">ON</p>}
          {powerFloatProp === 'left' && <p className="switch-off">OFF</p>}
        </div>
      </div> 
    </> 
  );
}



function App(){
  // @CR isMachineOn, setIsMachineOn
  const [power, setPower] = React.useState(true)
  // @CR add a comment is a number from 0 - 100
  const [volume, setVolume] = React.useState(50)
  // @CR soundIdCurrentlyPlaying, setSoundIdCurrentlyPlaying
  const [soundName, setSoundName] = React.useState('')
  // @CR add an explanation comment
  // @CR you should store bankId instead e.g 'bankOne' || 'bankTwo'
  const [bank, setBank] = React.useState(bankOne)
  // @CR bankName should be a part of bank object (see comment next to objects on the top)
  const [bankName, setBankName] = React.useState('Smooth Piano Kit')
  // @CR should be a part of banks
  const [bankFloatProp, setBankFloatProp] = React.useState('right')
  // @CR could be replaced with use of isMachineOn
  const [powerFloatProp, setPowerFloatProp] = React.useState('right')

  // @CR read about useCallback, watch webdev simplified and memoization
  const changeVolume = useCallback((event) => {
    // to powoduje ponowny rendering
      setVolume(event.target.value)
  }, [setVolume])
  
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

  function handlePowerSwitch(newIsOn) {
    // By that you make it more digestible
    // @CR replace magic numbers with well named constants
    const MEDIUM_VOLUME = 50
    const ZERO_VOLUME = 0

    setPower(newIsOn)

    setVolume(newIsOn ? MEDIUM_VOLUME : ZERO_VOLUME)
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
            volume={volume}
            setSoundName={setSoundName}
            power={power}/> 
            )}
        </div>  
        <div className="control-panel">
          <InfoBox volume={volume} soundName={!power ? '' : soundName} bankName={!power ? '' : bankName} />
          {/* to potem też możesz jakoś przefaktorować na dynamiczny Switch komponent do którego będziesz dawać różne propsy i w zależności od tego będzie miał funkcję power i bank, ale to dopiero na SAAAAMIUTKI koniec*/}
          <div className='controls'>
            <Switch
              disabled={!power}
              isRight={bankName === 'Heater Kit'}
              setIsRight={(newIsRight) => 
                setBankName(newIsRight ?  'Heater Kit' : 'Smooth Piano Kit')
              }
              label='Bank'
            />
            <VolumeSlider volume={volume} changeVolume={changeVolume} power={power}/>
            <Switch
              isRight={power}
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