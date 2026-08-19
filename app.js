// ========================================
// DATA BERAT STANDAR
// ========================================

const standardWeights = {

    "0.50": 9.35,
    "0.60": 11.22,
    "0.70": 13.09,
    "0.80": 14.96,
    "0.90": 16.83,
    "1.00": 18.70,
    "1.10": 20.57,
    "1.20": 22.44,
    "1.30": 24.31,
    "1.40": 26.18

};


// ========================================
// ELEMENT
// ========================================

const intervalInput =
    document.getElementById("interval");

const standardWeight =
    document.getElementById("standardWeight");

const fieldWeight =
    document.getElementById("fieldWeight");

const calculateButton =
    document.getElementById("calculateButton");

const resultBox =
    document.getElementById("resultBox");

const weightRecovery =
    document.getElementById("weightRecovery");

const historyTable =
    document.getElementById("historyTable");

const clearHistoryButton =
    document.getElementById("clearHistory");

const onlineStatus =
    document.getElementById("onlineStatus");


// ========================================
// HISTORY
// ========================================

let history =
    JSON.parse(
        localStorage.getItem("weightRecoveryHistory")
    ) || [];


// ========================================
// FORMAT ANGKA
// ========================================

function formatNumber(number) {

    return Number(number)
        .toFixed(2)
        .replace(".", ",");

}


// ========================================
// INTERVAL BERUBAH
// ========================================

intervalInput.addEventListener(
    "change",
    function () {

        const interval =
            intervalInput.value;


        if (!interval) {

            standardWeight.textContent =
                "0.00 kg";

            return;
        }


        const weight =
            standardWeights[interval];


        standardWeight.textContent =
            `${formatNumber(weight)} kg`;

    }
);


// ========================================
// HITUNG
// ========================================

calculateButton.addEventListener(
    "click",
    calculateRecovery
);


function calculateRecovery() {

    const interval =
        intervalInput.value;

    const field =
        parseFloat(fieldWeight.value);


    // VALIDASI

    if (!interval) {

        alert(
            "Silakan pilih Interval Ore."
        );

        return;
    }


    if (
        isNaN(field) ||
        field < 0
    ) {

        alert(
            "Masukkan Berat Lapangan yang valid."
        );

        return;
    }


    // BERAT STANDAR

    const standard =
        standardWeights[interval];


    // RUMUS

    const recovery =
        (field / standard) * 100;


    // TAMPILKAN HASIL

    weightRecovery.textContent =
        `${formatNumber(recovery)}%`;


    resultBox.classList.remove(
        "hidden"
    );


    // SIMPAN HISTORY

    const data = {

        interval:
            parseFloat(interval),

        standard,

        field,

        recovery,

        date:
            new Date().toISOString()

    };


    history.unshift(data);


    // MAKSIMAL 50 DATA

    if (history.length > 50) {

        history =
            history.slice(0, 50);

    }


    saveHistory();

    renderHistory();

}


// ========================================
// LOCAL STORAGE
// ========================================

function saveHistory() {

    localStorage.setItem(
        "weightRecoveryHistory",
        JSON.stringify(history)
    );

}


// ========================================
// TAMPILKAN HISTORY
// ========================================

function renderHistory() {

    historyTable.innerHTML = "";


    if (history.length === 0) {

        historyTable.innerHTML = `
            <tr>
                <td
                    colspan="4"
                    style="text-align:center"
                >
                    Belum ada data
                </td>
            </tr>
        `;

        return;
    }


    history.forEach(
        function (item) {

            const row =
                document.createElement("tr");


            row.innerHTML = `

                <td>
                    ${formatNumber(item.interval)} m
                </td>

                <td>
                    ${formatNumber(item.standard)} kg
                </td>

                <td>
                    ${formatNumber(item.field)} kg
                </td>

                <td>
                    ${formatNumber(item.recovery)}%
                </td>

            `;


            historyTable.appendChild(row);

        }
    );

}


// ========================================
// HAPUS HISTORY
// ========================================

clearHistoryButton.addEventListener(
    "click",
    function () {

        if (
            history.length === 0
        ) {

            return;
        }


        const confirmDelete =
            confirm(
                "Hapus semua riwayat?"
            );


        if (!confirmDelete) {

            return;
        }


        history = [];

        saveHistory();

        renderHistory();

    }
);


// ========================================
// STATUS INTERNET
// ========================================

function updateOnlineStatus() {

    if (navigator.onLine) {

        onlineStatus.textContent =
            "● Online";

        onlineStatus.style.color =
            "#16a34a";

    } else {

        onlineStatus.textContent =
            "● Offline";

        onlineStatus.style.color =
            "#dc2626";

    }

}


window.addEventListener(
    "online",
    updateOnlineStatus
);


window.addEventListener(
    "offline",
    updateOnlineStatus
);


// ========================================
// SERVICE WORKER
// ========================================

if (
    "serviceWorker"
    in navigator
) {

    window.addEventListener(
        "load",
        function () {

            navigator.serviceWorker
                .register("sw.js")
                .then(
                    function () {

                        console.log(
                            "Service Worker aktif."
                        );

                    }
                )
                .catch(
                    function (error) {

                        console.error(
                            "Service Worker gagal:",
                            error
                        );

                    }
                );

        }
    );

}


// ========================================
// INITIAL
// ========================================

updateOnlineStatus();

renderHistory();