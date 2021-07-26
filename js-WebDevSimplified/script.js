const audioContext = new AudioContext()

//Array of note objects
const NOTE_DETAILS = [
  { note: "C", key: "A", frequency: 261.626, active: false },
  { note: "Db", key: "W", frequency: 277.183, active: false },
  { note: "D", key: "S", frequency: 293.665, active: false },
  { note: "Eb", key: "E", frequency: 311.127, active: false },
  { note: "E", key: "D", frequency: 329.628, active: false },
  { note: "F", key: "F", frequency: 349.228, active: false },
  { note: "Gb", key: "T", frequency: 369.994, active: false },
  { note: "G", key: "G", frequency: 391.995, active: false },
  { note: "Ab", key: "Y", frequency: 415.305, active: false },
  { note: "A", key: "H", frequency: 440, active: false },
  { note: "Bb", key: "U", frequency: 466.164, active: false },
  { note: "B", key: "J", frequency: 493.883, active: false },
]

//Push key on our keyborad
document.addEventListener("keydown", (e) => {
  if (e.repeat) return //Not keep the note repeating when the key is pressed down
  const keyboardKey = e.code
  const noteDetail = getNoteDetail(keyboardKey)

  if (noteDetail == null) return //check if the keyboard key exists as a note
  noteDetail.active = true
  playNotes()
})

//After removing finger from keyboard
document.addEventListener("keyup", (e) => {
  if (e.repeat) return //Not keep the note repeating when the key is pressed down
  const keyboardKey = e.code
  const noteDetail = getNoteDetail(keyboardKey)

  if (noteDetail == null) return //check if the keyboard key exists as a note
  noteDetail.active = false
  playNotes()
})

//check which keyboard key is pressed with the array of note
function getNoteDetail(keyboardKey) {
  return NOTE_DETAILS.find((n) => `Key${n.key}` === keyboardKey)
}

function playNotes() {
  //adding active class to in our html tag of divs
  NOTE_DETAILS.forEach((n) => {
    const keyElement = document.querySelector(`[data-note="${n.note}"]`)
    keyElement.classList.toggle("active", n.active)
    if (n.oscillator != null) {
      n.oscillator.stop()
      n.oscillator.disconnect()
    }
  })

  //filter the active notes that are playing in a new array
  const activeNotes = NOTE_DETAILS.filter((n) => n.active)
  const gain = 1 / activeNotes.length //set the gain by calulating the tatal volume of all the note to be 1 and not more than that
  activeNotes.forEach((n) => {
    startNote(n, gain)
  })
}

function startNote(noteDetail, gain) {
  const gainNode = audioContext.createGain()
  gainNode.gain.value = gain //set the gain
  const oscillator = audioContext.createOscillator()
  oscillator.frequency.value = noteDetail.frequency //get what frequency of sound to play
  oscillator.type = "sine" //which soundwave to play
  oscillator.connect(gainNode).connect(audioContext.destination) //play through our speakers
  oscillator.start()
  noteDetail.oscillator = oscillator
}
