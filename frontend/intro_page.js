const API_URL = "http://127.0.0.1:8000/check-emi";

const form = document.getElementById("applicant-form");
const errorEl = document.getElementById("form-error");
const submitBtn = form.querySelector("button[type='submit']");
const bikeSelect = document.getElementById("bike-select");

// When a bike is picked from the dropdown, open its official page in a new tab.
bikeSelect.addEventListener("change", function () {
  const selectedOption = bikeSelect.options[bikeSelect.selectedIndex];
  const link = selectedOption.getAttribute("data-link");
  if (link) {
    window.open(link, "_blank", "noopener");
  }
});

form.addEventListener("submit", async function (e) {
  e.preventDefault();
  errorEl.textContent = "";

  const name = document.getElementById("name").value.trim();
  const address = document.getElementById("address").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const salary = document.getElementById("salary").value.trim();

  const selectedOption = bikeSelect.options[bikeSelect.selectedIndex];
  const bikeValue = bikeSelect.value;
  const bikeName = selectedOption ? selectedOption.textContent : "";
  const bikeCompany = selectedOption ? selectedOption.getAttribute("data-company") : "";

  // basic validation
  if (!name || !address || !phone || !salary || !bikeValue) {
    errorEl.textContent = "Please fill in all fields.";
    return;
  }
  if (!/^\d{10}$/.test(phone)) {
    errorEl.textContent = "Enter a valid 10-digit phone number.";
    return;
  }
  if (Number(salary) <= 0) {
    errorEl.textContent = "Salary must be greater than 0.";
    return;
  }

  // must match your FastAPI pydantic model field names exactly
  const payload = {
    Fullname: name,
    Address: address,
    Phonenumber: phone,
    MonthlySalary: Number(salary),
    BikeCompany: bikeCompany,
    BikeModel: bikeName
  };

  submitBtn.disabled = true;
  submitBtn.textContent = "Checking...";

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`Server responded with status ${response.status}`);
    }

    const result = await response.json();

    if (!result.eligible) {
      errorEl.textContent = result.decision || "You are not eligible right now.";
      submitBtn.disabled = false;
      submitBtn.textContent = "Continue";
      return;
    }

    errorEl.style.color = "#4b5d3a";
    errorEl.textContent = result.decision || "You are eligible!";
    submitBtn.disabled = false;
    submitBtn.textContent = "Continue";

  } catch (err) {
    console.error(err);
    errorEl.textContent = "Could not reach the server. Is your backend running?";
    submitBtn.disabled = false;
    submitBtn.textContent = "Continue";
  }
});