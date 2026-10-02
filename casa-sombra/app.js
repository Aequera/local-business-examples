(() => {
  const places = {
    casa: {number:"01",title:"The Casa",description:"A cool stone room, a long open door, and just enough shade to lose track of the hour.",meta:"THE HEART OF THE GROUNDS",time:"AFTERNOON",symbol:"✳"},
    pool: {number:"02",title:"Still Water",description:"A quiet blue line catches the last light. Come early, stay until the mountains turn violet.",meta:"THE REFLECTING POOL",time:"BLUE HOUR",symbol:"◌"},
    garden: {number:"03",title:"Garden Walk",description:"Follow the small path between desert leaves. It takes the long way around on purpose.",meta:"THE SLOW PATH",time:"ANYTIME",symbol:"✿"},
    lookout: {number:"04",title:"North Lookout",description:"A low stone bench, a wide sky, and a view that makes the day feel beautifully unimportant.",meta:"ABOVE THE QUIET SIDE",time:"SUNSET",symbol:"✧"}
  };
  const viewport = document.querySelector("#map-viewport");
  const world = document.querySelector("#map-world");
  const pins = Array.from(document.querySelectorAll(".map-pin"));
  const rows = Array.from(document.querySelectorAll(".place-row"));
  const title = document.querySelector("#place-title");
  const description = document.querySelector("#place-description");
  const index = document.querySelector("#place-index");
  const meta = document.querySelector("#place-meta");
  const time = document.querySelector("#place-time");
  const symbol = document.querySelector("#place-symbol");
  let activePlace = "casa";
  let zoom = 0.78;
  let x = 0;
  let y = 0;
  let drag = null;

  function renderPlace(key) {
    const place = places[key];
    if (!place) return;
    activePlace = key;
    title.textContent = place.title;
    description.textContent = place.description;
    index.textContent = "FIELD NOTE / " + place.number;
    meta.textContent = place.meta;
    time.textContent = place.time;
    symbol.textContent = place.symbol;
    pins.forEach((pin) => {
      const selected = pin.dataset.place === key;
      pin.classList.toggle("is-selected", selected);
      pin.setAttribute("aria-pressed", String(selected));
    });
    rows.forEach((row) => row.classList.toggle("is-selected", row.dataset.place === key));
  }

  function renderTransform() {
    world.style.transform = "translate(" + x + "px," + y + "px) scale(" + zoom + ")";
  }

  function fitMap() {
    const available = Math.min(viewport.clientWidth - 20, (viewport.clientHeight - 18) * (1000 / 600));
    zoom = Math.max(0.42, Math.min(1, available / 1000));
    x = 0;
    y = 0;
    renderTransform();
  }

  function changeZoom(amount) {
    const next = Math.max(0.42, Math.min(1.45, zoom + amount));
    const ratio = next / zoom;
    x *= ratio;
    y *= ratio;
    zoom = next;
    renderTransform();
  }

  pins.forEach((pin) => {
    pin.addEventListener("pointerdown", (event) => event.stopPropagation());
    pin.addEventListener("click", () => renderPlace(pin.dataset.place));
  });
  rows.forEach((row) => row.addEventListener("click", () => renderPlace(row.dataset.place)));

  viewport.addEventListener("pointerdown", (event) => {
    if (event.target.closest("button")) return;
    drag = {x:event.clientX, y:event.clientY, startX:x, startY:y};
    world.classList.add("is-dragging");
    viewport.setPointerCapture(event.pointerId);
  });
  viewport.addEventListener("pointermove", (event) => {
    if (!drag) return;
    x = drag.startX + event.clientX - drag.x;
    y = drag.startY + event.clientY - drag.y;
    renderTransform();
  });
  function stopDrag() {
    drag = null;
    world.classList.remove("is-dragging");
  }
  viewport.addEventListener("pointerup", stopDrag);
  viewport.addEventListener("pointercancel", stopDrag);
  viewport.addEventListener("keydown", (event) => {
    const step = 32;
    if (event.key === "ArrowLeft") x += step;
    else if (event.key === "ArrowRight") x -= step;
    else if (event.key === "ArrowUp") y += step;
    else if (event.key === "ArrowDown") y -= step;
    else if (event.key === "+" || event.key === "=") changeZoom(.1);
    else if (event.key === "-") changeZoom(-.1);
    else return;
    event.preventDefault();
    renderTransform();
  });
  document.querySelector("#zoom-in").addEventListener("click", () => changeZoom(.12));
  document.querySelector("#zoom-out").addEventListener("click", () => changeZoom(-.12));
  document.querySelector("#map-reset").addEventListener("click", fitMap);
  window.addEventListener("resize", fitMap);
  fitMap();
  renderPlace(activePlace);
})();