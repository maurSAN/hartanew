// Zoom & Pan pe harta SVG
let zoomLevel = 1;
let panX = 0;
let panY = 0;
let isDragging = false;
let startX, startY;

const updateTransform = () => {
  svg.setAttribute('transform', `translate(${panX}, ${panY}) scale(${zoomLevel})`);
};

// Creează un <g> în care punem tot conținutul SVG
const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
while (svg.firstChild) {
  group.appendChild(svg.firstChild);
}
svg.appendChild(group);

// Aplică zoom cu rotița
svg.addEventListener("wheel", e => {
  e.preventDefault();
  const scaleAmount = 0.1;
  const oldZoom = zoomLevel;
  zoomLevel += e.deltaY < 0 ? scaleAmount : -scaleAmount;
  zoomLevel = Math.min(Math.max(zoomLevel, 0.3), 10);
  updateTransform();
});

// Drag cu mouse
svg.addEventListener("mousedown", e => {
  isDragging = true;
  startX = e.clientX - panX;
  startY = e.clientY - panY;
});

svg.addEventListener("mousemove", e => {
  if (!isDragging) return;
  panX = e.clientX - startX;
  panY = e.clientY - startY;
  updateTransform();
});

svg.addEventListener("mouseup", () => isDragging = false);
svg.addEventListener("mouseleave", () => isDragging = false);
