document.addEventListener('DOMContentLoaded', async () => {
  const svgContainer = document.getElementById('romaniaMap');
  const popup = document.getElementById('popup');
  const closePopup = document.getElementById('closePopup');
  const countyName = document.getElementById('countyName');
  const list = document.getElementById('list');
  const form = document.getElementById('propertyForm');
  const propTitle = document.getElementById('propTitle');
  const propDesc = document.getElementById('propDesc');

  let currentCountyId = null;

  // Încarcă SVG
  const res = await fetch('ro.svg');
  const svgText = await res.text();
  svgContainer.innerHTML = svgText;

  const counties = svgContainer.querySelectorAll('path');

  counties.forEach(county => {
    county.addEventListener('click', () => {
      currentCountyId = county.id;
      countyName.textContent = county.getAttribute('title') || county.id;
      loadProperties(currentCountyId);
      popup.classList.remove('hidden');
    });
  });

  closePopup.addEventListener('click', () => {
    popup.classList.add('hidden');
  });

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
    list.innerHTML = '';
    if (props.length === 0) {
      list.innerHTML = '<li>Nu există proprietăți.</li>';
    } else {
      props.forEach(p => {
        const li = document.createElement('li');
        li.textContent = `${p.title}: ${p.desc}`;
        list.appendChild(li);
      });
    }
  }
});
