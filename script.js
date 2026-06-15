const Chart = require("chart.js/auto");
const today = new Date();
const todayDisplay = document.getElementById("today");

const categoryGrid = document.getElementById("categoryGrid");
const taskCategory = document.getElementById("taskCategory");
const newTaskInput = document.getElementById("newTaskInput");
const newTaskCalories = document.getElementById("newTaskCalories");
const addTaskButton = document.getElementById("addTaskButton");
const newCategoryName = document.getElementById("newCategoryName");
const newCategoryType = document.getElementById("newCategoryType");
const categoryTypeFields = document.getElementById("categoryTypeFields");
const addCategoryButton = document.getElementById("addCategoryButton");
const newCategoryAction = document.getElementById("newCategoryAction");
const addTaskAction = document.getElementById("addTaskAction");
const addLoanAction = document.getElementById("addLoanAction");
const addPaymentAction = document.getElementById("addPaymentAction");
const loanCategoryName = document.getElementById("loanCategoryName");
const loanAmount = document.getElementById("loanAmount");
const loanMonthlyPayment = document.getElementById("loanMonthlyPayment");
const loanDueDate = document.getElementById("loanDueDate");
const createLoanButton = document.getElementById("createLoanButton");
const paymentCategoryName = document.getElementById("paymentCategoryName");
const paymentAmount = document.getElementById("paymentAmount");
const paymentDueDate = document.getElementById("paymentDueDate");
const createPaymentButton = document.getElementById("createPaymentButton");
const toastMessage = document.getElementById("toastMessage");

const summaryStreak = document.getElementById("summaryStreak");
const summaryTotalCategories = document.getElementById("summaryTotalCategories");
const summaryActiveCategories = document.getElementById("summaryActiveCategories");
const summaryCompletedTasks = document.getElementById("summaryCompletedTasks");
const summaryLoansRemaining = document.getElementById("summaryLoansRemaining");
const summaryUpcomingPayments = document.getElementById("summaryUpcomingPayments");
const summaryOverallProgress = document.getElementById("summaryOverallProgress");

const defaultCategories = [
    {
        key: "english",
        label: "Study English",
        type: "Timer",
        duration: 3,
        startTime: "23:00",
        initial: [
            "English Grammar",
            "Listening Practice",
            "Speaking Practice"
        ]
    },
    {
        key: "coding",
        label: "Study Coding",
        type: "Timer",
        duration: 3,
        startTime: "02:00",
        initial: [
            "Coding Concept",
            "Practice Problems",
            "Mini Project"
        ]
    },
    {
        key: "gym",
        label: "Gym Routine",
        type: "Checklist",
        initial: [
            { group: "MONDAY – PUSH (Chest Focus)", text: "Incline DB Press – 4x6-8" },
            { group: "MONDAY – PUSH (Chest Focus)", text: "Flat DB Press – 3x10" },
            { group: "MONDAY – PUSH (Chest Focus)", text: "Shoulder Press – 3x6-8" },
            { group: "MONDAY – PUSH (Chest Focus)", text: "Lateral Raise – 5x15" },
            { group: "MONDAY – PUSH (Chest Focus)", text: "Cable / Rope Pushdown – 3x12" },
            { group: "MONDAY – PUSH (Chest Focus)", text: "Overhead Tricep Extension – 3x12" },
            { group: "MONDAY – PUSH (Chest Focus)", text: "Incline Walk – 20 mins" },
            { group: "TUESDAY – PULL (Back Width Focus)", text: "Lat Pulldown (wide grip) – 4x10" },
            { group: "TUESDAY – PULL (Back Width Focus)", text: "Assisted Pullups / Pullups – 3 sets" },
            { group: "TUESDAY – PULL (Back Width Focus)", text: "Chest Supported Row – 3x10" },
            { group: "TUESDAY – PULL (Back Width Focus)", text: "Seated Cable Row – 3x12" },
            { group: "TUESDAY – PULL (Back Width Focus)", text: "Straight Arm Pulldown – 3x15" },
            { group: "TUESDAY – PULL (Back Width Focus)", text: "Face Pull – 3x15" },
            { group: "TUESDAY – PULL (Back Width Focus)", text: "Rear Delt Fly – 3x15" },
            { group: "TUESDAY – PULL (Back Width Focus)", text: "Barbell Curl – 3x10" },
            { group: "TUESDAY – PULL (Back Width Focus)", text: "Incline Walk – 15 mins" },
            { group: "WEDNESDAY – LEGS + CORE", text: "Squat / Leg Press – 4x6-8" },
            { group: "WEDNESDAY – LEGS + CORE", text: "Romanian Deadlift – 3x10" },
            { group: "WEDNESDAY – LEGS + CORE", text: "Walking Lunges – 3x12 each" },
            { group: "WEDNESDAY – LEGS + CORE", text: "Leg Extension – 3x15" },
            { group: "WEDNESDAY – LEGS + CORE", text: "Plank – 3x1 min" },
            { group: "WEDNESDAY – LEGS + CORE", text: "Leg Raises – 3x12" },
            { group: "WEDNESDAY – LEGS + CORE", text: "Russian Twist – 3x20" },
            { group: "THURSDAY – ACTIVE RECOVERY + FAT LOSS", text: "10k steps" },
            { group: "THURSDAY – ACTIVE RECOVERY + FAT LOSS", text: "Stretching" },
            { group: "THURSDAY – ACTIVE RECOVERY + FAT LOSS", text: "Dead hang – 3x max" },
            { group: "THURSDAY – ACTIVE RECOVERY + FAT LOSS", text: "15 min HIIT (bike / jog intervals)" },
            { group: "FRIDAY – UPPER (SHAPE DAY)", text: "Incline DB Press – 3x12" },
            { group: "FRIDAY – UPPER (SHAPE DAY)", text: "Single Arm Lat Pulldown – 3x12" },
            { group: "FRIDAY – UPPER (SHAPE DAY)", text: "Chest Supported Row – 3x12" },
            { group: "FRIDAY – UPPER (SHAPE DAY)", text: "Lateral Raise – 5x15" },
            { group: "FRIDAY – UPPER (SHAPE DAY)", text: "Leaning Lateral Raise – 3x15" },
            { group: "FRIDAY – UPPER (SHAPE DAY)", text: "Rear Delt Fly – 3x15" },
            { group: "FRIDAY – UPPER (SHAPE DAY)", text: "Dips – 3x failure" },
            { group: "FRIDAY – UPPER (SHAPE DAY)", text: "DB Curl – 3x12" },
            { group: "FRIDAY – UPPER (SHAPE DAY)", text: "20 min incline walk" },
            { group: "SATURDAY – LOWER + FAT BURN", text: "Goblet Squat – 3x15" },
            { group: "SATURDAY – LOWER + FAT BURN", text: "RDL – 3x12" },
            { group: "SATURDAY – LOWER + FAT BURN", text: "Leg Press – 3x15" },
            { group: "SATURDAY – LOWER + FAT BURN", text: "Kettlebell Swin" }
        ]
    }
];

let categories = [];
let tasks = [];
let timers = {};

function parseTimeString(value){
    if(!value) return null;
    const parts = value.split(":").map(Number);
    if(parts.length !== 2 || parts.some(val => Number.isNaN(val))) return null;
    return { hours: parts[0], minutes: parts[1] };
}

function formatTimeLabel(value){
    const parsed = parseTimeString(value);
    if(!parsed) return "";
    const hour12 = parsed.hours % 12 === 0 ? 12 : parsed.hours % 12;
    const suffix = parsed.hours >= 12 ? "PM" : "AM";
    return `${hour12}:${String(parsed.minutes).padStart(2, "0")} ${suffix}`;
}

function formatDuration(seconds){
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours}:${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
}

function getTodayKey(){
    const now = new Date();
    return `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
}

function getWeekNumber(date = new Date()){
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = Math.floor((date - firstDayOfYear) / 86400000);
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
}

function generateId(){
    return typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `id_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

function getTodayGymGroup(){
    const names = ["SUNDAY","MONDAY","TUESDAY","WEDNESDAY","THURSDAY","FRIDAY","SATURDAY"];
    return names[new Date().getDay()];
}

function getItemCalories(text){
    const lower = text.toLowerCase();
    if(lower.includes("walk") && lower.includes("20")) return 100;
    if(lower.includes("incline walk") && lower.includes("15")) return 90;
    if(lower.includes("10k steps")) return 120;
    if(lower.includes("hiit")) return 180;
    if(lower.includes("squat") || lower.includes("leg press") || lower.includes("romanian deadlift") || lower.includes("goblet squat") || lower.includes("kettlebell")) return 45;
    if(lower.includes("lat pulldown") || lower.includes("chest supported row") || lower.includes("seated cable row") || lower.includes("incline db press")) return 35;
    if(lower.includes("assisted pullups") || lower.includes("dips") || lower.includes("barbell curl") || lower.includes("db curl") || lower.includes("dead hang")) return 40;
    if(lower.includes("plank") || lower.includes("leg raises") || lower.includes("russian twist")) return 20;
    if(lower.includes("lateral raise") || lower.includes("rear delt fly") || lower.includes("straight arm pulldown") || lower.includes("face pull") || lower.includes("overhead tricep extension") || lower.includes("cable / rope pushdown")) return 20;
    if(lower.includes("stretching")) return 30;
    return 25;
}

function normalizeCategoryData(item){
    return {
        ...item,
        type: item.type || "Checklist",
        initial: Array.isArray(item.initial) ? item.initial : []
    };
}

function loadCategories(){
    const saved = localStorage.getItem("customCategories");
    let persisted = [];
    if(saved){
        try {
            persisted = JSON.parse(saved);
        } catch {
            localStorage.removeItem("customCategories");
        }
    }

    const merged = defaultCategories.map(defaultCat => {
        const found = persisted.find(savedCat => savedCat.key === defaultCat.key);
        return normalizeCategoryData(found ? { ...defaultCat, ...found } : defaultCat);
    });

    persisted.forEach(savedCat => {
        if(!merged.some(category => category.key === savedCat.key)){
            merged.push(normalizeCategoryData(savedCat));
        }
    });

    return merged;
}

function saveCategories(){
    localStorage.setItem("customCategories", JSON.stringify(categories));
}

function getGymBaseTasks(){
    const gymCategory = categories.find(c => c.key === "gym");
    return gymCategory ? Array.isArray(gymCategory.initial) ? gymCategory.initial : [] : [];
}

function getGymTasksForGroup(groupPrefix){
    return getGymBaseTasks().filter(item => item.group?.startsWith(groupPrefix));
}

function refreshGymTasks(savedTasks){
    const todayGroup = getTodayGymGroup();
    const lastGymDay = localStorage.getItem("lastGymDay");
    if(lastGymDay === todayGroup) return savedTasks;

    const gymItems = getGymTasksForGroup(todayGroup);
    const gymBase = gymItems.length ? gymItems : getGymBaseTasks();
    const defaultKeys = new Set(gymBase.map(item => `${item.group ?? ""}|${item.text}`));

    const otherTasks = savedTasks.filter(task => task.category !== "gym");
    const customGym = savedTasks.filter(task => task.category === "gym" && !defaultKeys.has(`${task.group ?? ""}|${task.text}`));

    const generatedGym = gymBase.map(item => ({
        id: generateId(),
        text: item.text,
        category: "gym",
        done: false,
        group: item.group ?? "",
        calories: item.calories ?? getItemCalories(item.text)
    }));

    localStorage.setItem("lastGymDay", todayGroup);
    return [...otherTasks, ...customGym, ...generatedGym];
}

function loadTasks(){
    const saved = localStorage.getItem("dailyTasks");
    if(saved){
        try {
            const parsed = JSON.parse(saved);
            const normalized = parsed.map(task => ({
                id: task.id || generateId(),
                text: task.text || "",
                category: task.category || "",
                done: Boolean(task.done),
                group: task.group || "",
                calories: Number.isFinite(task.calories) ? task.calories : 0
            })).filter(task => task.category && categories.some(c => c.key === task.category));

            const refreshed = refreshGymTasks(normalized);
            checkWeeklyReset(refreshed);
            return refreshed;
        } catch {
            localStorage.removeItem("dailyTasks");
        }
    }

    const todayGymGroup = getTodayGymGroup();
    return categories.flatMap(category => createTasksForCategory(category, todayGymGroup));
}

function saveTasks(){
    localStorage.setItem("dailyTasks", JSON.stringify(tasks));
}

function createTasksForCategory(category, gymGroup = getTodayGymGroup()){
    if(!Array.isArray(category.initial) || category.initial.length === 0) return [];

    if(category.key === "gym"){
        const todayItems = getGymTasksForGroup(gymGroup);
        const sourceItems = todayItems.length ? todayItems : category.initial;
        return sourceItems.map(item => ({
            id: generateId(),
            text: item.text,
            category: category.key,
            done: false,
            group: item.group || "",
            calories: item.calories ?? getItemCalories(item.text)
        }));
    }

    return category.initial.map(item => {
        if(typeof item === "string"){
            return { id: generateId(), text: item, category: category.key, done: false, group: "", calories: 0 };
        }
        return {
            id: generateId(),
            text: item.text || "",
            category: category.key,
            done: false,
            group: item.group || "",
            calories: Number.isFinite(item.calories) ? item.calories : 0
        };
    });
}

function getCategoryByKey(key){
    return categories.find(category => category.key === key);
}

function updateCategorySelect(){
    if(!taskCategory) return;
    taskCategory.innerHTML = "";

    const chooseOption = document.createElement("option");
    chooseOption.value = "";
    chooseOption.textContent = "Select a category";
    chooseOption.disabled = true;
    chooseOption.selected = true;
    taskCategory.appendChild(chooseOption);

    categories.forEach(category => {
        const taskOption = document.createElement("option");
        taskOption.value = category.key;
        taskOption.textContent = category.label;
        taskCategory.appendChild(taskOption);
    });

    updateTaskCaloriesVisibility();
}

function getCategoryCompletion(categoryKey){
    const categoryTasks = tasks.filter(task => task.category === categoryKey);
    if(categoryTasks.length === 0) return false;
    return categoryTasks.every(task => task.done);
}

function updateSummaryCards(){
    const streak = updateStreak();
    const completedTasks = tasks.filter(task => task.done).length;
    const loansRemaining = categories.filter(category => category.type === "Loan" && !getCategoryCompletion(category.key)).length;
    const upcomingPayments = categories.filter(category => category.type === "Payment" && !getCategoryCompletion(category.key)).length;
    const totalCategories = categories.length;
    const activeCategories = categories.filter(category => !getCategoryCompletion(category.key)).length;
    const overallProgress = tasks.length ? Math.round((completedTasks / tasks.length) * 100) : 0;

    if(summaryStreak) summaryStreak.textContent = streak;
    if(summaryTotalCategories) summaryTotalCategories.textContent = totalCategories;
    if(summaryActiveCategories) summaryActiveCategories.textContent = activeCategories;
    if(summaryCompletedTasks) summaryCompletedTasks.textContent = completedTasks;
    if(summaryLoansRemaining) summaryLoansRemaining.textContent = loansRemaining;
    if(summaryUpcomingPayments) summaryUpcomingPayments.textContent = upcomingPayments;
    if(summaryOverallProgress) summaryOverallProgress.textContent = `${overallProgress}%`;
}

function updateStreak(){
    const todayKey = getTodayKey();
    const lastStreakDate = localStorage.getItem("lastStreakDate");
    const streak = Number(localStorage.getItem("dailyStreak") || "0");
    const completedAll = tasks.length > 0 && tasks.every(task => task.done);

    if(completedAll && lastStreakDate !== todayKey){
        localStorage.setItem("dailyStreak", String(streak + 1));
        localStorage.setItem("lastStreakDate", todayKey);
        return streak + 1;
    }

    return streak;
}

function getCategoryMetaElements(category){
    const meta = [];
    if(category.type === "Timer"){
        if(category.startTime) meta.push(`Start: ${formatTimeLabel(category.startTime)}`);
        if(category.duration) meta.push(`Duration: ${category.duration} hr${category.duration !== 1 ? "s" : ""}`);
    }
    if(category.type === "Payment" || category.type === "Loan"){
        if(category.amount != null) meta.push(`Amount: ₱${category.amount}`);
        if(category.monthlyPayment != null) meta.push(`Monthly: ₱${category.monthlyPayment}`);
        if(category.dueDate) meta.push(`Due: ${category.dueDate}`);
    }
    if(category.type === "Date" && category.dueDate) meta.push(`Due: ${category.dueDate}`);
    if(category.type === "Day" && category.selectedDay) meta.push(`Day: ${category.selectedDay}`);
    if(category.type === "Month" && category.selectedMonth) meta.push(`Month: ${category.selectedMonth}`);
    if(category.type === "Goal" && category.targetValue) meta.push(`Target: ${category.targetValue}`);
    if(category.type === "Custom" && category.notes) meta.push(`Notes: ${category.notes}`);
    return meta;
}

function renderCategoryGrid(){
    if(!categoryGrid) return;
    categoryGrid.innerHTML = "";
    categories.forEach(category => {
        const categoryTasks = tasks.filter(task => task.category === category.key);
        const completedCount = categoryTasks.filter(task => task.done).length;
        const totalCount = categoryTasks.length;
        const progressValue = totalCount ? Math.round((completedCount / totalCount) * 100) : 0;

        const card = document.createElement("article");
        card.className = "category-card";

        const header = document.createElement("div");
        header.className = "card-header";

        const titleBlock = document.createElement("div");
        const title = document.createElement("h3");
        title.textContent = category.label;
        const badge = document.createElement("span");
        badge.className = "badge";
        badge.textContent = category.type;
        titleBlock.appendChild(title);
        titleBlock.appendChild(badge);

        const removeButton = document.createElement("button");
        removeButton.className = "category-remove";
        removeButton.type = "button";
        removeButton.textContent = "Remove";
        removeButton.addEventListener("click", () => removeCategory(category.key));

        header.appendChild(titleBlock);
        header.appendChild(removeButton);

        const meta = document.createElement("div");
        meta.className = "category-meta";
        getCategoryMetaElements(category).forEach(text => {
            const span = document.createElement("span");
            span.textContent = text;
            meta.appendChild(span);
        });

        const progressBlock = document.createElement("div");
        progressBlock.className = "category-progress";
        const progressLabel = document.createElement("div");
        progressLabel.className = "progress-label";
        progressLabel.innerHTML = `<span>${completedCount}/${totalCount} completed</span><strong>${progressValue}%</strong>`;
        const progressBar = document.createElement("div");
        progressBar.className = "progress-bar";
        const progressFill = document.createElement("div");
        progressFill.className = "progress-bar-fill";
        progressFill.style.width = `${progressValue}%`;
        progressBar.appendChild(progressFill);
        progressBlock.appendChild(progressLabel);
        progressBlock.appendChild(progressBar);

        const content = document.createElement("div");
        content.className = "card-content";
        const summary = document.createElement("div");
        summary.className = "category-details";
        if(totalCount === 0){
            summary.classList.add("empty-state");
            summary.textContent = "No tasks yet for this category.";
        } else {
            summary.innerHTML = `
                <div><strong>${totalCount}</strong> task${totalCount === 1 ? "" : "s"}</div>
                <div><strong>${completedCount}</strong> completed</div>
            `;
        }
        content.appendChild(summary);

        card.appendChild(header);
        card.appendChild(meta);
        card.appendChild(progressBlock);
        card.appendChild(content);

        if(category.type === "Timer" && category.duration > 0){
            const footer = document.createElement("div");
            footer.className = "card-footer";

            const timerDisplay = document.createElement("div");
            timerDisplay.className = "timer-display";
            timerDisplay.id = `${category.key}TimerDisplay`;
            const timerState = timers[category.key] || { remaining: category.duration * 3600 };
            timerDisplay.textContent = formatDuration(timerState.remaining);

            const actionRow = document.createElement("div");
            actionRow.className = "card-footer-actions";

            const startBtn = document.createElement("button");
            startBtn.type = "button";
            startBtn.textContent = "Start";
            startBtn.addEventListener("click", () => startCategoryTimer(category.key));

            const pauseBtn = document.createElement("button");
            pauseBtn.type = "button";
            pauseBtn.textContent = "Pause";
            pauseBtn.addEventListener("click", () => pauseCategoryTimer(category.key));

            const resetBtn = document.createElement("button");
            resetBtn.type = "button";
            resetBtn.textContent = "Reset";
            resetBtn.addEventListener("click", () => resetCategoryTimer(category.key));

            actionRow.appendChild(startBtn);
            actionRow.appendChild(pauseBtn);
            actionRow.appendChild(resetBtn);

            footer.appendChild(timerDisplay);
            footer.appendChild(actionRow);
            card.appendChild(footer);
        }

        categoryGrid.appendChild(card);
    });
    updateSummaryCards();
}


function toggleTaskDone(taskId, done){
    const task = tasks.find(item => item.id === taskId);
    if(!task) return;
    task.done = done;
    saveTasks();
    renderCategoryGrid();
}

function deleteTask(taskId){
    tasks = tasks.filter(task => task.id !== taskId);
    saveTasks();
    renderCategoryGrid();
}

function updateStats(){
    const totalDone = tasks.filter(task => task.done).length;
    const overallPct = tasks.length ? Math.round((totalDone / tasks.length) * 100) : 0;

    summaryCompletedTasks.textContent = totalDone;
    summaryOverallProgress.textContent = `${overallPct}%`;
}

function getSavingsHistory(){
    return [
        { label: 'Jan', value: 1000 },
        { label: 'Feb', value: 2500 },
        { label: 'Mar', value: 3500 },
        { label: 'Apr', value: 5000 }
    ];
}

function getExpenseCategoryData(){
    const loanTotal = categories
        .filter(category => category.type === 'Loan')
        .reduce((sum, category) => sum + (Number(category.amount) || 0), 0);
    const paymentTotal = categories
        .filter(category => category.type === 'Payment')
        .reduce((sum, category) => sum + (Number(category.amount) || 0), 0);
    const sampleOther = 6800;
    const otherTotal = loanTotal + paymentTotal === 0
        ? sampleOther
        : Math.max(0, sampleOther - loanTotal - paymentTotal);

    return [
        { label: 'Loans', value: loanTotal || 2500 },
        { label: 'Payments', value: paymentTotal || 2000 },
        { label: 'Other', value: otherTotal || 1800 }
    ];
}

function getLoanProgressData(){
    const loanCategories = categories.filter(category => category.type === 'Loan');
    if(loanCategories.length === 0){
        return [
            { label: 'Loan A', progress: 55 },
            { label: 'Loan B', progress: 32 },
            { label: 'Loan C', progress: 72 }
        ];
    }

    return loanCategories.map(category => {
        const amount = Number(category.amount) || 0;
        const monthlyPayment = Number(category.monthlyPayment) || 0;
        const progress = amount > 0 ? Math.min(100, Math.round((monthlyPayment / amount) * 100)) : 0;
        return { label: category.label, progress: progress || 10 };
    });
}

function createSavingsChart(){
    const history = getSavingsHistory();
    const ctx = document.getElementById('savingsChart');
    if(!ctx) return;

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: history.map(point => point.label),
            datasets: [{
                label: 'Savings',
                data: history.map(point => point.value),
                borderColor: '#7c3aed',
                backgroundColor: 'rgba(124, 58, 237, 0.18)',
                fill: true,
                tension: 0.35,
                pointRadius: 4,
                pointBackgroundColor: '#7c3aed',
                pointBorderColor: '#ffffff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                x: { grid: { display: false } },
                y: { beginAtZero: true, grid: { color: 'rgba(148, 163, 184, 0.2)' } }
            }
        }
    });
}

function createExpensesChart(){
    const categoriesData = getExpenseCategoryData();
    const ctx = document.getElementById('expensesChart');
    if(!ctx) return;

    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: categoriesData.map(item => item.label),
            datasets: [{
                data: categoriesData.map(item => item.value),
                backgroundColor: ['#7c3aed', '#22c55e', '#f97316'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'bottom' }
            }
        }
    });
}

function createLoanPayoffChart(){
    const loanData = getLoanProgressData();
    const ctx = document.getElementById('loanPayoffChart');
    if(!ctx) return;

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: loanData.map(item => item.label),
            datasets: [{
                label: 'Loan Payoff Progress',
                data: loanData.map(item => item.progress),
                backgroundColor: '#22c55e',
                borderRadius: 12,
                maxBarThickness: 40
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                x: { grid: { display: false } },
                y: { beginAtZero: true, max: 100, ticks: { callback: value => `${value}%` }, grid: { color: 'rgba(148, 163, 184, 0.2)' } }
            }
        }
    });
}

function renderDashboardCharts(){
    createSavingsChart();
    createExpensesChart();
    createLoanPayoffChart();
}

function updateTaskCaloriesVisibility(){
    if(!taskCategory || !newTaskCalories) return;
    const selectedCategory = getCategoryByKey(taskCategory.value);
    const show = selectedCategory?.key === "gym";
    newTaskCalories.style.display = show ? "block" : "none";
    if(!show) newTaskCalories.value = "";
}

function renderCategoryTypeFields(){
    if(!categoryTypeFields) return;
    categoryTypeFields.innerHTML = "";
    const type = newCategoryType.value;

    function createInput(labelText, id, typeAttr = "text", attrs = {}){
        const wrapper = document.createElement("label");
        wrapper.textContent = labelText;
        const input = document.createElement("input");
        input.type = typeAttr;
        input.id = id;
        Object.entries(attrs).forEach(([key, value]) => input.setAttribute(key, value));
        wrapper.appendChild(input);
        categoryTypeFields.appendChild(wrapper);
        return input;
    }

    function createTextarea(labelText, id, placeholder = ""){
        const wrapper = document.createElement("label");
        wrapper.textContent = labelText;
        const textarea = document.createElement("textarea");
        textarea.id = id;
        textarea.placeholder = placeholder;
        wrapper.appendChild(textarea);
        categoryTypeFields.appendChild(wrapper);
        return textarea;
    }

    if(type === "Timer"){
        createInput("Duration (hours)", "categoryDuration", "number", { min: "1", value: "3", placeholder: "3" });
        createInput("Start Time", "categoryStartTime", "time");
    }
    if(type === "Date"){
        createInput("Due Date", "categoryDueDate", "date");
    }
    if(type === "Day"){
        const wrapper = document.createElement("label");
        wrapper.textContent = "Day";
        const select = document.createElement("select");
        select.id = "categoryDay";
        ["MONDAY","TUESDAY","WEDNESDAY","THURSDAY","FRIDAY","SATURDAY","SUNDAY"].forEach(day => {
            const option = document.createElement("option");
            option.value = day;
            option.textContent = day;
            select.appendChild(option);
        });
        wrapper.appendChild(select);
        categoryTypeFields.appendChild(wrapper);
    }
    if(type === "Month"){
        createInput("Month", "categoryMonth", "month");
    }
    if(type === "Payment"){
        createInput("Amount", "categoryAmount", "number", { min: "0", step: "0.01", placeholder: "1000" });
        createInput("Due Date", "categoryDueDate", "date");
    }
    if(type === "Loan"){
        createInput("Loan Amount", "categoryAmount", "number", { min: "0", step: "0.01", placeholder: "10000" });
        createInput("Monthly Payment", "categoryMonthlyPayment", "number", { min: "0", step: "0.01", placeholder: "1000" });
        createInput("Due Date", "categoryDueDate", "date");
    }
    if(type === "Checklist"){
        createTextarea("Checklist items", "categoryItems", "One task per line");
    }
    if(type === "Goal"){
        createInput("Target", "categoryTarget", "number", { min: "1", placeholder: "10" });
        createInput("Due Date", "categoryDueDate", "date");
    }
    if(type === "Custom"){
        createTextarea("Notes", "categoryNotes", "Notes or details for this custom category");
    }
}

function getNewCategoryFormData(){
    const type = newCategoryType.value;
    const data = { type };
    if(type === "Timer"){
        const duration = Number(document.getElementById("categoryDuration")?.value || 0);
        if(duration > 0) data.duration = duration;
        const startTime = document.getElementById("categoryStartTime")?.value;
        if(startTime) data.startTime = startTime;
    }
    if(type === "Date"){
        const dueDate = document.getElementById("categoryDueDate")?.value;
        if(dueDate) data.dueDate = dueDate;
    }
    if(type === "Day"){
        const selectedDay = document.getElementById("categoryDay")?.value;
        if(selectedDay) data.selectedDay = selectedDay;
    }
    if(type === "Month"){
        const selectedMonth = document.getElementById("categoryMonth")?.value;
        if(selectedMonth) data.selectedMonth = selectedMonth;
    }
    if(type === "Payment"){
        const amount = Number(document.getElementById("categoryAmount")?.value || 0);
        if(amount) data.amount = amount;
        const dueDate = document.getElementById("categoryDueDate")?.value;
        if(dueDate) data.dueDate = dueDate;
    }
    if(type === "Loan"){
        const amount = Number(document.getElementById("categoryAmount")?.value || 0);
        if(amount) data.amount = amount;
        const monthlyPayment = Number(document.getElementById("categoryMonthlyPayment")?.value || 0);
        if(monthlyPayment) data.monthlyPayment = monthlyPayment;
        const dueDate = document.getElementById("categoryDueDate")?.value;
        if(dueDate) data.dueDate = dueDate;
    }
    if(type === "Checklist"){
        const items = document.getElementById("categoryItems")?.value || "";
        data.items = items.split("\n").map(item => item.trim()).filter(Boolean);
    }
    if(type === "Goal"){
        const targetValue = document.getElementById("categoryTarget")?.value;
        if(targetValue) data.targetValue = targetValue;
        const dueDate = document.getElementById("categoryDueDate")?.value;
        if(dueDate) data.dueDate = dueDate;
    }
    if(type === "Custom"){
        const notes = document.getElementById("categoryNotes")?.value;
        if(notes) data.notes = notes;
    }
    return data;
}

function addTask(){
    const text = newTaskInput.value.trim();
    const categoryKey = taskCategory.value;
    if(!text || !categoryKey){
        alert("Please select a category and enter a task.");
        return false;
    }

    const calories = categoryKey === "gym" ? Math.max(0, Number(newTaskCalories.value) || 0) : 0;

    tasks.push({
        id: generateId(),
        text,
        category: categoryKey,
        done: false,
        group: "",
        calories
    });
    saveTasks();
    renderCategoryGrid();
    newTaskInput.value = "";
    newTaskCalories.value = "";
    return true;
}

function addCategory(){
    const name = newCategoryName.value.trim();
    const type = newCategoryType.value;
    if(!name) {
        alert("Please enter a category name.");
        return false;
    }
    const key = name.toLowerCase().replace(/\s+/g, "_").replace(/[^a-z0-9_-]/g, "");
    if(categories.some(category => category.key === key)){
        alert("That category already exists.");
        return false;
    }

    const data = getNewCategoryFormData();
    const category = { key, label: name, type, initial: [] };

    if(type === "Timer"){
        category.duration = data.duration || 1;
        if(data.startTime) category.startTime = data.startTime;
    }
    if(type === "Date"){
        if(data.dueDate) category.dueDate = data.dueDate;
    }
    if(type === "Day"){
        if(data.selectedDay) category.selectedDay = data.selectedDay;
    }
    if(type === "Month"){
        if(data.selectedMonth) category.selectedMonth = data.selectedMonth;
    }
    if(type === "Payment"){
        if(data.amount) category.amount = data.amount;
        if(data.dueDate) category.dueDate = data.dueDate;
    }
    if(type === "Loan"){
        if(data.amount) category.amount = data.amount;
        if(data.monthlyPayment) category.monthlyPayment = data.monthlyPayment;
        if(data.dueDate) category.dueDate = data.dueDate;
    }
    if(type === "Checklist"){
        if(data.items?.length){
            category.initial = data.items.map(text => ({ text, group: "", calories: getItemCalories(text) }));
        }
    }
    if(type === "Goal"){
        if(data.targetValue) category.targetValue = data.targetValue;
        if(data.dueDate) category.dueDate = data.dueDate;
    }
    if(type === "Custom"){
        if(data.notes) category.notes = data.notes;
    }

    categories.push(category);
    saveCategories();

    if(category.initial.length){
        const newTasks = createTasksForCategory(category);
        tasks.push(...newTasks);
        saveTasks();
    }

    updateCategorySelect();
    renderCategoryGrid();

    newCategoryName.value = "";
    newCategoryType.value = "Timer";
    renderCategoryTypeFields();
    return true;
}

function removeCategory(key){
    if(!confirm("Delete this category and all associated tasks?")) return;
    categories = categories.filter(category => category.key !== key);
    tasks = tasks.filter(task => task.category !== key);
    if(timers[key] && timers[key].interval){
        clearInterval(timers[key].interval);
    }
    delete timers[key];
    saveCategories();
    saveTasks();
    updateCategorySelect();
    renderCategoryGrid();
}

function startCategoryTimer(key){
    const category = getCategoryByKey(key);
    if(!category || category.type !== "Timer" || !category.duration) return;

    if(!timers[key]){
        timers[key] = { remaining: category.duration * 3600, interval: null };
    }
    if(timers[key].interval) return;
    if(timers[key].remaining <= 0){
        timers[key].remaining = category.duration * 3600;
    }

    timers[key].interval = setInterval(() => {
        if(!timers[key]) return;
        timers[key].remaining -= 1;
        if(timers[key].remaining <= 0){
            clearInterval(timers[key].interval);
            timers[key].interval = null;
            timers[key].remaining = 0;
            updateCategoryTimerDisplay(key);
            alert(`${category.label} time is complete!`);
            return;
        }
        updateCategoryTimerDisplay(key);
    }, 1000);
    updateCategoryTimerDisplay(key);
}

function pauseCategoryTimer(key){
    if(timers[key] && timers[key].interval){
        clearInterval(timers[key].interval);
        timers[key].interval = null;
    }
}

function resetCategoryTimer(key){
    const category = getCategoryByKey(key);
    if(!category || category.type !== "Timer") return;
    if(timers[key] && timers[key].interval){
        clearInterval(timers[key].interval);
    }
    timers[key] = { remaining: category.duration * 3600, interval: null };
    updateCategoryTimerDisplay(key);
}

function updateCategoryTimerDisplay(key){
    const category = getCategoryByKey(key);
    if(!category) return;
    const timer = timers[key] || { remaining: category.duration * 3600 };
    const display = document.getElementById(`${key}TimerDisplay`);
    if(display){
        display.textContent = formatDuration(timer.remaining);
    }
}

function scheduleAutoStartTimers(){
    const now = new Date();
    const todayKey = getTodayKey();

    categories.filter(category => category.type === "Timer" && category.startTime).forEach(category => {
        const parsed = parseTimeString(category.startTime);
        if(!parsed) return;
        const autoKey = `autoStarted_${category.key}`;
        const lastAuto = localStorage.getItem(autoKey);
        const nowMinutes = now.getHours() * 60 + now.getMinutes();
        const targetMinutes = parsed.hours * 60 + parsed.minutes;
        if(nowMinutes >= targetMinutes && lastAuto !== todayKey){
            startCategoryTimer(category.key);
            localStorage.setItem(autoKey, todayKey);
        }
    });
}

function checkWeeklyReset(currentTasks){
    const currentWeek = getWeekNumber();
    const savedWeek = localStorage.getItem("lastWeek");
    if(savedWeek !== currentWeek.toString()){
        currentTasks.forEach(task => task.done = false);
        localStorage.setItem("lastWeek", currentWeek.toString());
    }
}

function showModal(modalId){
    const overlay = document.getElementById(modalId);
    if(overlay){
        overlay.classList.remove("hidden");
        overlay.setAttribute("aria-hidden", "false");
        document.body.classList.add("modal-open");
        const focusable = overlay.querySelector("button, input, select, textarea");
        if(focusable) focusable.focus({ preventScroll: true });
    }
}

function hideModal(modalId){
    const overlay = document.getElementById(modalId);
    if(overlay){
        overlay.classList.add("hidden");
        overlay.setAttribute("aria-hidden", "true");
        document.body.classList.remove("modal-open");
    }
}

function resetCategoryModal(type){
    newCategoryName.value = "";
    newCategoryType.value = type || "Timer";
    renderCategoryTypeFields();
}

function resetTaskModal(){
    newTaskInput.value = "";
    newTaskCalories.value = "";
    const firstCategory = taskCategory.querySelector("option[value]:not([value=''])");
    if(firstCategory) taskCategory.value = firstCategory.value;
}

function resetLoanModal(){
    loanCategoryName.value = "";
    loanAmount.value = "";
    loanMonthlyPayment.value = "";
    loanDueDate.value = "";
}

function resetPaymentModal(){
    paymentCategoryName.value = "";
    paymentAmount.value = "";
    paymentDueDate.value = "";
}

function showToast(message){
    if(!toastMessage) return;
    toastMessage.textContent = message;
    toastMessage.classList.remove("hidden");
    clearTimeout(showToast.timeoutId);
    showToast.timeoutId = setTimeout(() => toastMessage.classList.add("hidden"), 3200);
}

if(todayDisplay){
    todayDisplay.textContent = today.toDateString();
}

if(newCategoryAction){
    newCategoryAction.addEventListener("click", () => {
        resetCategoryModal("Timer");
        showModal("categoryModalOverlay");
    });
}
if(addTaskAction){
    addTaskAction.addEventListener("click", () => {
        resetTaskModal();
        showModal("taskModalOverlay");
    });
}
if(addLoanAction){
    addLoanAction.addEventListener("click", () => {
        resetLoanModal();
        showModal("loanModalOverlay");
    });
}
if(addPaymentAction){
    addPaymentAction.addEventListener("click", () => {
        resetPaymentModal();
        showModal("paymentModalOverlay");
    });
}

const closeCategoryModal = document.getElementById("closeCategoryModal");
const closeTaskModal = document.getElementById("closeTaskModal");
const closeLoanModal = document.getElementById("closeLoanModal");
const closePaymentModal = document.getElementById("closePaymentModal");
if(closeCategoryModal){
    closeCategoryModal.addEventListener("click", () => hideModal("categoryModalOverlay"));
}
if(closeTaskModal){
    closeTaskModal.addEventListener("click", () => hideModal("taskModalOverlay"));
}
if(closeLoanModal){
    closeLoanModal.addEventListener("click", () => hideModal("loanModalOverlay"));
}
if(closePaymentModal){
    closePaymentModal.addEventListener("click", () => hideModal("paymentModalOverlay"));
}

window.addEventListener("click", event => {
    if(event.target === document.getElementById("categoryModalOverlay")){
        hideModal("categoryModalOverlay");
    }
    if(event.target === document.getElementById("taskModalOverlay")){
        hideModal("taskModalOverlay");
    }
    if(event.target === document.getElementById("loanModalOverlay")){
        hideModal("loanModalOverlay");
    }
    if(event.target === document.getElementById("paymentModalOverlay")){
        hideModal("paymentModalOverlay");
    }
});

if(newCategoryType){
    newCategoryType.addEventListener("change", renderCategoryTypeFields);
}
if(addCategoryButton){
    addCategoryButton.addEventListener("click", () => {
        if(addCategory()){
            hideModal("categoryModalOverlay");
            showToast("Category created successfully.");
        }
    });
}
if(newCategoryName){
    newCategoryName.addEventListener("keypress", event => { if(event.key === "Enter") {
        event.preventDefault();
        if(addCategory()){
            hideModal("categoryModalOverlay");
            showToast("Category created successfully.");
        }
    }});
}
if(addTaskButton){
    addTaskButton.addEventListener("click", () => {
        if(addTask()){
            hideModal("taskModalOverlay");
            showToast("Task added successfully.");
        }
    });
}
if(newTaskInput){
    newTaskInput.addEventListener("keypress", event => { if(event.key === "Enter") {
        event.preventDefault();
        if(addTask()){
            hideModal("taskModalOverlay");
            showToast("Task added successfully.");
        }
    }});
}
if(createLoanButton){
    createLoanButton.addEventListener("click", () => {
        const name = loanCategoryName?.value.trim() || "";
        const amount = Number(loanAmount?.value || 0);
        const monthlyPayment = Number(loanMonthlyPayment?.value || 0);
        const dueDate = loanDueDate?.value || "";
        if(!name || amount <= 0 || monthlyPayment <= 0 || !dueDate){
            alert("Please fill in all loan fields.");
            return;
        }
        const key = name.toLowerCase().replace(/\s+/g, "_").replace(/[^a-z0-9_-]/g, "");
        if(categories.some(category => category.key === key)){
            alert("That category already exists.");
            return;
        }
        const category = { key, label: name, type: "Loan", initial: [], amount, monthlyPayment, dueDate };
        categories.push(category);
        saveCategories();
        updateCategorySelect();
        renderCategoryGrid();
        resetLoanModal();
        hideModal("loanModalOverlay");
        showToast("Loan category created successfully.");
    });
}
if(createPaymentButton){
    createPaymentButton.addEventListener("click", () => {
        const name = paymentCategoryName?.value.trim() || "";
        const amount = Number(paymentAmount?.value || 0);
        const dueDate = paymentDueDate?.value || "";
        if(!name || amount <= 0 || !dueDate){
            alert("Please fill in all payment fields.");
            return;
        }
        const key = name.toLowerCase().replace(/\s+/g, "_").replace(/[^a-z0-9_-]/g, "");
        if(categories.some(category => category.key === key)){
            alert("That category already exists.");
            return;
        }
        const category = { key, label: name, type: "Payment", initial: [], amount, dueDate };
        categories.push(category);
        saveCategories();
        updateCategorySelect();
        renderCategoryGrid();
        resetPaymentModal();
        hideModal("paymentModalOverlay");
        showToast("Payment category created successfully.");
    });
}
if(taskCategory){
    taskCategory.addEventListener("change", updateTaskCaloriesVisibility);
}

if(newCategoryType){
    renderCategoryTypeFields();
}

// Load shared sidebar component into pages that have a `#sidebar` container.
function loadSidebar(){
    try {
        const isInPages = window.location.pathname.includes('/pages/');
        const fetchPath = (isInPages ? '../' : '') + 'sidebar.html';
        fetch(fetchPath).then(res => res.text()).then(html => {
            const container = document.getElementById('sidebar');
            if(!container) return;
            container.innerHTML = html;

            // Resolve each link's href depending on current page location.
            container.querySelectorAll('a[data-href]').forEach(a => {
                const dh = a.getAttribute('data-href') || '';
                let resolved = '';
                if(isInPages){
                    if(dh.startsWith('pages/')){
                        // link to another file inside pages/ folder
                        resolved = dh.replace(/^pages\//, '');
                    } else {
                        // link to a root-level page
                        resolved = '../' + dh;
                    }
                } else {
                    // root pages: use the path as-is
                    resolved = dh;
                }
                a.setAttribute('href', resolved);

                // mark active link
                const currentFile = window.location.pathname.split('/').pop();
                const targetFile = resolved.split('/').pop();
                if(currentFile === targetFile){
                    a.classList.add('active');
                }
            });
        }).catch(() => {});
    } catch (e) {
        // fail silently
    }
}

document.addEventListener('DOMContentLoaded', () => {
    if(document.getElementById('sidebar')) loadSidebar();
});

categories = loadCategories();
tasks = loadTasks();

updateCategorySelect();
renderCategoryGrid();
renderDashboardCharts();
if(typeof scheduleAutoStartTimers === 'function'){
    scheduleAutoStartTimers();
    setInterval(scheduleAutoStartTimers, 60000);
}

window.addEventListener("beforeunload", () => {
    saveTasks();
    saveCategories();
});
