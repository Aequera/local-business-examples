(() => {
  const form = document.querySelector("#bowl-form");
  const heat = document.querySelector("#heat");
  const stage = document.querySelector("#bowl-stage");
  const title = document.querySelector("#bowl-title");
  const description = document.querySelector("#bowl-description");
  const summary = document.querySelector("#order-summary");
  const total = document.querySelector("#total-price");
  const buttonPrice = document.querySelector("#button-price");
  const heatWord = document.querySelector("#heat-word");
  const bagCount = document.querySelector("#bag-count");
  const toast = document.querySelector("#toast");
  const brothInfo = {
    miso: {name: "Moonlight Miso", short: "Moonlight miso", price: 1400, color: "#c98545", note: "Roasty miso, slow noodles, and a cozy glow."},
    shoyu: {name: "Lantern Shoyu", short: "Lantern shoyu", price: 1300, color: "#a85e3f", note: "Bright soy, ginger, and a little lift."},
    fire: {name: "Little Comet", short: "Little comet", price: 1500, color: "#d65739", note: "Smoky fire miso for a little night spark."}
  };
  const heatNames = ["MELLOW", "COZY GLOW", "WARM GLOW", "NIGHT FLAME", "SUPERNOVA"];
  const garnishMap = {egg: "garnish-egg", tofu: "garnish-tofu", corn: "garnish-corn", greens: "garnish-greens", chili: "garnish-chili"};
  const money = (cents) => "$" + (cents / 100).toFixed(cents % 100 ? 2 : 0);
  let bag = 0;
  let toastTimer;

  function render() {
    const brothKey = form.querySelector('input[name="broth"]:checked').value;
    const broth = brothInfo[brothKey];
    const extras = Array.from(form.querySelectorAll('input[name="extra"]:checked'));
    const heatLevel = Number(heat.value);
    const added = extras.reduce((sum, item) => sum + Number(item.dataset.price), 0);
    const price = broth.price + added;
    const extraLabels = extras.map((item) => item.closest(".addon").querySelector("b").textContent.toLowerCase());
    const parts = [broth.short.toLowerCase()].concat(extraLabels, heatNames[heatLevel].toLowerCase());
    const nameTail = extras.length ? " + " + extras.length + " extra" + (extras.length > 1 ? "s" : "") : "";
    title.textContent = broth.name + nameTail;
    description.textContent = broth.note;
    summary.textContent = parts.join(" · ");
    total.textContent = money(price);
    buttonPrice.textContent = money(price) + " ↗";
    heatWord.textContent = heatNames[heatLevel];
    stage.style.setProperty("--broth-color", broth.color);
    stage.style.setProperty("--heat-glow", String(heatLevel / 4));
    document.documentElement.style.setProperty("--heat-progress", (heatLevel * 25) + "%");
    Object.entries(garnishMap).forEach(([key, id]) => {
      document.getElementById(id).classList.toggle("is-on", extras.some((item) => item.value === key));
    });
  }

  form.addEventListener("change", render);
  heat.addEventListener("input", render);
  form.addEventListener("reset", () => window.setTimeout(render, 0));

  document.querySelectorAll(".preset").forEach((button) => {
    button.addEventListener("click", () => {
      const preset = button.dataset.preset;
      form.querySelector('input[name="broth"][value="' + preset + '"]').checked = true;
      form.querySelectorAll('input[name="extra"]').forEach((input) => {
        input.checked = preset === "miso" ? ["egg", "corn"].includes(input.value) :
          preset === "shoyu" ? ["greens"].includes(input.value) :
          ["chili", "pork"].includes(input.value);
      });
      heat.value = preset === "fire" ? "3" : "1";
      render();
      document.querySelector("#bowl-lab").scrollIntoView({behavior: "smooth", block: "start"});
    });
  });

  document.querySelector("#add-to-bag").addEventListener("click", () => {
    bag += 1;
    bagCount.textContent = String(bag).padStart(2, "0");
    toast.textContent = title.textContent + " is in your demo bag. Total: " + total.textContent + ".";
    toast.classList.add("is-visible");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.classList.remove("is-visible"), 3200);
  });

  render();
})();