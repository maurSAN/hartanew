// script.js

document.addEventListener('DOMContentLoaded', () => {
  const map = document.getElementById('romaniaMap');
  const popup = document.getElementById('popup');
  const closeBtn = document.getElementById('closePopup');
  const countyNameEl = document.getElementById('countyName');
  const listEl = document.getElementById('list');
  const form = document.getElementById('propertyForm');
  const propTitle = document.getElementById('propTitle');
  const propDesc = document.getElementById('propDesc');

  let currentCountyId = null;

  function openPopup(countyId, countyName) {
    currentCountyId = countyId;
    countyNameEl.textContent = countyName;
    loadProperties(countyId);
    popup.classList.remove('hidden');
  }

  closeBtn.addEventListener('click', () => {
    popup.classList.add('hidden');
  });

  function loadProperties(countyId) {
    const key = `props_${countyId}`;
    const props = JSON.parse(localStorage.getItem(key) || '[]');
    listEl.innerHTML = '';
    if (props.length === 0) {
      listEl.innerHTML = '<li>Nu există proprietăţi.</li>';
    } else {
      props.forEach((p) => {
        const li = document.createElement('li');
        li.textContent = `${p.title}: ${p.desc}`;
        listEl.appendChild(li);
      });
    }
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!currentCountyId) return;
    const key = `props_${currentCountyId}`;
    const props = JSON.parse(localStorage.getItem(key) || '[]');
    props.push({ title: propTitle.value, desc: propDesc.value });
    localStorage.setItem(key, JSON.stringify(props));
    propTitle.value = '';
    propDesc.value = '';
    loadProperties(currentCountyId);
  });

  const counties = map.querySelectorAll('.county');
  counties.forEach(path => {
    path.addEventListener('click', () => {
      const id = path.id;
      const name = path.getAttribute('data‑name');
      openPopup(id, name);
    });
  });
});
