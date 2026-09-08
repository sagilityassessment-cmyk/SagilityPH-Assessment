import { db } from "./firebase.js";
import {
  get,
  onValue,
  push,
  ref,
  set
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-database.js";

const SITE = "QC";
const seatsPath = `locations/${SITE}/seats`;
const queuePath = `locations/${SITE}/queue`;
const mainLocationSelect = document.getElementById("headerLocationSelect");
const seatCards = [...document.querySelectorAll(".seat-card")];
const seatInputs = seatCards.map(card => card.querySelector("input"));
const seatButtons = seatCards.map(card => card.querySelector(".seat-call-button"));

function getSeatNumber(input) {
  return seatInputs.indexOf(input) + 1;
}

function setButtonState(seat, called) {
  const button = seatButtons[seat - 1];
  if (!button) return;
  button.classList.toggle("called", called);
  button.textContent = called ? "CALLED ✓" : "CALL";
}

async function loadSeatValues() {
  const snapshot = await get(ref(db, seatsPath));
  const values = snapshot.val() || {};
  seatInputs.forEach((input, index) => {
    const value = values[index + 1];
    input.value = value === undefined || value === 0 ? "" : String(value);
  });
}

seatInputs.forEach(input => {
  input.addEventListener("change", async () => {
    const seat = getSeatNumber(input);
    await set(ref(db, `${seatsPath}/${seat}`), input.value.trim());
  });
});

seatButtons.forEach((button, index) => {
  button.addEventListener("click", async () => {
    const seat = index + 1;
    const value = seatInputs[index].value.trim();
    if (!value) return;
    const location = mainLocationSelect?.value || "";
    if (!location || location === "Testing") {
      mainLocationSelect?.focus();
      alert("Please select Iloilo City, Quezon City, Alabang, or Bohol first.");
      return;
    }

    await set(ref(db, `${seatsPath}/${seat}`), value);
    await set(push(ref(db, queuePath)), {
      seat,
      id: value,
      location,
      timestamp: Date.now()
    });
    setButtonState(seat, true);
  });
});

document.querySelector(".clear-data-action")?.addEventListener("click", async () => {
  await Promise.all(seatInputs.map((input, index) => {
    input.value = "";
    return set(ref(db, `${seatsPath}/${index + 1}`), "");
  }));
  seatButtons.forEach((_, index) => setButtonState(index + 1, false));
});

document.querySelector(".view-display-action")?.addEventListener("click", () => {
  window.open("display.html", "_blank", "noopener");
});

onValue(ref(db, queuePath), snapshot => {
  const queue = snapshot.val() || {};
  const activeSeats = new Set(Object.values(queue).map(call => Number(call.seat)));
  seatButtons.forEach((_, index) => setButtonState(index + 1, activeSeats.has(index + 1)));
});

loadSeatValues().catch(error => console.error("Unable to load seat values:", error));
