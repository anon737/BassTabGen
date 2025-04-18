// List your file IDs here (e.g. '001', '002', ...)
const fileIds = Array.from(Array(2300).keys())
fileIds = fileIds.map(String)

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

// Init AlphaTab
const alphaTab = new alphaTab.AlphaTabApi(alphaTabContainer, {
  file: null,
  player: {
    enablePlayer: true,
    enableCursor: true,
    enableUserInteraction: true
  }
});

function loadTab() {
  const id = fileIdSelect.value;
  const part = partTypeSelect.value;
  const filename =
    part === 'bass'
      ? `${id}_generated_bass.tokens.gp5`
      : `${id}_generated_rg.tokens.rhythm_guitar.gp5`;

  alphaTab.load(`gp5/${filename}`);
}

// Events
fileIdSelect.addEventListener('change', loadTab);
partTypeSelect.addEventListener('change', loadTab);

// Load default on startup
window.addEventListener('DOMContentLoaded', loadTab);

