javascript
const raw = sessionStorage.getItem("applicant");

if (!raw) {
  window.location.href = "intro_page.html";
} else {
  const applicant = JSON.parse(raw);

  const companyLabel =
    applicant.bikeCompany === "honda" ? "Honda" : "Kawasaki";

  document.getElementById("page-title").textContent = `${companyLabel} bikes`;

  document.getElementById("page-sub").textContent =
    `Select a ${companyLabel} bike to calculate your EMI.`;

  document.getElementById("applicant-strip").innerHTML = `
    <span>${applicant.name}</span> &middot;
    ${applicant.phone} &middot;
    Salary ₹${Number(applicant.salary).toLocaleString("en-IN")}/mo
  `;

  const bikes = BIKES[applicant.bikeCompany] || [];
  const listEl = document.getElementById("bike-list");

  bikes.forEach((bike) => {
    const row = document.createElement("div");
    row.className = "bike-row";

    row.innerHTML = `
      <div>
        <div class="bike-name">${bike.name}</div>
        <div class="bike-company">
          ₹${bike.price.toLocaleString("en-IN")}
        </div>
      </div>

      <div class="bike-actions">
        <a
          class="bike-link"
          href="${bike.link}"
          target="_blank"
          rel="noopener"
        >
          View details →
        </a>

        <button
          class="select-bike-btn"
          data-bike-id="${bike.id}"
        >
          Calculate EMI →
        </button>
      </div>
    `;

    listEl.appendChild(row);
  });

  document.querySelectorAll(".select-bike-btn").forEach((button) => {
    button.addEventListener("click", () => {
      const bikeId = button.dataset.bikeId;

      const selectedBike = bikes.find(
        (bike) => bike.id === bikeId
      );

      if (!selectedBike) {
        return;
      }

      sessionStorage.setItem(
        "selectedBike",
        JSON.stringify(selectedBike)
      );

      window.location.href = "emi_calculator.html";
    });
  });
}
