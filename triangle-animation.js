// Interval variable specifically for the triangle animation
let triangleAnimationInterval = null;

document.addEventListener("DOMContentLoaded", () => {
  // This script is responsible for creating the triangle tables
  createTables();

  // --- Triangle Table Controls ---
  const startTriangleBtn = document.getElementById("startTriangle");
  const resetTriangleBtn = document.getElementById("resetTriangle");
  const triangleInputN = document.getElementById("nTriangle");
  const triangleSpeedSlider = document.getElementById("triangleSpeed");

  // Event listener for starting the triangle table animation
  startTriangleBtn.addEventListener("click", () => {
    const n = parseInt(triangleInputN.value);
    const speed = parseInt(triangleSpeedSlider.value);
    if (isNaN(n) || n < 1 || n > 36) {
      console.error("Please enter a number between 1 and 36 for the triangle tables.");
      return;
    }
    animateTriangleTables(n, speed);
  });

  // Event listener for resetting ONLY the triangle table animation
  resetTriangleBtn.addEventListener("click", () => {
    clearInterval(triangleAnimationInterval);
    clearAllHighlights(); // This will clear all tables, which is expected on reset
  });
});

/**
 * Creates the numerator (p) and denominator (q) tables dynamically.
 */
function createTables() {
  const rows = 6;
  const cols = 6;
  const denBody = document.querySelector("#denTable tbody");
  const numBody = document.querySelector("#numTable tbody");

  // Avoid re-creating tables if they already exist
  if (denBody.children.length > 0 || numBody.children.length > 0) {
      return;
  }

  for (let i = 0; i < rows; i++) {
    const denRow = document.createElement("tr");
    const numRow = document.createElement("tr");

    for (let j = 0; j < cols; j++) {
      const denTd = document.createElement("td");
      const numTd = document.createElement("td");

      if (j <= i) {
        denTd.id = `den_q_${i}_${j}`;
        numTd.id = `num_p_${i}_${j}`;
        denTd.textContent = j + 1;
        numTd.textContent = i - j + 1;
      }

      denRow.appendChild(denTd);
      numRow.appendChild(numTd);
    }

    denBody.appendChild(denRow);
    numBody.appendChild(numRow);
  }
}

/**
 * Animates the sequence ONLY on the triangle tables.
 * @param {number} n - The term in the sequence to highlight.
 * @param {number} speed - The speed of the animation in milliseconds.
 */
function animateTriangleTables(n, speed) {
  clearAllHighlights();
  if (triangleAnimationInterval) clearInterval(triangleAnimationInterval);

  const pqPairs = [];

  // Generate the sequence of p,q pairs up to the nth term
  for (let sum = 2; pqPairs.length < n; sum++) {
    for (let q = 1; q < sum; q++) {
      let p = sum - q;
      if (p <= 6 && q <= 6) {
        pqPairs.push({ p, q });
        if (pqPairs.length >= n) break;
      }
    }
  }

  let i = 0;
  triangleAnimationInterval = setInterval(() => {
    if (i >= pqPairs.length) {
      clearInterval(triangleAnimationInterval);
      return;
    }

    const { p, q } = pqPairs[i];
    const r = p + q - 2;
    const c = q - 1;
    const num = document.getElementById(`num_p_${r}_${c}`);
    const den = document.getElementById(`den_q_${r}_${c}`);
    const currentStep = i + 1;
    
    if (num && den) {
      num.classList.add("highlight");
      den.classList.add("highlight");

      setTimeout(() => {
        num.classList.remove("highlight");
        den.classList.remove("highlight");

        const isFinalCell = (currentStep === n);
        const className = isFinalCell ? "final-highlight" : "visited";
        
        num.classList.add(className);
        den.classList.add(className);

      }, speed - 100);
    }
    i++;
  }, speed);
}

/**
 * Clears all visual highlights from all table cells.
 * This function is duplicated in both files to keep them independent.
 */
function clearAllHighlights() {
  document.querySelectorAll("td").forEach((cell) => {
    cell.classList.remove("highlight", "visited", "final-highlight");
  });
}
