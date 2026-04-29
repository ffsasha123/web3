/*jslint browser, white */

document.addEventListener("DOMContentLoaded", function () {
    "use strict";

    let stepsLog = [];
    let currentStepIndex = 0;

    const board = document.getElementById("sort-board");
    const inputEl = document.getElementById("numbers-input");
    const startBtn = document.getElementById("start-btn");
    const nextBtn = document.getElementById("next-btn");
    const infoText = document.getElementById("info-text");

    function drawBoard(arrState, activeIndices) {
        board.innerHTML = "";
        arrState.forEach(function (val, idx) {
            const el = document.createElement("div");
            el.className = "node";
            el.textContent = val;
            if (activeIndices && activeIndices.indexOf(idx) !== -1) {
                el.classList.add("active-red");
            }
            board.appendChild(el);
        });
    }

    function processPartition(arr, low, high) {
        const pivotVal = arr[high];
        let i = low - 1;
        let j = low;
        let tmp;

        while (j < high) {
            if (arr[j] < pivotVal) {
                i += 1;
                if (i !== j) {
                    tmp = arr[i];
                    arr[i] = arr[j];
                    arr[j] = tmp;
                    stepsLog.push({
                        active: [i, j],
                        state: arr.slice()
                    });
                }
            }
            j += 1;
        }

        if (i + 1 !== high) {
            tmp = arr[i + 1];
            arr[i + 1] = arr[high];
            arr[high] = tmp;
            stepsLog.push({
                active: [i + 1, high],
                state: arr.slice()
            });
        }
        return i + 1;
    }

    function runQuickSort(arr, low, high) {
        if (low < high) {
            const pivotIndex = processPartition(arr, low, high);
            runQuickSort(arr, low, pivotIndex - 1);
            runQuickSort(arr, pivotIndex + 1, high);
        }
    }

    function handleStart() {
        const raw = inputEl.value;
        let initialArr = raw.split(",").map(function (str) {
            return parseInt(str.trim(), 10);
        }).filter(function (num) {
            return !Number.isNaN(num);
        });

        if (initialArr.length === 0) {
            infoText.textContent = "Помилка: введіть числа.";
            return;
        }

        stepsLog = [];
        currentStepIndex = 0;

        stepsLog.push({
            active: [],
            state: initialArr.slice()
        });

        let workArr = initialArr.slice();
        runQuickSort(workArr, 0, workArr.length - 1);

        stepsLog.push({
            active: [],
            state: workArr.slice()
        });

        drawBoard(stepsLog[0].state, stepsLog[0].active);
        nextBtn.disabled = false;
        infoText.textContent = "Масив завантажено. Тисни 'Наступний крок'.";
    }

    function handleNext() {
        currentStepIndex += 1;
        if (currentStepIndex < stepsLog.length) {
            const current = stepsLog[currentStepIndex];
            drawBoard(current.state, current.active);

            if (currentStepIndex === stepsLog.length - 1) {
                infoText.textContent = "Сортування завершено!";
                nextBtn.disabled = true;
            } else {
                // Розбили довгий рядок на два, щоб не порушувати ліміт 80 символів
                infoText.textContent = "Ітерація " + currentStepIndex +
                    " з " + (stepsLog.length - 2);
            }
        }
    }

    startBtn.addEventListener("click", handleStart);
    nextBtn.addEventListener("click", handleNext);
});