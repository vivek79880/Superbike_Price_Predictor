
const API_URL = "http://127.0.0.1:8000/check-emi";

const form = document.getElementById("applicant-form");
const errorEl = document.getElementById("form-error");
const submitBtn = form.querySelector("button[type='submit']");
const bikeSelect = document.getElementById("bike-select");

// ===============================
// RESTORE SAVED APPLICANT DATA
// ===============================

const savedApplicant = sessionStorage.getItem("applicant");

if (savedApplicant) {

    const applicant = JSON.parse(savedApplicant);

    document.getElementById("name").value = applicant.name || "";
    document.getElementById("address").value = applicant.address || "";
    document.getElementById("phone").value = applicant.phone || "";
    document.getElementById("salary").value = applicant.salary || "";

}


// ===============================
// FORM SUBMIT
// ===============================

form.addEventListener("submit", async function (event) {

    event.preventDefault();

    console.log("CONTINUE BUTTON CLICKED");

    errorEl.textContent = "";
    errorEl.style.color = "#c62828";


    // Get values
    const name = document.getElementById("name").value.trim();
    const address = document.getElementById("address").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const salary = Number(document.getElementById("salary").value);

    const selectedOption =
        bikeSelect.options[bikeSelect.selectedIndex];

    const bikeValue = bikeSelect.value;

    const bikeName =
        selectedOption.textContent.trim();

    const bikeCompany =
        selectedOption.getAttribute("data-company");


    // ===============================
    // VALIDATION
    // ===============================

    if (!name || !address || !phone || !salary || !bikeValue) {
        errorEl.textContent = "Please fill in all fields.";
        return;
    }

    if (!/^\d{10}$/.test(phone)) {
        errorEl.textContent = "Enter a valid 10-digit phone number.";
        return;
    }

    if (salary <= 0) {
        errorEl.textContent = "Salary must be greater than 0.";
        return;
    }


    // ===============================
    // BACKEND DATA
    // ===============================

    const payload = {
        Fullname: name,
        Address: address,
        Phonenumber: phone,
        MonthlySalary: salary,
        BikeCompany: bikeCompany
    };


    console.log("Sending:", payload);


    submitBtn.disabled = true;
    submitBtn.textContent = "Checking...";


    try {

        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });


        console.log("Backend status:", response.status);


        if (!response.ok) {
            throw new Error(
                "Backend returned " + response.status
            );
        }


        const result = await response.json();

        console.log("Backend response:", result);


        // ===============================
        // NOT ELIGIBLE
        // ===============================

        if (!result.eligible) {

            errorEl.textContent =
                result.decision ||
                "You are not eligible right now.";

            submitBtn.disabled = false;
            submitBtn.textContent = "Continue";

            return;
        }


        // ===============================
        // SAVE APPLICANT
        // ===============================

        sessionStorage.setItem(
            "applicant",
            JSON.stringify({
                name: name,
                address: address,
                phone: phone,
                salary: salary,
                bikeCompany: bikeCompany,
                bikeModel: bikeName
            })
        );


// ===============================
// SAVE SELECTED BIKE
// ===============================

const companyKey = bikeCompany.toLowerCase();

const selectedBike = (BIKES[companyKey] || []).find(
    bike => bike.id === bikeValue
);

if (!selectedBike) {
    throw new Error("Selected bike not found in bikes_data.js");
}

sessionStorage.setItem(
    "selectedBike",
    JSON.stringify(selectedBike)
);


        // ===============================
        // GO TO NEXT PAGE
        // ===============================

        window.location.href = "emi_calculator.html";

    }

    catch (error) {

        console.error("ERROR:", error);

        errorEl.textContent =
            "Could not reach the server. Is your backend running?";

        submitBtn.disabled = false;
        submitBtn.textContent = "Continue";
    }

});

