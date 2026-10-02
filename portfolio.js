(() => {
  const filters = Array.from(document.querySelectorAll(".filter"));
  const cards = Array.from(document.querySelectorAll(".work-card"));
  const count = document.querySelector("#project-count");

  filters.forEach((button) => {
    button.addEventListener("click", () => {
      const category = button.dataset.filter;
      filters.forEach((filter) => {
        const active = filter === button;
        filter.classList.toggle("is-active", active);
        filter.setAttribute("aria-pressed", String(active));
      });
      const visible = cards.filter((card) => {
        const show = category === "all" || card.dataset.category === category;
        card.hidden = !show;
        return show;
      }).length;
      count.textContent = String(visible).padStart(2, "0") + " PROJECT" + (visible === 1 ? "" : "S");
    });
  });
})();