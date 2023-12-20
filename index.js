let numberOfDrumButtons = document.querySelectorAll(".drum").length;

for (let i = 0; i < numberOfDrumButtons; i++) {
  document.querySelectorAll(".drum")[i].addEventListener("click", function () {
    var buttonInnerHTML = this.innerHTML;
    makeSound(buttonInnerHTML);
    buttonAnimation(buttonInnerHTML);
  });
}

document.addEventListener("mousedown", function (event) {
  var buttonInnerHTML = event.target.innerHTML;
  if (buttonInnerHTML) {
    // Ensure buttonInnerHTML is defined
    makeSound(buttonInnerHTML);
    buttonAnimation(buttonInnerHTML);
  }
});

function makeSound(drum) {
  var buttonInnerHTML = event.target.innerHTML;
  switch (drum) {
    case "w":
      var tom1 = new Audio("sounds/tom-1.mp3");
      tom1.play();
      break;
    case "a":
      var tom2 = new Audio("sounds/tom-2.mp3");
      tom2.play();
      break;
    case "s":
      var tom3 = new Audio("sounds/tom-3.mp3");
      tom3.play();
      break;
    case "d":
      var tom4 = new Audio("sounds/tom-4.mp3");
      tom4.play();
      break;
    case "j":
      var crash = new Audio("sounds/crash.mp3");
      crash.play();
      break;
    case "k":
      var kick = new Audio("sounds/kick-bass.mp3");
      kick.play();
      break;
    case "l":
      var snare = new Audio("sounds/snare.mp3");
      snare.play();
      break;

    default:
      console.log(buttonInnerHTML);
  }
}
function buttonAnimation(currentKey) {
  // Extract the key character from the span
  var keyCharacter = currentKey.replace(/<span>([^<]+)<\/span>/i, "$1");

  // Sanitize the keyCharacter to extract a valid class name
  var sanitizedKey = keyCharacter.replace(/[^a-zA-Z0-9-]/g, "");

  var activeButton = document.querySelector("." + sanitizedKey);

  if (activeButton) {
    activeButton.classList.add("pressed");
    setTimeout(function () {
      activeButton.classList.remove("pressed");
    }, 100);
  }
}
const pianoKeys = document.querySelectorAll(".piano-keys .key"),
  volumeSlider = document.querySelector(".volume-slider input"),
  keysCheckbox = document.querySelector(".keys-checkbox input");
let allKeys = [],
  audio = new Audio(`tunes/a.wav`); // by default, audio src is "a" tune
const playTune = (key) => {
  audio.src = `tunes/${key}.wav`; // passing audio src based on key pressed
  audio.play(); // playing audio
  const clickedKey = document.querySelector(`[data-key="${key}"]`); // getting clicked key element
  clickedKey.classList.add("active"); // adding active class to the clicked key element
  setTimeout(() => {
    // removing active class after 150 ms from the clicked key element
    clickedKey.classList.remove("active");
  }, 150);
};
pianoKeys.forEach((key) => {
  allKeys.push(key.dataset.key); // adding data-key value to the allKeys array
  // calling playTune function with passing data-key value as an argument
  key.addEventListener("click", () => playTune(key.dataset.key));
});
const handleVolume = (e) => {
  audio.volume = e.target.value; // passing the range slider value as an audio volume
};
const showHideKeys = () => {
  // toggling hide class from each key on the checkbox click
  pianoKeys.forEach((key) => key.classList.toggle("hide"));
};
const pressedKey = (e) => {
  // if the pressed key is in the allKeys array, only call the playTune function
  if (allKeys.includes(e.key)) playTune(e.key);
};
keysCheckbox.addEventListener("click", showHideKeys);
volumeSlider.addEventListener("input", handleVolume);
document.addEventListener("keydown", pressedKey);

// Record music
const startButton = document.getElementById("start");
const stopButton = document.getElementById("stop");
const playButton = document.getElementById("play");
let output = document.getElementById("output");
let mediaRecorder;
let audioChunks = [];

navigator.mediaDevices
  .getUserMedia({ audio: true })
  .then((stream) => {
    mediaRecorder = new MediaRecorder(stream);

    mediaRecorder.onstart = () => {
      console.log("Recording started!");
      audioChunks = [];
    };

    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        audioChunks.push(e.data);
      }
    };

    startButton.addEventListener("click", () => {
      mediaRecorder.start();
      output.innerHTML = "Recording started!";
    });

    stopButton.addEventListener("click", () => {
      mediaRecorder.stop();
      output.innerHTML = "Recording stopped!";
    });

    playButton.addEventListener("click", () => {
      if (audioChunks.length === 0) {
        output.innerHTML = "No audio to play. Please record first.";
        return;
      }

      const blob = new Blob(audioChunks, { type: "audio/wav" });
      const audioUrl = URL.createObjectURL(blob);

      // Create a temporary audio element to play the recorded audio
      const tempAudio = new Audio(audioUrl);
      tempAudio.play();

      // Save the audio blob as a file
      const a = document.createElement("a");
      document.body.appendChild(a);
      a.style = "display: none";
      const url = window.URL.createObjectURL(blob);
      a.href = url;
      a.download = "recorded_audio.wav";
      a.click();
      window.URL.revokeObjectURL(url);

      output.innerHTML = "Playing and saving the recorded audio!";
    });

    mediaRecorder.onstop = () => {
      console.log("Recording stopped!");
    };
  })
  .catch((err) => {
    console.log("Error accessing microphone: " + err);
  });
