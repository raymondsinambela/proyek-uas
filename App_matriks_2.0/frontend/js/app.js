/* ============================================
   APP MATRIKS 2.0
   NAVIGATION + MATRIX CALCULATOR
============================================ */


/* ============================================
   1. NAVIGATION ELEMENTS
============================================ */

const introPage = document.getElementById("introPage");
const materialPage = document.getElementById("materialPage");
const methodPage = document.getElementById("methodPage");
const calculatorPage = document.getElementById("calculatorPage");
const obeChoicePage = document.getElementById("obeChoicePage");
const equationPage = document.getElementById("equationPage");

const startButton = document.getElementById("startButton");
const matrixMaterial = document.getElementById("matrixMaterial");
const obeMethod = document.getElementById("obeMethod");
const obeMatrixChoice = document.getElementById("obeMatrixChoice");
const obeEquationChoice = document.getElementById("obeEquationChoice");

const backToIntro = document.getElementById("backToIntro");
const backToMaterial = document.getElementById("backToMaterial");
const backToMethod = document.getElementById("backToMethod");
const backToMethodFromObe = document.getElementById("backToMethodFromObe");
const backToObeChoice = document.getElementById("backToObeChoice");


/* ============================================
   2. CALCULATOR ELEMENTS
============================================ */

const rowsInput = document.getElementById("rows");
const colsInput = document.getElementById("cols");

const matrixGrid = document.getElementById("matrixGrid");

const applySizeButton = document.getElementById("applySize");
const solveButton = document.getElementById("solveButton");
const clearButton = document.getElementById("clearButton");

const themeToggle = document.getElementById("themeToggle");

const emptyState = document.getElementById("emptyState");
const resultContent = document.getElementById("resultContent");

const resultMatrix = document.getElementById("resultMatrix");
const stepsList = document.getElementById("stepsList");

const errorMessage = document.getElementById("errorMessage");

// OBE PERSAMAAN
const equationCountInput = document.getElementById("equationCount");
const applyEquationCountButton = document.getElementById("applyEquationCount");
const equationInputs = document.getElementById("equationInputs");
const clearEquationsButton = document.getElementById("clearEquations");
const solveEquationsButton = document.getElementById("solveEquations");
const equationError = document.getElementById("equationError");
const equationEmptyState = document.getElementById("equationEmptyState");
const equationResultContent = document.getElementById("equationResultContent");
const equationInitialMatrix = document.getElementById("equationInitialMatrix");
const equationResultMatrix = document.getElementById("equationResultMatrix");
const equationSolution = document.getElementById("equationSolution");
const equationStepsList = document.getElementById("equationStepsList");

let currentEquationCount = 2;


/* ============================================
   3. CURRENT MATRIX DIMENSIONS
============================================ */

let currentRows = 2;
let currentCols = 3;


/* ============================================
   4. PAGE NAVIGATION
============================================ */

function showPage(page) {

    const pages = [
        introPage,
        materialPage,
        methodPage,
        calculatorPage,
        obeChoicePage,
        equationPage
    ];

    pages.forEach(item => {
        item.hidden = true;
    });

    page.hidden = false;

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


/* NAVIGATION EVENTS */

startButton.addEventListener("click", () => {
    showPage(materialPage);
});

matrixMaterial.addEventListener("click", () => {
    showPage(methodPage);
});

obeMethod.addEventListener("click", () => {
    showPage(obeChoicePage);
});

obeMatrixChoice.addEventListener("click", () => {
    resetResult();
    hideError();
    showPage(calculatorPage);
});

obeEquationChoice.addEventListener("click", () => {
    resetEquationResult();
    hideEquationError();
    showPage(equationPage);
});

backToMethodFromObe.addEventListener("click", () => {
    showPage(methodPage);
});

backToObeChoice.addEventListener("click", () => {
    showPage(obeChoicePage);
});

backToIntro.addEventListener("click", () => {
    showPage(introPage);
});

backToMaterial.addEventListener("click", () => {
    showPage(materialPage);
});

backToMethod.addEventListener("click", () => {
    showPage(methodPage);
});


/* ============================================
   5. VALIDASI UKURAN MATRIKS
============================================ */

function validateDimensions(rows, cols) {

    if (
        !Number.isSafeInteger(rows) ||
        !Number.isSafeInteger(cols) ||
        rows < 1 ||
        cols < 1
    ) {
        throw new Error(
            "Baris dan kolom harus berupa bilangan bulat positif."
        );
    }

}


/* ============================================
   6. MEMBUAT INPUT MATRIKS
============================================ */

function createMatrix(rows, cols, previousMatrix = []) {

    validateDimensions(rows, cols);

    matrixGrid.replaceChildren();

    matrixGrid.style.gridTemplateColumns =
        `repeat(${cols}, 65px)`;

    matrixGrid.style.width = "max-content";

    for (let i = 0; i < rows; i++) {

        for (let j = 0; j < cols; j++) {

            const input = document.createElement("input");

            input.type = "number";
            input.step = "any";
            input.className = "matrix-input";
            input.placeholder = "0";

            input.setAttribute(
                "aria-label",
                `Baris ${i + 1}, kolom ${j + 1}`
            );

            if (
                previousMatrix[i] &&
                previousMatrix[i][j] !== undefined
            ) {

                input.value = previousMatrix[i][j];

            } else {

                input.value = i === j ? 1 : 0;

            }

            matrixGrid.appendChild(input);

        }

    }

    currentRows = rows;
    currentCols = cols;

    console.log(
        `Matriks berhasil dibuat: ${rows} × ${cols}`
    );

}


/* ============================================
   7. MEMBACA MATRIKS LAMA
============================================ */

function getCurrentMatrixSafely() {

    const inputs = matrixGrid.querySelectorAll("input");

    const matrix = [];

    if (inputs.length !== currentRows * currentCols) {
        return [];
    }

    for (let i = 0; i < currentRows; i++) {

        const row = [];

        for (let j = 0; j < currentCols; j++) {

            const index = i * currentCols + j;

            row.push(inputs[index].value);

        }

        matrix.push(row);

    }

    return matrix;

}


/* ============================================
   8. MENGUBAH UKURAN MATRIKS
============================================ */

function changeMatrixSize() {

    const rows = Number(rowsInput.value);
    const cols = Number(colsInput.value);

    try {

        validateDimensions(rows, cols);

        const oldMatrix = getCurrentMatrixSafely();

        createMatrix(rows, cols, oldMatrix);

        resetResult();
        hideError();

        console.log(
            `Ukuran baru: ${rows} × ${cols}`
        );

    } catch (error) {

        showError(error.message);

    }

}


/* ============================================
   9. MEMBACA MATRIKS UNTUK PERHITUNGAN
============================================ */

function getMatrix() {

    const inputs = matrixGrid.querySelectorAll("input");

    const matrix = [];

    if (inputs.length !== currentRows * currentCols) {

        throw new Error(
            "Jumlah kotak input tidak sesuai dengan ukuran matriks."
        );

    }

    for (let i = 0; i < currentRows; i++) {

        const row = [];

        for (let j = 0; j < currentCols; j++) {

            const index = i * currentCols + j;

            const input = inputs[index];

            const rawValue = input.value.trim();

            if (rawValue === "") {

                throw new Error(
                    `Elemen baris ${i + 1}, kolom ${j + 1} belum diisi.`
                );

            }

            const value = Number(rawValue);

            if (!Number.isFinite(value)) {

                throw new Error(
                    `Elemen baris ${i + 1}, kolom ${j + 1} tidak valid.`
                );

            }

            row.push(value);

        }

        matrix.push(row);

    }

    return matrix;

}


/* ============================================
   10. RESET HASIL
============================================ */

function resetResult() {

    resultMatrix.replaceChildren();
    stepsList.replaceChildren();

    resultContent.hidden = true;
    emptyState.hidden = false;

}


/* ============================================
   11. MEMBERSIHKAN MATRIKS
============================================ */

function clearMatrix() {

    const inputs = matrixGrid.querySelectorAll("input");

    inputs.forEach(input => {

        input.value = "";

    });

    resetResult();
    hideError();

}


/* ============================================
   12. FORMAT ANGKA
============================================ */

function formatNumber(value) {

    const number = Number(value);

    if (!Number.isFinite(number)) {
        return String(value);
    }

    if (Math.abs(number) < 1e-10) {
        return "0";
    }

    if (
        Math.abs(number - Math.round(number)) < 1e-9
    ) {

        return String(Math.round(number));

    }

    return Number(number.toPrecision(7)).toString();

}


/* ============================================
   13. MENAMPILKAN HASIL MATRIKS
============================================ */

function displayResult(matrix) {

    resultMatrix.replaceChildren();

    matrix.forEach(row => {

        const rowElement = document.createElement("div");

        rowElement.className = "result-row";

        row.forEach(value => {

            const cell = document.createElement("span");

            cell.className = "result-cell";

            cell.textContent = formatNumber(value);

            rowElement.appendChild(cell);

        });

        resultMatrix.appendChild(rowElement);

    });

}


/* ============================================
   14. MEMBUAT MATRIKS LANGKAH OBE
============================================ */

function createStepMatrix(matrix) {

    const wrapper = document.createElement("div");

    wrapper.className = "step-matrix";

    matrix.forEach(row => {

        const rowElement = document.createElement("div");

        rowElement.className = "step-matrix-row";

        row.forEach(value => {

            const cell = document.createElement("span");

            cell.className = "step-matrix-cell";

            cell.textContent = formatNumber(value);

            rowElement.appendChild(cell);

        });

        wrapper.appendChild(rowElement);

    });

    return wrapper;

}


/* ============================================
   15. MENAMPILKAN LANGKAH PENGERJAAN
============================================ */

function displaySteps(steps, targetContainer = stepsList) {

    targetContainer.replaceChildren();

    steps.forEach((step, index) => {

        const card = document.createElement("div");

        card.className = "step-card";

        const operation = document.createElement("div");

        operation.className = "step-operation";

        operation.textContent =
            `${index + 1}. ${step.operasi || "Operasi OBE"}`;

        const description = document.createElement("p");

        description.className = "step-description";

        description.textContent =
            step.keterangan || "";

        card.appendChild(operation);
        card.appendChild(description);

        if (Array.isArray(step.matriks)) {

            card.appendChild(
                createStepMatrix(step.matriks)
            );

        }

        targetContainer.appendChild(card);

    });

}


/* ============================================
   16. PERHITUNGAN OBE MELALUI FLASK
============================================ */

async function solveMatrix() {

    hideError();

    let matrix;

    try {

        matrix = getMatrix();

    } catch (error) {

        showError(error.message);

        return;

    }

    solveButton.disabled = true;

    solveButton.textContent = "Menghitung...";

    try {

        const response = await fetch("/api/obe", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                matriks: matrix
            })

        });

        const data = await response.json();

        if (!response.ok) {

            throw new Error(
                data.error || "Perhitungan gagal."
            );

        }

        if (
            !Array.isArray(data.hasil) ||
            !Array.isArray(data.langkah)
        ) {

            throw new Error(
                "Format hasil dari backend tidak sesuai."
            );

        }

        displayResult(data.hasil);

        displaySteps(data.langkah);

        emptyState.hidden = true;

        resultContent.hidden = false;

    } catch (error) {

        showError(
            error.message +
            " Periksa koneksi Flask."
        );

    } finally {

        solveButton.disabled = false;

        solveButton.textContent = "Hitung Matriks →";

    }

}


/* ============================================
   17. OBE PERSAMAAN
============================================ */

function createEquationInputs(count, previousValues = []) {

    if (!Number.isInteger(count) || count < 1 || count > 10) {
        throw new Error(
            "Jumlah persamaan harus antara 1 sampai 10."
        );
    }

    equationInputs.replaceChildren();

    for (let i = 0; i < count; i++) {

        const wrapper = document.createElement("div");

        wrapper.style.display = "grid";
        wrapper.style.gap = "6px";

        const label = document.createElement("label");

        label.textContent = `Persamaan ${i + 1}`;
        label.htmlFor = `equation-${i}`;

        const input = document.createElement("input");

        input.type = "text";
        input.id = `equation-${i}`;
        input.className = "equation-input";

        input.placeholder = i === 0
            ? "Contoh: 2x + y = 5"
            : "Contoh: x - y = 1";

        input.value = previousValues[i] || "";
        input.autocomplete = "off";
        input.spellcheck = false;

        wrapper.append(label, input);
        equationInputs.appendChild(wrapper);

    }

    currentEquationCount = count;
    equationCountInput.value = count;

}


function getEquationValues() {

    return Array.from(
        equationInputs.querySelectorAll("input")
    ).map(input => input.value.trim());

}


function resetEquationResult() {

    equationInitialMatrix.replaceChildren();
    equationResultMatrix.replaceChildren();
    equationSolution.replaceChildren();
    equationStepsList.replaceChildren();

    equationResultContent.hidden = true;
    equationEmptyState.hidden = false;

}


function showEquationError(message) {

    equationError.textContent = message;

}


function hideEquationError() {

    equationError.textContent = "";

}


function displayEquationMatrix(container, matrix) {

    container.replaceChildren();

    container.appendChild(
        createStepMatrix(matrix)
    );

}


function displayEquationSolution(data) {

    equationSolution.replaceChildren();

    const heading = document.createElement("h3");

    heading.textContent = "Kesimpulan";

    equationSolution.appendChild(heading);

    const paragraph = document.createElement("p");

    if (data.status === "solusi_tunggal") {

        paragraph.textContent =
            "Sistem memiliki solusi tunggal.";

        equationSolution.appendChild(paragraph);

        const list = document.createElement("ul");

        data.variabel.forEach(variable => {

            const item = document.createElement("li");

            const value = data.solusi[variable];

            item.textContent =
                `${variable} = ${formatNumber(value)}`;

            list.appendChild(item);

        });

        equationSolution.appendChild(list);

    } else if (data.status === "banyak_solusi") {

        paragraph.textContent =
            `Sistem memiliki banyak solusi. Variabel bebas: ${data.variabel_bebas.join(", ")}.`;

        equationSolution.appendChild(paragraph);

    } else if (data.status === "tidak_ada_solusi") {

        paragraph.textContent =
            "Sistem tidak memiliki solusi karena persamaannya saling bertentangan.";

        equationSolution.appendChild(paragraph);

    } else {

        paragraph.textContent =
            "Status solusi tidak dikenali.";

        equationSolution.appendChild(paragraph);

    }

}


/* ============================================
   18. MENGHITUNG OBE PERSAMAAN
============================================ */

async function solveEquations() {

    hideEquationError();

    const equations = getEquationValues();

    if (
        equations.length === 0 ||
        equations.some(value => value === "")
    ) {

        showEquationError(
            "Semua kolom persamaan harus diisi."
        );

        return;

    }

    solveEquationsButton.disabled = true;

    solveEquationsButton.textContent = "Menghitung...";

    try {

        const response = await fetch("/api/persamaan", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                persamaan: equations
            })

        });

        const data = await response.json();

        if (!response.ok) {

            throw new Error(
                data.error || "Perhitungan persamaan gagal."
            );

        }

        if (
            !Array.isArray(data.matriks_awal) ||
            !Array.isArray(data.hasil_rref) ||
            !Array.isArray(data.langkah) ||
            !Array.isArray(data.variabel)
        ) {

            throw new Error(
                "Format hasil persamaan dari backend tidak sesuai."
            );

        }

        displayEquationMatrix(
            equationInitialMatrix,
            data.matriks_awal
        );

        displayEquationMatrix(
            equationResultMatrix,
            data.hasil_rref
        );

        displayEquationSolution(data);

        displaySteps(
            data.langkah,
            equationStepsList
        );

        equationEmptyState.hidden = true;
        equationResultContent.hidden = false;

    } catch (error) {

        showEquationError(
            error.message + " Periksa koneksi Flask."
        );

    } finally {

        solveEquationsButton.disabled = false;

        solveEquationsButton.textContent = "Selesaikan →";

    }

}


/* ============================================
   19. EVENT LISTENERS OBE PERSAMAAN
============================================ */

applyEquationCountButton.addEventListener("click", () => {

    const previous = getEquationValues();

    const count = Number(equationCountInput.value);

    try {

        createEquationInputs(count, previous);

        resetEquationResult();
        hideEquationError();

    } catch (error) {

        showEquationError(error.message);

    }

});


clearEquationsButton.addEventListener("click", () => {

    createEquationInputs(currentEquationCount);

    resetEquationResult();
    hideEquationError();

});


solveEquationsButton.addEventListener(
    "click",
    solveEquations
);


/* ============================================
   20. PESAN ERROR
============================================ */

function showError(message) {

    errorMessage.textContent = message;

}


function hideError() {

    errorMessage.textContent = "";

}


/* ============================================
   21. DARK MODE DAN LIGHT MODE
============================================ */

function setTheme(theme) {

    document.body.classList.toggle(
        "light-mode",
        theme === "light"
    );

    themeToggle.textContent =
        theme === "dark"
            ? "☀ Light Mode"
            : "☾ Dark Mode";

    localStorage.setItem("matrixTheme", theme);

}


function toggleTheme() {

    const isLight =
        document.body.classList.contains("light-mode");

    setTheme(isLight ? "dark" : "light");

}


/* ============================================
   22. EVENT LISTENERS KALKULATOR
============================================ */

applySizeButton.addEventListener(
    "click",
    changeMatrixSize
);

solveButton.addEventListener(
    "click",
    solveMatrix
);

clearButton.addEventListener(
    "click",
    clearMatrix
);

themeToggle.addEventListener(
    "click",
    toggleTheme
);


/* ============================================
   23. INISIALISASI APLIKASI
============================================ */

// Halaman pertama yang ditampilkan.
showPage(introPage);


// Mengambil tema yang sebelumnya dipilih.
let savedTheme = "dark";

try {

    savedTheme =
        localStorage.getItem("matrixTheme") || "dark";

} catch (error) {

    console.warn(
        "Penyimpanan tema tidak tersedia."
    );

}

setTheme(savedTheme);


// Membaca ukuran awal dari HTML.
const initialRows = Number(rowsInput.value) || 2;
const initialCols = Number(colsInput.value) || 3;


// Membuat matriks awal.
createMatrix(initialRows, initialCols);


// Membuat dua input persamaan awal.
createEquationInputs(currentEquationCount);


// Menyiapkan tampilan hasil.
resetResult();


console.log(
    "App Matriks 2.0 berhasil dimuat!"
);