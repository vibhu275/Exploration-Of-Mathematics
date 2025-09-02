/* When the user clicks on the button, 
toggle between hiding and showing the dropdown content */
function myFunction() {
  document.getElementById("myDropdown").classList.toggle("show");
}

// Close the dropdown if the user clicks outside of it
window.onclick = function(event) {
  if (!event.target.matches('.dropbtn')) {
    var dropdowns = document.getElementsByClassName("dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
}

window.onload = function () {
  function generatePascalTriangle(rows) {
    const container = document.getElementById("triangle");
    if (!container) {
      console.error("Triangle container not found!");
      return;
    }

    const triangle = [];

    for (let i = 0; i < rows; i++) {
      triangle[i] = [];

      for (let j = 0; j <= i; j++) {
        triangle[i][j] = (j === 0 || j === i) ? 1 : triangle[i - 1][j - 1] + triangle[i - 1][j];
      }

      const rowDiv = document.createElement("div");
      rowDiv.style.textAlign = "center";

      for (let j = 0; j <= i; j++) {
        const cell = document.createElement("span");
        cell.textContent = triangle[i][j];
        rowDiv.appendChild(cell);
      }

      container.appendChild(rowDiv);
    }
  }

  generatePascalTriangle(10);
};
