const today = new Date();

document.getElementById("today").textContent = today.toDateString();

// Default categories with preset tasks
const defaultCategories = [
    {
        key: "english",
        label: "Study English",
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
        duration: 0,
        initial: [
            {
                group: "MONDAY – PUSH (Chest Focus)",
                text: "Incline DB Press – 4x6-8"
            },
            {
                group: "MONDAY – PUSH (Chest Focus)",
                text: "Flat DB Press – 3x10"
            },
            {
                group: "MONDAY – PUSH (Chest Focus)",
                text: "Shoulder Press – 3x6-8"
            },
            {
                group: "MONDAY – PUSH (Chest Focus)",
                text: "Lateral Raise – 5x15"
            },
            {
                group: "MONDAY – PUSH (Chest Focus)",
                text: "Cable / Rope Pushdown – 3x12"
            },
            {
                group: "MONDAY – PUSH (Chest Focus)",
                text: "Overhead Tricep Extension – 3x12"
            },
            {
                group: "MONDAY – PUSH (Chest Focus)",
                text: "Incline Walk – 20 mins"
            },
            {
                group: "TUESDAY – PULL (Back Width Focus)",
                text: "Lat Pulldown (wide grip) – 4x10"
            },
            {
                group: "TUESDAY – PULL (Back Width Focus)",
                text: "Assisted Pullups / Pullups – 3 sets"
            },
            {
                group: "TUESDAY – PULL (Back Width Focus)",
                text: "Chest Supported Row – 3x10"
            },
            {
                group: "TUESDAY – PULL (Back Width Focus)",
                text: "Seated Cable Row – 3x12"
            },
            {
                group: "TUESDAY – PULL (Back Width Focus)",
                text: "Straight Arm Pulldown – 3x15"
            },
            {
                group: "TUESDAY – PULL (Back Width Focus)",
                text: "Face Pull – 3x15"
            },
            {
                group: "TUESDAY – PULL (Back Width Focus)",
                text: "Rear Delt Fly – 3x15"
            },
            {
                group: "TUESDAY – PULL (Back Width Focus)",
                text: "Barbell Curl – 3x10"
            },
            {
                group: "TUESDAY – PULL (Back Width Focus)",
                text: "Incline Walk – 15 mins"
            },
            {
                group: "WEDNESDAY – LEGS + CORE",
                text: "Squat / Leg Press – 4x6-8"
            },
            {
                group: "WEDNESDAY – LEGS + CORE",
                text: "Romanian Deadlift – 3x10"
            },
            {
                group: "WEDNESDAY – LEGS + CORE",
                text: "Walking Lunges – 3x12 each"
            },
            {
                group: "WEDNESDAY – LEGS + CORE",
                text: "Leg Extension – 3x15"
            },
            {
                group: "WEDNESDAY – LEGS + CORE",
                text: "Plank – 3x1 min"
            },
            {
                group: "WEDNESDAY – LEGS + CORE",
                text: "Leg Raises – 3x12"
            },
            {
                group: "WEDNESDAY – LEGS + CORE",
                text: "Russian Twist – 3x20"
            },
            {
                group: "THURSDAY – ACTIVE RECOVERY + FAT LOSS",
                text: "10k steps"
            },
            {
                group: "THURSDAY – ACTIVE RECOVERY + FAT LOSS", 
                text: "Stretching"
            },
            {
                group: "THURSDAY – ACTIVE RECOVERY + FAT LOSS",
                text: "Dead hang – 3x max"
            },
            {
                group: "THURSDAY – ACTIVE RECOVERY + FAT LOSS",
                text: "15 min HIIT (bike / jog intervals)"
            },
            {
                group: "FRIDAY – UPPER (SHAPE DAY)",
                text: "Incline DB Press – 3x12"
            },
            {
                group: "FRIDAY – UPPER (SHAPE DAY)",
                text: "Single Arm Lat Pulldown – 3x12"
            },
            {
                group: "FRIDAY – UPPER (SHAPE DAY)",
                text: "Chest Supported Row – 3x12"
            },
            {
                group: "FRIDAY – UPPER (SHAPE DAY)",
                text: "Lateral Raise – 5x15"
            },
            {
                group: "FRIDAY – UPPER (SHAPE DAY)",
                text: "Leaning Lateral Raise – 3x15"
            },
            {
                group: "FRIDAY – UPPER (SHAPE DAY)",
                text: "Rear Delt Fly – 3x15"
            },
            {
                group: "FRIDAY – UPPER (SHAPE DAY)",
                text: "Dips – 3x failure"
            },
            {
                group: "FRIDAY – UPPER (SHAPE DAY)",
                text: "DB Curl – 3x12"
            },
            {
                group: "FRIDAY – UPPER (SHAPE DAY)",
                text: "20 min incline walk"
            },
            {
                group: "SATURDAY – LOWER + FAT BURN",
                text: "Goblet Squat – 3x15"
            },
            {
                group: "SATURDAY – LOWER + FAT BURN",
                text: "RDL – 3x12"
            },
            {
                group: "SATURDAY – LOWER + FAT BURN",
                text: "Leg Press – 3x15"
            },
            {
                group: "SATURDAY – LOWER + FAT BURN",
                text: "Kettlebell Swin"
            }
        ]
    }
];

let categories = loadCategories();
let tasks = loadTasks();
let timers = {};

const taskCategory = document.getElementById("taskCategory");
const viewCategory = document.getElementById("viewCategory");
const newTaskInput = document.getElementById("newTaskInput");
const newTaskCalories = document.getElementById("newTaskCalories");
const addTaskButton = document.getElementById("addTaskButton");
const newCategoryName = document.getElementById("newCategoryName");
const newCategoryDuration = document.getElementById("newCategoryDuration");
const addCategoryButton = document.getElementById("addCategoryButton");
const englishProgress = document.getElementById("englishProgress");
const codingProgress = document.getElementById("codingProgress");
const gymProgress = document.getElementById("gymProgress");
const caloriesBurnedEl = document.getElementById("caloriesBurned");
const progress = document.getElementById("progress");
const taskGroups = document.getElementById("taskGroups");

function loadCategories(){
    const saved = localStorage.getItem("customCategories");
    if(saved){
        try {
            const parsed = JSON.parse(saved);
            const merged = [...parsed];

            defaultCategories.forEach(defaultCat => {
                const savedCat = merged.find(cat => cat.key === defaultCat.key);
                if(savedCat){
                    if(savedCat.startTime == null && defaultCat.startTime != null){
                        savedCat.startTime = defaultCat.startTime;
                    }
                    if(savedCat.duration == null && defaultCat.duration != null){
                        savedCat.duration = defaultCat.duration;
                    }
                    if(savedCat.label == null && defaultCat.label != null){
                        savedCat.label = defaultCat.label;
                    }
                } else {
                    merged.push(defaultCat);
                }
            });

            return merged;
        } catch {
            localStorage.removeItem("customCategories");
        }
    }
    return defaultCategories;
}

function saveCategories(){
    localStorage.setItem("customCategories", JSON.stringify(categories));
}

function parseTimeString(timeString){
    const [hours, minutes] = (timeString || "").split(":").map(Number);
    if(Number.isInteger(hours) && Number.isInteger(minutes)){
        return { hours, minutes };
    }
    return null;
}

function getCategoryStartLabel(category){
    if(!category.startTime) return "";
    const parsed = parseTimeString(category.startTime);
    if(!parsed) return "";
    const hours12 = parsed.hours % 12 === 0 ? 12 : parsed.hours % 12;
    const ampm = parsed.hours >= 12 ? "PM" : "AM";
    return `Start: ${hours12}:${String(parsed.minutes).padStart(2, "0")} ${ampm}`;
}

function scheduleAutoStartTimers(){
    const category = categories.find(c => c.key === "coding");
    if(!category || !category.startTime || category.duration <= 0) return;

    const now = new Date();
    const parsed = parseTimeString(category.startTime);
    if(!parsed) return;

    const todayKey = `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}`;
    const autoStartedKey = "autoStartedCodingDate";
    const lastAutoStarted = localStorage.getItem(autoStartedKey);

    if(lastAutoStarted === todayKey) return;

    if(now.getHours() === parsed.hours && now.getMinutes() >= parsed.minutes){
        startCategoryTimer(category.key);
        localStorage.setItem(autoStartedKey, todayKey);
        return;
    }
}

function getWeekNumber(){
    const now = new Date();
    const firstDayOfYear = new Date(now.getFullYear(), 0, 1);
    const pastDaysOfYear = (now - firstDayOfYear) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
}

function getTodayGymGroup(){
    const dayNames = [
        "SUNDAY",
        "MONDAY",
        "TUESDAY",
        "WEDNESDAY",
        "THURSDAY",
        "FRIDAY",
        "SATURDAY"
    ];
    return dayNames[new Date().getDay()];
}

function getAllGymTasks(){
    const gymCategory = defaultCategories.find(c => c.key === "gym");
    return gymCategory ? gymCategory.initial : [];
}

function getGymTasksForGroup(groupPrefix){
    return getAllGymTasks().filter(item => item.group?.startsWith(groupPrefix));
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

function refreshGymTasksForToday(savedTasks){
    const todayGroup = getTodayGymGroup();
    const otherTasks = savedTasks.filter(task => task.category !== "gym");
    const existingGymTasks = savedTasks.filter(task => task.category === "gym");
    const lastGymDay = localStorage.getItem("lastGymDay");
    const isNewGymDay = lastGymDay !== todayGroup;

    if(!isNewGymDay){
        return savedTasks;
    }

    const todayGymItems = getGymTasksForGroup(todayGroup);
    const gymItems = todayGymItems.length ? todayGymItems : getAllGymTasks();
    const defaultGymKeys = new Set(gymItems.map(item => `${item.group ?? ""}|${item.text}`));

    const customGymTasks = existingGymTasks.filter(task => !defaultGymKeys.has(`${task.group}|${task.text}`));

    const gymTasks = gymItems.map(item => ({
        text: item.text,
        category: "gym",
        done: false,
        group: item.group ?? "",
        calories: item.calories ?? getItemCalories(item.text)
    }));

    localStorage.setItem("lastGymDay", todayGroup);

    return [...otherTasks, ...customGymTasks, ...gymTasks];
}

function checkWeeklyReset(){
    const currentWeek = getWeekNumber();
    const savedWeek = localStorage.getItem("lastWeek");
    
    if(savedWeek !== currentWeek.toString()){
        tasks.forEach(task => task.done = false);
        saveTasks();
        localStorage.setItem("lastWeek", currentWeek.toString());
    }
}

function loadTasks(){
    const saved = localStorage.getItem("dailyTasks");
    if(saved){
        try {
            let data = JSON.parse(saved);
            data = refreshGymTasksForToday(data);
            tasks = data;
            checkWeeklyReset();
            saveTasks();
            return data;
        } catch {
            localStorage.removeItem("dailyTasks");
        }
    }

    const todayGymGroup = getTodayGymGroup();

    return categories.flatMap(category => {
        const items = category.key === "gym"
            ? category.initial.filter(item => item.group?.startsWith(todayGymGroup))
            : category.initial;

        const fallbackItems = category.key === "gym" && items.length === 0
            ? category.initial
            : items;

        return fallbackItems.map(item => {
            if(typeof item === "string"){
                return { text: item, category: category.key, done: false, group: "", calories: 0 };
            }
            return {
                text: item.text,
                category: category.key,
                done: false,
                group: item.group ?? "",
                calories: item.calories ?? getItemCalories(item.text)
            };
        });
    });
}

function updateTaskCaloriesVisibility(){
    const showCalories = taskCategory.value === "gym";
    newTaskCalories.style.display = showCalories ? "block" : "none";
    if(!showCalories){
        newTaskCalories.value = "";
    }
}

function saveTasks(){
    localStorage.setItem("dailyTasks", JSON.stringify(tasks));
}

function updateCategorySelect(){
    const selected = viewCategory.value;
    taskCategory.innerHTML = "";
    viewCategory.innerHTML = "";

    const allOption = document.createElement("option");
    allOption.value = "";
    allOption.textContent = "View all categories";
    viewCategory.appendChild(allOption);

    categories.forEach(cat => {
        const option = document.createElement("option");
        option.value = cat.key;
        option.textContent = cat.label;
        taskCategory.appendChild(option);

        const viewOption = document.createElement("option");
        viewOption.value = cat.key;
        viewOption.textContent = cat.label;
        viewCategory.appendChild(viewOption);
    });

    if(categories.some(cat => cat.key === selected)){
        viewCategory.value = selected;
    } else {
        viewCategory.value = "";
    }
}

function renderCategoryGroups(){
    taskGroups.innerHTML = "";
    const selectedFilter = viewCategory.value;
    
    categories.filter(category => !selectedFilter || category.key === selectedFilter)
        .forEach(category => {
        const groupDiv = document.createElement("div");
        groupDiv.className = "task-group";
        
        const timerDiv = document.createElement("div");
        timerDiv.className = "section-timer";
        
        const header = document.createElement("div");
        header.style.display = "flex";
        header.style.justifyContent = "space-between";
        header.style.alignItems = "center";
        header.style.marginBottom = "10px";
        
        const title = document.createElement("h3");
        title.textContent = category.label;
        
        const timeLabel = getCategoryStartLabel(category);
        if(timeLabel){
            const timeInfo = document.createElement("span");
            timeInfo.className = "category-start-time";
            timeInfo.textContent = timeLabel;
            timeInfo.style.fontSize = "0.95rem";
            timeInfo.style.color = "#555";
            timeInfo.style.marginLeft = "12px";
            title.appendChild(timeInfo);
        }
        
        const actionGroup = document.createElement("div");
        actionGroup.style.display = "flex";
        actionGroup.style.gap = "10px";
        
        const removeBtn = document.createElement("button");
        removeBtn.textContent = "Remove";
        removeBtn.className = "category-remove";
        removeBtn.onclick = () => removeCategory(category.key);
        
        actionGroup.appendChild(removeBtn);
        
        header.appendChild(title);
        header.appendChild(actionGroup);

        timerDiv.appendChild(header);

        if(category.duration > 0){
            const timerDisplay = document.createElement("div");
            timerDisplay.className = "timer";
            timerDisplay.id = category.key + "TimerDisplay";
            timerDisplay.textContent = category.duration + ":00:00";
            
            const btnContainer = document.createElement("div");
            btnContainer.className = "timer-buttons";
            
            const startBtn = document.createElement("button");
            startBtn.textContent = "Start";
            startBtn.onclick = () => startCategoryTimer(category.key);
            
            const pauseBtn = document.createElement("button");
            pauseBtn.textContent = "Pause";
            pauseBtn.onclick = () => pauseCategoryTimer(category.key);
            
            const resetBtn = document.createElement("button");
            resetBtn.textContent = "Reset";
            resetBtn.onclick = () => resetCategoryTimer(category.key);
            
            btnContainer.appendChild(startBtn);
            btnContainer.appendChild(pauseBtn);
            btnContainer.appendChild(resetBtn);
            
            timerDiv.appendChild(timerDisplay);
            timerDiv.appendChild(btnContainer);
        }
        
        groupDiv.appendChild(timerDiv);
        
        const tasksContainer = document.createElement("div");
        tasksContainer.id = category.key + "Tasks";
        groupDiv.appendChild(tasksContainer);
        
        taskGroups.appendChild(groupDiv);
    });
    
    renderTasks();
}

function renderTasks(){
    categories.forEach(category => {
        const container = document.getElementById(category.key + "Tasks");
        if(!container) return;
        
        container.innerHTML = "";
        const categoryTasks = tasks.filter(task => task.category === category.key);

        if(categoryTasks.length === 0){
            const empty = document.createElement("div");
            empty.className = "task empty";
            empty.textContent = "No tasks yet.";
            container.appendChild(empty);
            return;
        }

        const groupedTasks = categoryTasks.reduce((groups, task) => {
            const key = task.group || "";
            if(!groups[key]) groups[key] = [];
            groups[key].push(task);
            return groups;
        }, {});

        Object.keys(groupedTasks).forEach(group => {
            if(group){
                const heading = document.createElement("div");
                heading.className = "task-subgroup";
                heading.textContent = group;
                container.appendChild(heading);
            }

            groupedTasks[group].forEach(task => {
                const item = document.createElement("div");
                item.className = "task";

                const checkbox = document.createElement("input");
                checkbox.type = "checkbox";
                checkbox.checked = task.done;
                checkbox.addEventListener("change", () => {
                    const globalIndex = tasks.indexOf(task);
                    if(globalIndex >= 0){
                        tasks[globalIndex].done = checkbox.checked;
                        saveTasks();
                        updateStats();
                    }
                });

                const label = document.createElement("span");
                label.textContent = task.text + (task.category === "gym" && task.calories ? ` — ${task.calories} kcal` : "");
                label.className = "task-label";

                const deleteBtn = document.createElement("button");
                deleteBtn.type = "button";
                deleteBtn.className = "task-delete";
                deleteBtn.textContent = "Delete";
                deleteBtn.onclick = () => {
                    const globalIndex = tasks.indexOf(task);
                    if(globalIndex >= 0){
                        tasks.splice(globalIndex, 1);
                        saveTasks();
                        renderCategoryGroups();
                    }
                };

                item.appendChild(checkbox);
                item.appendChild(label);
                item.appendChild(deleteBtn);
                container.appendChild(item);
            });
        });
    });

    updateStats();
}

function updateStats(){
    const englishTasks = tasks.filter(task => task.category === "english");
    const codingTasks = tasks.filter(task => task.category === "coding");
    const gymTasks = tasks.filter(task => task.category === "gym");

    const englishDone = englishTasks.filter(task => task.done).length;
    const codingDone = codingTasks.filter(task => task.done).length;
    const gymDone = gymTasks.filter(task => task.done).length;
    const totalDone = englishDone + codingDone + gymDone;

    const englishPct = englishTasks.length ? Math.round((englishDone / englishTasks.length) * 100) : 0;
    const codingPct = codingTasks.length ? Math.round((codingDone / codingTasks.length) * 100) : 0;
    const gymPct = gymTasks.length ? Math.round((gymDone / gymTasks.length) * 100) : 0;
    const overallPct = tasks.length ? Math.round((totalDone / tasks.length) * 100) : 0;
    const caloriesBurned = gymTasks.reduce((sum, task) => sum + ((task.done && task.calories) ? task.calories : 0), 0);

    englishProgress.textContent = englishPct + "%";
    codingProgress.textContent = codingPct + "%";
    gymProgress.textContent = gymPct + "%";
    caloriesBurnedEl.textContent = caloriesBurned + " kcal";
    progress.textContent = overallPct + "%";
}

function addTask(text){
    const trimmed = text.trim();
    if(!trimmed) return;

    const calories = taskCategory.value === "gym"
        ? Math.max(0, parseInt(newTaskCalories.value) || 0)
        : 0;

    tasks.push({
        text: trimmed,
        category: taskCategory.value,
        done: false,
        group: "",
        calories
    });
    saveTasks();
    renderCategoryGroups();
    newTaskInput.value = "";
    newTaskCalories.value = "";
    newTaskInput.focus();
}

function addCategory(){
    const name = newCategoryName.value.trim();
    const duration = parseInt(newCategoryDuration.value) || 3;
    
    if(!name) return;
    
    const key = name.toLowerCase().replace(/\s+/g, "_");
    
    if(categories.find(c => c.key === key)){
        alert("Category already exists!");
        return;
    }
    
    categories.push({
        key,
        label: name,
        duration,
        initial: []
    });
    
    saveCategories();
    updateCategorySelect();
    renderCategoryGroups();
    
    newCategoryName.value = "";
    newCategoryDuration.value = "3";
}

function removeCategory(key){
    if(!confirm("Delete this category and all its tasks?")) return;

    categories = categories.filter(c => c.key !== key);
    tasks = tasks.filter(t => t.category !== key);
    
    saveCategories();
    saveTasks();
    updateCategorySelect();
    renderCategoryGroups();
}

function startCategoryTimer(key){
    const category = categories.find(c => c.key === key);
    if(!category) return;

    if(!timers[key]){
        timers[key] = {
            remaining: category.duration * 3600,
            interval: null
        };
    }

    if(timers[key].interval) return;
    if(timers[key].remaining <= 0){
        timers[key].remaining = category.duration * 3600;
    }
    
    timers[key].interval = setInterval(() => {
        if(timers[key].remaining <= 0){
            clearInterval(timers[key].interval);
            timers[key] = null;
            alert(category.label + " Time Complete!");
            return;
        }
        
        timers[key].remaining--;
        updateCategoryTimerDisplay(key);
    }, 1000);
}

function pauseCategoryTimer(key){
    if(timers[key] && timers[key].interval){
        clearInterval(timers[key].interval);
        timers[key].interval = null;
    }
}

function resetCategoryTimer(key){
    const category = categories.find(c => c.key === key);
    
    if(timers[key]){
        clearInterval(timers[key].interval);
    }
    
    timers[key] = {
        remaining: category.duration * 3600,
        interval: null
    };
    
    updateCategoryTimerDisplay(key);
}

function updateCategoryTimerDisplay(key){
    const remaining = timers[key].remaining;
    const hours = Math.floor(remaining / 3600);
    const mins = Math.floor((remaining % 3600) / 60);
    const secs = remaining % 60;
    
    const display = document.getElementById(key + "TimerDisplay");
    if(display){
        display.textContent = hours + ":" + String(mins).padStart(2,"0") + ":" + String(secs).padStart(2,"0");
    }
}

addTaskButton.addEventListener("click", () => addTask(newTaskInput.value));
newTaskInput.addEventListener("keypress", event => {
    if(event.key === "Enter"){
        addTask(newTaskInput.value);
    }
});

taskCategory.addEventListener("change", updateTaskCaloriesVisibility);
updateTaskCaloriesVisibility();

addCategoryButton.addEventListener("click", addCategory);
newCategoryName.addEventListener("keypress", event => {
    if(event.key === "Enter"){
        addCategory();
    }
});
viewCategory.addEventListener("change", renderCategoryGroups);

window.addEventListener("beforeunload", () => {
    saveTasks();
    saveCategories();
});

// Initialize
updateCategorySelect();
renderCategoryGroups();
scheduleAutoStartTimers();
setInterval(scheduleAutoStartTimers, 60000);
