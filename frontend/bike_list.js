const raw = sessionStorage.getItem("applicant");

if (!raw) {
  // No applicant data found, send them back to fill the form first.
  window.location.href = "intro_page.html";
} else {
  const applicant = JSON.parse(raw);
  const companyLabel = applicant.bikeCompany === "honda" ? "Honda" : "Kawasaki";

  document.getElementById("page-title").textContent = `${companyLabel} bikes`;
  document.getElementById("page-sub").textContent =
    `Here are the ${companyLabel} models available for an EMI plan.`;

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
        <div class="bike-company">${companyLabel}</div>
      </div>
      <a class="bike-link" href="${bike.link}" target="_blank" rel="noopener">View details &rarr;</a>
    `;
    listEl.appendChild(row);
  });
}