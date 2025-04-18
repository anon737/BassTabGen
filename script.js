let fileIds = Array.from(Array(2300).keys()).map(String);

const fileIdSelect = document.getElementById('fileId');
const partTypeSelect = document.getElementById('partType');
const alphaTabContainer = document.getElementById('alphaTab');

// Initialize dropdown
fileIds.forEach(id => {
  const option = document.createElement('option');
  option.value = id;
  option.textContent = id;
  fileIdSelect.appendChild(option);
});

// Initialize AlphaTab API
const alphaTabInstance = new alphaTab.AlphaTabApi(alphaTabContainer, {
  file: null,
  player: {
    enablePlayer: true,
    soundFont: 'https://cdn.jsdelivr.net/npm/@coderline/alphatab@latest/dist/soundfont/sonivox.sf2',
    scrollElement: alphaTabContainer.querySelector('.at-viewport')
  }
});

// Load selected tab
function loadTab() {
  const id = fileIdSelect.value;
  const part = partTypeSelect.value;
  const filename = part === 'bass'
    ? `${id}_generated_bass.tokens.gp5`
    : `${id}_generated_rg.tokens.rhythm_guitar.gp5`;

  alphaTabInstance.load(`gp5/${filename}`);
}

// Event listeners for dropdowns
fileIdSelect.addEventListener('change', loadTab);
partTypeSelect.addEventListener('change', loadTab);

// Load default on startup
window.addEventListener('DOMContentLoaded', loadTab);

// Playback controls
const playPauseButton = document.getElementById('playPauseButton');
const stopButton = document.getElementById('stopButton');
const currentTimeDisplay = document.getElementById('currentTime');

// Play/Pause functionality
playPauseButton.addEventListener('click', () => {
  if (alphaTabInstance.isPlaying()) {
    alphaTabInstance.pause();
  } else {
    alphaTabInstance.play();
  }
});

// Stop functionality
stopButton.addEventListener('click', () => {
  alphaTabInstance.stop();
});

// Update UI based on player state
alphaTabInstance.playerStateChanged.on((args) => {
  if (args.state === alphaTab.synth.PlayerState.Playing) {
    playPauseButton.textContent = 'Pause';
    stopButton.disabled = false;
  } else {
    playPauseButton.textContent = 'Play';
    stopButton.disabled = true;
  }
});

// Update current time display
alphaTabInstance.playerPositionChanged.on((args) => {
  const minutes = Math.floor(args.position / 60);
  const seconds = Math.floor(args.position % 60);
  currentTimeDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
});

const playerIndicator = wrapper.querySelector(
  ".at-controls .at-player-progress"
);
api.soundFontLoad.on((e) => {
  const percentage = Math.floor((e.loaded / e.total) * 100);
  playerIndicator.innerText = percentage + "%";
});
api.playerReady.on(()=>{
  playerIndicator.style.display = 'none';
});

const playPause = wrapper.querySelector(
  ".at-controls .at-player-play-pause"
);
const stop = wrapper.querySelector(".at-controls .at-player-stop");
playPause.onclick = (e) => {
  if (e.target.classList.contains("disabled")) {
    return;
  }
  api.playPause();
};
stop.onclick = (e) => {
  if (e.target.classList.contains("disabled")) {
    return;
  }
  api.stop();
};
api.playerReady.on(() => {
  playPause.classList.remove("disabled");
  stop.classList.remove("disabled");
});
api.playerStateChanged.on((e) => {
  const icon = playPause.querySelector("i.fas");
  if (e.state === alphaTab.synth.PlayerState.Playing) {
    icon.classList.remove("fa-play");
    icon.classList.add("fa-pause");
  } else {
    icon.classList.remove("fa-pause");
    icon.classList.add("fa-play");
  }
});

function formatDuration(milliseconds) {
  let seconds = milliseconds / 1000;
  const minutes = (seconds / 60) | 0;
  seconds = (seconds - minutes * 60) | 0;
  return (
    String(minutes).padStart(2, "0") +
    ":" +
    String(seconds).padStart(2, "0")
  );
}

const songPosition = wrapper.querySelector(".at-song-position");
let previousTime = -1;
api.playerPositionChanged.on((e) => {
  // reduce number of UI updates to second changes.
  const currentSeconds = (e.currentTime / 1000) | 0;
  if (currentSeconds == previousTime) {
    return;
  }

  songPosition.innerText =
    formatDuration(e.currentTime) + " / " + formatDuration(e.endTime);
});
