// Global interval variable for the animation timer
let interval = null;

document.addEventListener("DOMContentLoaded", () => {
  // Rational Table Controls
  const startRational = document.getElementById("startRational");
  const resetRational = document.getElementById("resetRational");
  const rationalInput = document.getElementById("nRational");
  const rationalSpeed = document.getElementById("speedRational");

  startRational.addEventListener("click", () => {
    const n = parseInt(rationalInput.value);
    const speed = parseInt(rationalSpeed.value);
    if (isNaN(n) || n < 1 || n > 36) {
      // Using a custom modal for alerts would be better than alert()
      console.error("Please enter a number between 1 and 36.");
      return;
    }
    highlightRationalSequence(n, speed);
  });

  resetRational.addEventListener("click", () => {
    clearInterval(interval);
    clearAllHighlights();
  });
});

/**
 * Clears all visual highlights from the tables.
 */
function clearAllHighlights() {
  document.querySelectorAll("td").forEach((cell) => {
    cell.classList.remove("highlight", "visited", "final-highlight");
  });
}

/**
 * Animates the sequence on the rational numbers table.
 * @param {number} n - The term in the sequence to highlight.
 * @param {number} speed - The speed of the animation in milliseconds.
 */
function highlightRationalSequence(n, speed) {
  clearAllHighlights();
  if (interval) clearInterval(interval);

  let diagonal = 2;
  let pqPairs = [];

  // Generate the sequence of p,q pairs up to n
  while (pqPairs.length < n) {
    for (let q = 1; q < diagonal; q++) {
      const p = diagonal - q;
      if (p >= 1 && q >= 1) {
        // We don't need to check if the cell exists here,
        // we can do that during the animation.
        pqPairs.push({ p, q });
        if (pqPairs.length >= n) break;
      }
    }
    diagonal++;
  }

  let i = 0;

  interval = setInterval(() => {
    if (i >= pqPairs.length) {
      clearInterval(interval);
      return;
    }

    const { p, q } = pqPairs[i];
    const cell = document.getElementById(`${p}_${q}`);
    const current = i + 1;

    if (cell) {
      cell.classList.add("highlight");

      // Highlight corresponding cell in the triangle table
      const numCell = document.getElementById(`num_p_${p + q - 2}_${q - 1}`);
      const denCell = document.getElementById(`den_q_${p + q - 2}_${q - 1}`);
      if (numCell) numCell.classList.add("highlight");
      if (denCell) denCell.classList.add("highlight");


      setTimeout(() => {
        cell.classList.remove("highlight");
        if(numCell) numCell.classList.remove("highlight");
        if(denCell) denCell.classList.remove("highlight");

        if (current === n) {
          cell.classList.add("final-highlight");
           if(numCell) numCell.classList.add("final-highlight");
           if(denCell) denCell.classList.add("final-highlight");
        } else {
          cell.classList.add("visited");
          // FIX: Also apply the "visited" class to the triangle table cells
          if(numCell) numCell.classList.add("visited");
          if(denCell) denCell.classList.add("visited");
        }
      }, speed - 100);
    }

    i++;
  }, speed);
}
