
const rawBike = sessionStorage.getItem("selectedBike");

if (!rawBike) {
  window.location.href = "intro_page.html";
}

const bike = JSON.parse(rawBike);


// --------------------------------------------------
// ELEMENTS
// --------------------------------------------------

const bikeName = document.getElementById("bike-name");
const bikePrice = document.getElementById("bike-price");
const background = document.getElementById("emi-background");

const downpayment = document.getElementById("downpayment");
const loanAmount = document.getElementById("loan-amount");
const months = document.getElementById("months");
const interest = document.getElementById("interest");

const downpaymentValue =
  document.getElementById("downpayment-value");

const loanValue =
  document.getElementById("loan-value");

const monthsValue =
  document.getElementById("months-value");

const interestValue =
  document.getElementById("interest-value");

const emiValue =
  document.getElementById("emi-value");

const emiDuration =
  document.getElementById("emi-duration");

const resultLoan =
  document.getElementById("result-loan");

const resultInterestRate =
  document.getElementById("result-interest-rate");

const resultTotalInterest =
  document.getElementById("result-total-interest");

const resultTotal =
  document.getElementById("result-total");


// --------------------------------------------------
// FORMAT RUPEES
// --------------------------------------------------

function formatRupees(value) {
  return `₹${Math.round(value).toLocaleString("en-IN")}`;
}


// --------------------------------------------------
// SET BIKE INFORMATION
// --------------------------------------------------

bikeName.textContent = bike.name;

bikePrice.textContent =
  formatRupees(bike.price);

background.style.backgroundImage =
  `url("${bike.image}")`;


// --------------------------------------------------
// CALCULATE EMI
// --------------------------------------------------

function calculateEMI() {

  const bikePriceAmount = bike.price;

  // Down payment percentage
  const downPaymentPercent =
    Number(downpayment.value);

  // Loan percentage
  const loanPercent =
    Number(loanAmount.value);

  // Months
  const numberOfMonths =
    Number(months.value);

  // Annual interest rate
  const annualInterest =
    Number(interest.value);


  // ------------------------------------------------
  // CALCULATE DOWN PAYMENT
  // ------------------------------------------------

  const calculatedDownPayment =
    bikePriceAmount * (downPaymentPercent / 100);


  // ------------------------------------------------
  // CALCULATE LOAN AMOUNT
  // ------------------------------------------------

  const calculatedLoanAmount =
    bikePriceAmount * (loanPercent / 100);


  // ------------------------------------------------
  // MONTHLY INTEREST RATE
  // ------------------------------------------------

  const monthlyInterestRate =
    annualInterest / 12 / 100;


  // ------------------------------------------------
  // EMI FORMULA
  // ------------------------------------------------

  let emi = 0;

  if (monthlyInterestRate === 0) {

    emi =
      calculatedLoanAmount /
      numberOfMonths;

  } else {

    emi =
      calculatedLoanAmount *
      monthlyInterestRate *
      Math.pow(
        1 + monthlyInterestRate,
        numberOfMonths
      ) /
      (
        Math.pow(
          1 + monthlyInterestRate,
          numberOfMonths
        ) - 1
      );
  }


  // ------------------------------------------------
  // TOTAL PAYMENT
  // ------------------------------------------------

  const totalPayment =
    emi * numberOfMonths;


  // ------------------------------------------------
  // TOTAL INTEREST
  // ------------------------------------------------

  const totalInterest =
    totalPayment - calculatedLoanAmount;


  // ------------------------------------------------
  // UPDATE UI
  // ------------------------------------------------

  downpaymentValue.textContent =
    `${formatRupees(calculatedDownPayment)} (${downPaymentPercent}%)`;

  loanValue.textContent =
    formatRupees(calculatedLoanAmount);

  monthsValue.textContent =
    `${numberOfMonths} months`;

  interestValue.textContent =
    `${annualInterest.toFixed(1)}%`;

  emiValue.textContent =
    formatRupees(emi);

  emiDuration.textContent =
    `for ${numberOfMonths} months`;

  resultLoan.textContent =
    formatRupees(calculatedLoanAmount);

  resultInterestRate.textContent =
    `${annualInterest.toFixed(1)}%`;

  resultTotalInterest.textContent =
    formatRupees(totalInterest);

  resultTotal.textContent =
    formatRupees(totalPayment);
}


// --------------------------------------------------
// EVENTS
// --------------------------------------------------

downpayment.addEventListener(
  "input",
  function () {

    // If down payment changes,
    // loan amount automatically becomes
    // the remaining amount.

    const downPaymentPercent =
      Number(this.value);

    const remainingLoanPercent =
      100 - downPaymentPercent;

    loanAmount.value =
      remainingLoanPercent;

    calculateEMI();
  }
);


loanAmount.addEventListener(
  "input",
  function () {

    const loanPercent =
      Number(this.value);

    const correspondingDownPayment =
      100 - loanPercent;

    downpayment.value =
      correspondingDownPayment;

    calculateEMI();
  }
);


months.addEventListener(
  "input",
  calculateEMI
);


interest.addEventListener(
  "input",
  calculateEMI
);


// --------------------------------------------------
// INITIAL CALCULATION
// --------------------------------------------------

calculateEMI();

