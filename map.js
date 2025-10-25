window.onload = function () {
  const mapDiv = document.getElementById('map');
  const states = simplemaps_countrymap_mapdata.state_specific;

  // Creează container pentru județe
  const mapWrapper = document.createElement('div');
  mapWrapper.style.display = 'flex';
  mapWrapper.style.flexWrap = 'wrap';
  mapWrapper.style.justifyContent = 'center';

  for (const stateId in states) {
    const state = states[stateId];
    const button = document.createElement('div');
    button.textContent = state.name;
    button.style.margin = '10px';
    button.style.padding = '15px';
    button.style.background = '#88A4BC';
    button.style.color = 'white';
    button.style.borderRadius = '5px';
    button.style.cursor = 'pointer';
    button.style.transition = '0.3s';
    button.onmouseenter = () => button.style.background = '#3B729F';
    button.onmouseleave = () => button.style.background = '#88A4BC';
    button.onclick = () => {
      alert(`Județ: ${state.name}\nDescriere: ${state.description}`);
    };
    mapWrapper.appendChild(button);
  }

  mapDiv.appendChild(mapWrapper);
};
