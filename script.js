document.addEventListener('DOMContentLoaded', async () => {
  const svgContainer = document.getElementById('romaniaMap');
  const popup = document.getElementById('popup');
  const closeBtn = document.getElementById('closePopup');
  const countyNameEl = document.getElementById('countyName');
  const listEl = document.getElementById('list');
  const form = document.getElementById('propertyForm');
  const propTitle = document.getElementById('propTitle');
  const propDesc = document.getElementById('propDesc');

  let currentCountyId = null;
  let zoomLevel = 1, panX = 0, panY = 0, isDragging = false;
  let startX, startY;

  // Încarcă SVG-ul
  const res = await fetch('ro.svg');
  const svgText = await res.text();
  svgContainer.innerHTML = svgText;

  const svg = svgContainer.querySelector('svg');
  svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
  svg.setAttribute('width', '100%');
  svg.setAttribute('height', 'auto');

  // Creează un grup în care punem totul pentru zoom+pan
  const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
  while (svg.firstChild) {
    group.appendChild(svg.firstChild);
  }
  svg.appendChild(group);

  const counties = group.querySelectorAll('path');

  counties.forEach(county => {
    county.addEventListener('click', () => {
      currentCountyId = county.id;
      countyNameEl.textContent = county.getAttribute('title') || county.id;
      loadProperties(currentCountyId);
      popup.classList.remove('hidden');
    });
  });

  // Etichete cu abrevieri
  counties.forEach(county => {
    const bbox = county.getBBox();
    const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
    label.setAttribute("x", bbox.x + bbox.width / 2);
    label.setAttribute("y", bbox.y + bbox.height / 2);
    label.setAttribute("text-anchor", "middle");
    label.setAttribute("alignment-baseline", "middle");
    label.setAttribute("class", "label");
    label.textContent = county.id;
    group.appendChild(label);
  });

  // Zoom cu scroll
  svg.addEventListener("wheel", e => {
    e.preventDefault();
    const delta = e.deltaY < 0 ? 0.1 : -0.1;
    zoomLevel = Math.min(Math.max(0.3, zoomLevel + delta), 10);
    applyTransform();
  });

  // Pan cu drag
  svg.addEventListener("mousedown", e => {
    isDragging = true;
    startX = e.clientX - panX;
    startY = e.clientY - panY;
    svg.style.cursor = "grabbing";
  });

  svg.addEventListener("mousemove", e => {
    if (!isDragging) return;
    panX = e.clientX - startX;
    panY = e.clientY - startY;
    applyTransform();
  });

  svg.addEventListener("mouseup", () => {
    isDragging = false;
    svg.style.cursor = "grab";
  });

  svg.addEventListener("mouseleave", () => {
    isDragging = false;
    svg.style.cursor = "grab";
  });

  function applyTransform() {
    group.setAttribute("transform", `translate(${panX}, ${panY}) scale(${zoomLevel})`);
  }

  closeBtn.addEventListener('click', () => popup.classList.add('hidden'));

  form.addEventListener('submit', e => {
    e.preventDefault();
    const key = `props_${currentCountyId}`;
    const props = JSON.parse(localStorage.getItem(key) || '[]');
    props.push({ title: propTitle.value, desc: propDesc.value });
    localStorage.setItem(key, JSON.stringify(props));
    propTitle.value = '';
    propDesc.value = '';
    loadProperties(currentCountyId);
  });

  function loadProperties(id) {
    const props = JSON.parse(localStorage.getItem(`props_${id}`) || '[]');
    listEl.innerHTML = '';
    if (props.length === 0) {
      listEl.innerHTML = '<li>Nu există proprietăți.</li>';
    } else {
      props.forEach(p => {
        const li = document.createElement('li');
        li.textContent = `${p.title}: ${p.desc}`;
        listEl.appendChild(li);
      });
    }
  }
});
