const API_URL = "http://127.0.0.1:8000/check-emi";

const form = document.getElementById("applicant-form");
const errorEl = document.getElementById("form-error");
const submitBtn = form.querySelector("button[type='submit']");

form.addEventListener("submit", async function (e) {
  e.preventDefault();
  errorEl.textContent = "";

  const name = document.getElementById("name").value.trim();
  const address = document.getElementById("address").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const salary = document.getElementById("salary").value.trim();
  const bikeCompany = document.getElementById("bike-company").value;

  // basic validation
  if (!name || !address || !phone || !salary || !bikeCompany) {
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

  // this must match your FastAPI pydantic model field names exactly
  const payload = {
    Fullname: name,
    Address: address,
    Phonenumber: phone,
    MonthlySalary: Number(salary),
    BikeCompany: bikeCompany
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

    // eligible: save applicant info + decision, move to bike list
    const applicant = { name, address, phone, salary, bikeCompany, decision: result.decision };
    sessionStorage.setItem("applicant", JSON.stringify(applicant));
    window.location.href = "bike_list.html";

  } catch (err) {
    console.error(err);
    errorEl.textContent = "Could not reach the server. Is your backend running?";
    submitBtn.disabled = false;
    submitBtn.textContent = "Continue";
  }
});