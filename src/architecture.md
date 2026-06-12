# Category Type Architecture for Daily Life Tracking System

## 1. New Folder Structure

src/
  components/
    CategoryCard.js
    StudyCard.js
    WorkoutCard.js
    LoanCard.js
    BillCard.js
    SavingsCard.js
    ProjectCard.js
    Modal.js
    CategoryForm.js
  categories/
    categoryTypes.js
    categorySchema.js
  services/
    storage.js
    render.js
    categoryFactory.js

index.html
script.js
style.css

## 2. New Data Model

Category object shape:

{
  id: string,
  name: string,
  type: string,
  metadata: object,
  tasks: array,
  createdAt: string
}

Category type schema example:

const categoryTypes = {
  study: {
    id: "study",
    label: "Study",
    fields: [
      { name: "name", label: "Name", type: "text", required: true },
      { name: "duration", label: "Duration (hours)", type: "number", required: true },
      { name: "startTime", label: "Start Time", type: "time" }
    ],
    card: StudyCard,
    defaults: { checklist: [], progress: 0 }
  },
  workout: {
    id: "workout",
    label: "Workout",
    fields: [
      { name: "name", label: "Workout Name", type: "text", required: true },
      { name: "workoutDay", label: "Workout Day", type: "select", options: ["MONDAY","TUESDAY","WEDNESDAY","THURSDAY","FRIDAY","SATURDAY","SUNDAY"], required: true },
      { name: "exercises", label: "Exercises", type: "textarea", placeholder: "One exercise per line" }
    ],
    card: WorkoutCard,
    defaults: { exercises: [], completion: 0 }
  },
  loan: {
    id: "loan",
    label: "Loan",
    fields: [
      { name: "name", label: "Loan Name", type: "text", required: true },
      { name: "amount", label: "Loan Amount", type: "number", required: true },
      { name: "monthlyPayment", label: "Monthly Payment", type: "number", required: true },
      { name: "dueDate", label: "Due Date", type: "date", required: true }
    ],
    card: LoanCard,
    defaults: { balance: 0, paymentHistory: [] }
  },
  bill: {
    id: "bill",
    label: "Bill",
    fields: [
      { name: "name", label: "Bill Name", type: "text", required: true },
      { name: "amount", label: "Amount", type: "number", required: true },
      { name: "dueDate", label: "Due Date", type: "date", required: true },
      { name: "status", label: "Payment Status", type: "select", options: ["Unpaid","Paid"], required: true }
    ],
    card: BillCard,
    defaults: { paid: false }
  },
  savings: {
    id: "savings",
    label: "Savings",
    fields: [
      { name: "name", label: "Savings Goal", type: "text", required: true },
      { name: "targetAmount", label: "Target Amount", type: "number", required: true },
      { name: "currentAmount", label: "Current Amount", type: "number", required: true }
    ],
    card: SavingsCard,
    defaults: { currentAmount: 0 }
  },
  project: {
    id: "project",
    label: "Project",
    fields: [
      { name: "name", label: "Project Name", type: "text", required: true },
      { name: "deadline", label: "Deadline", type: "date" },
      { name: "milestones", label: "Milestones", type: "textarea", placeholder: "One milestone per line" }
    ],
    card: ProjectCard,
    defaults: { tasks: [], milestones: [] }
  }
};

Category model example:

const category = {
  id: "study_english",
  name: "Study English",
  type: "study",
  metadata: {
    duration: 3,
    startTime: "23:00"
  },
  tasks: [
    { id: "task_1", text: "Grammar review", done: false },
    { id: "task_2", text: "Listening practice", done: true }
  ],
  createdAt: "2026-06-13T12:00:00.000Z"
};

## 3. Component Hierarchy

- App
  - Header
  - QuickActions
  - Dashboard
    - CategoryGrid
      - StudyCard
      - WorkoutCard
      - LoanCard
      - BillCard
      - SavingsCard
      - ProjectCard
  - ManageTasks
  - Toast
  - CategoryModal
    - CategoryForm

## 4. Category Type Architecture

- categoryTypes: registry of type definitions
- categorySchema: dynamic field definitions and validation rules
- categoryFactory: creates category objects using type registry
- render.js: chooses card renderer by category.type
- storage.js: persistence abstraction for categories and tasks

Add new type by adding one entry to `categoryTypes.js` and one card component file.

## 5. Updated HTML Structure

- Simplified root HTML
- `#categoryGrid` remains as render target
- Quick action buttons remain top-level
- Modal markup becomes generic and schema-driven
- Existing `Manage Tasks` remains unchanged

## 6. Updated JavaScript Architecture

- `script.js` becomes entrypoint bootstrapping `src/services/render.js`
- `src/services/storage.js` handles load/save with `localStorage`
- `src/categories/categoryTypes.js` contains shape metadata and form field definitions
- `src/components/CategoryCard.js` selects renderer using type registry
- Each card component returns DOM nodes or HTML fragments
- `src/components/CategoryForm.js` builds form fields dynamically from selected type
- Modal open/close uses generic functions and `preventScroll: true`
- Success submission closes modal, refreshes dashboard, and shows toast

## 7. Migration Plan from Current System

1. Convert current `categories` array into new model with `type` and `metadata`.
2. Migrate legacy category fields into type-specific `metadata`:
   - `duration` + `startTime` → `metadata.duration`, `metadata.startTime`
   - `amount` / `monthlyPayment` → `metadata.amount`, `metadata.monthlyPayment`
   - `dueDate` → `metadata.dueDate`
3. Move `initial` checklist values into `tasks` or `metadata.exercises`/`metadata.milestones`.
4. Keep `tasks` storage separate from categories when necessary; task objects now include `categoryId` and optional `type` context.
5. Keep `categoryGrid` render target and `Manage Tasks` section unchanged while updating render layer.
6. Add a one-time migration helper on startup that normalizes legacy data.

## 8. Sample Code Implementation

### src/categories/categoryTypes.js

```js
const categoryTypes = {
  study: {
    id: "study",
    label: "Study",
    fields: [
      { name: "name", label: "Name", type: "text", required: true },
      { name: "duration", label: "Duration (hours)", type: "number", min: 1, required: true },
      { name: "startTime", label: "Start Time", type: "time" }
    ],
    render: StudyCard,
    normalize: data => ({
      metadata: {
        duration: Number(data.duration || 1),
        startTime: data.startTime || ""
      },
      tasks: data.tasks || []
    })
  },
  workout: {
    id: "workout",
    label: "Workout",
    fields: [
      { name: "name", label: "Workout Name", type: "text", required: true },
      { name: "workoutDay", label: "Workout Day", type: "select", options: ["MONDAY","TUESDAY","WEDNESDAY","THURSDAY","FRIDAY","SATURDAY","SUNDAY"], required: true },
      { name: "exercises", label: "Exercises", type: "textarea", placeholder: "One exercise per line" }
    ],
    render: WorkoutCard,
    normalize: data => ({
      metadata: {
        workoutDay: data.workoutDay,
        exercises: data.exercises.split("\n").map(line => line.trim()).filter(Boolean)
      }
    })
  },
  loan: {
    id: "loan",
    label: "Loan",
    fields: [
      { name: "name", label: "Loan Name", type: "text", required: true },
      { name: "amount", label: "Loan Amount", type: "number", min: 0, required: true },
      { name: "monthlyPayment", label: "Monthly Payment", type: "number", min: 0, required: true },
      { name: "dueDate", label: "Due Date", type: "date", required: true }
    ],
    render: LoanCard,
    normalize: data => ({
      metadata: {
        amount: Number(data.amount || 0),
        monthlyPayment: Number(data.monthlyPayment || 0),
        dueDate: data.dueDate,
        balance: Number(data.amount || 0),
        paymentHistory: []
      }
    })
  },
  bill: {
    id: "bill",
    label: "Bill",
    fields: [
      { name: "name", label: "Bill Name", type: "text", required: true },
      { name: "amount", label: "Amount", type: "number", min: 0, required: true },
      { name: "dueDate", label: "Due Date", type: "date", required: true },
      { name: "status", label: "Payment Status", type: "select", options: ["Unpaid","Paid"], required: true }
    ],
    render: BillCard,
    normalize: data => ({
      metadata: {
        amount: Number(data.amount || 0),
        dueDate: data.dueDate,
        status: data.status || "Unpaid"
      }
    })
  },
  savings: {
    id: "savings",
    label: "Savings",
    fields: [
      { name: "name", label: "Savings Goal", type: "text", required: true },
      { name: "targetAmount", label: "Target Amount", type: "number", min: 0, required: true },
      { name: "currentAmount", label: "Current Amount", type: "number", min: 0, required: true }
    ],
    render: SavingsCard,
    normalize: data => ({
      metadata: {
        targetAmount: Number(data.targetAmount || 0),
        currentAmount: Number(data.currentAmount || 0)
      }
    })
  },
  project: {
    id: "project",
    label: "Project",
    fields: [
      { name: "name", label: "Project Name", type: "text", required: true },
      { name: "deadline", label: "Deadline", type: "date" },
      { name: "milestones", label: "Milestones", type: "textarea", placeholder: "One milestone per line" }
    ],
    render: ProjectCard,
    normalize: data => ({
      metadata: {
        deadline: data.deadline,
        milestones: data.milestones.split("\n").map(line => line.trim()).filter(Boolean)
      }
    })
  }
};

export default categoryTypes;
```

### src/components/CategoryCard.js

```js
import categoryTypes from "../categories/categoryTypes.js";
import StudyCard from "./StudyCard.js";
import WorkoutCard from "./WorkoutCard.js";
import LoanCard from "./LoanCard.js";
import BillCard from "./BillCard.js";
import SavingsCard from "./SavingsCard.js";
import ProjectCard from "./ProjectCard.js";

const cardRenderers = {
  study: StudyCard,
  workout: WorkoutCard,
  loan: LoanCard,
  bill: BillCard,
  savings: SavingsCard,
  project: ProjectCard
};

export function renderCategoryCard(category){
  const renderer = cardRenderers[category.type] || StudyCard;
  return renderer(category);
}
```

### src/components/StudyCard.js

```js
export default function StudyCard(category){
  const card = document.createElement("article");
  card.className = "category-card study-card";

  const header = document.createElement("div");
  header.className = "card-header";
  header.innerHTML = `<div><h3>${category.name}</h3><span class="badge">Study</span></div>`;

  const meta = document.createElement("div");
  meta.className = "category-meta";
  meta.innerHTML = `
    <span>Start: ${category.metadata.startTime || "—"}</span>
    <span>Duration: ${category.metadata.duration || 0} hr</span>
  `;

  const progress = document.createElement("div");
  progress.className = "category-progress";
  const completedCount = category.tasks.filter(task => task.done).length;
  const totalCount = category.tasks.length;
  const percentage = totalCount ? Math.round((completedCount / totalCount) * 100) : 0;
  progress.innerHTML = `
    <div class="progress-label"><span>${completedCount}/${totalCount} completed</span><strong>${percentage}%</strong></div>
    <div class="progress-bar"><div class="progress-bar-fill" style="width:${percentage}%"></div></div>
  `;

  const checklist = document.createElement("div");
  checklist.className = "task-list";
  category.tasks.forEach(task => {
    const label = document.createElement("label");
    label.innerHTML = `<input type="checkbox" ${task.done ? "checked" : ""} disabled /> ${task.text}`;
    checklist.appendChild(label);
  });

  const controls = document.createElement("div");
  controls.className = "card-footer";
  controls.innerHTML = `
    <button type="button" class="btn-secondary">Start</button>
    <button type="button" class="btn-secondary">Pause</button>
    <button type="button" class="btn-secondary">Reset</button>
  `;

  card.append(header, meta, progress, checklist, controls);
  return card;
}
```

### src/components/WorkoutCard.js

```js
export default function WorkoutCard(category){
  const card = document.createElement("article");
  card.className = "category-card workout-card";
  const completed = category.tasks.filter(task => task.done).length;
  const total = category.tasks.length;
  const percentage = total ? Math.round((completed / total) * 100) : 0;
  card.innerHTML = `
    <div class="card-header"><div><h3>${category.name}</h3><span class="badge">Workout</span></div></div>
    <div class="category-meta"><span>Day: ${category.metadata.workoutDay || "—"}</span><span>Calories: ${category.metadata.calories || 0}</span></div>
    <div class="progress-bar"><div class="progress-bar-fill" style="width:${percentage}%"></div></div>
    <div class="task-list">
      ${category.metadata.exercises.map(exercise => `<label><input type="checkbox" ${category.tasks.some(task => task.text === exercise && task.done) ? "checked" : ""} disabled /> ${exercise}</label>`).join("")}
    </div>
  `;
  return card;
}
```

### src/components/LoanCard.js

```js
export default function LoanCard(category){
  const card = document.createElement("article");
  card.className = "category-card loan-card";
  const balance = Number(category.metadata.balance || 0);
  const amount = Number(category.metadata.amount || 0);
  card.innerHTML = `
    <div class="card-header"><div><h3>${category.name}</h3><span class="badge">Loan</span></div></div>
    <div class="category-meta"><span>Amount: ₱${amount}</span><span>Balance: ₱${balance}</span></div>
    <div class="category-meta"><span>Monthly: ₱${category.metadata.monthlyPayment || 0}</span><span>Due: ${category.metadata.dueDate || "—"}</span></div>
    <div class="payment-history">${(category.metadata.paymentHistory || []).map(entry => `<div>${entry.date}: ₱${entry.amount}</div>`).join("")}</div>
  `;
  return card;
}
```

### src/components/BillCard.js

```js
export default function BillCard(category){
  const card = document.createElement("article");
  card.className = "category-card bill-card";
  const paid = category.metadata.status === "Paid";
  card.innerHTML = `
    <div class="card-header"><div><h3>${category.name}</h3><span class="badge">Bill</span></div></div>
    <div class="category-meta"><span>Amount: ₱${category.metadata.amount || 0}</span><span>Due: ${category.metadata.dueDate || "—"}</span></div>
    <div class="status-badge ${paid ? "paid" : "unpaid"}">${paid ? "Paid" : "Unpaid"}</div>
  `;
  return card;
}
```

### src/components/SavingsCard.js

```js
export default function SavingsCard(category){
  const card = document.createElement("article");
  card.className = "category-card savings-card";
  const target = Number(category.metadata.targetAmount || 0);
  const current = Number(category.metadata.currentAmount || 0);
  const percentage = target ? Math.round((current / target) * 100) : 0;
  card.innerHTML = `
    <div class="card-header"><div><h3>${category.name}</h3><span class="badge">Savings</span></div></div>
    <div class="category-meta"><span>Saved: ₱${current}</span><span>Target: ₱${target}</span></div>
    <div class="progress-bar"><div class="progress-bar-fill" style="width:${percentage}%"></div></div>
  `;
  return card;
}
```

### src/components/ProjectCard.js

```js
export default function ProjectCard(category){
  const card = document.createElement("article");
  card.className = "category-card project-card";
  const completed = category.tasks.filter(task => task.done).length;
  const total = category.tasks.length;
  const percentage = total ? Math.round((completed / total) * 100) : 0;
  card.innerHTML = `
    <div class="card-header"><div><h3>${category.name}</h3><span class="badge">Project</span></div></div>
    <div class="category-meta"><span>Deadline: ${category.metadata.deadline || "—"}</span><span>Milestones: ${category.metadata.milestones.length}</span></div>
    <div class="progress-bar"><div class="progress-bar-fill" style="width:${percentage}%"></div></div>
  `;
  return card;
}
```

### src/components/CategoryForm.js

```js
import categoryTypes from "../categories/categoryTypes.js";

export default function CategoryForm({ typeId, onChange, onSubmit }){
  const typeDef = categoryTypes[typeId] || categoryTypes.study;
  const form = document.createElement("form");
  form.className = "category-form";

  typeDef.fields.forEach(field => {
    const wrapper = document.createElement("label");
    wrapper.textContent = field.label;

    let input;
    if(field.type === "select"){
      input = document.createElement("select");
      field.options.forEach(option => {
        const optionEl = document.createElement("option");
        optionEl.value = option;
        optionEl.textContent = option;
        input.appendChild(optionEl);
      });
    } else if(field.type === "textarea"){
      input = document.createElement("textarea");
      input.placeholder = field.placeholder || "";
    } else {
      input = document.createElement("input");
      input.type = field.type;
      if(field.placeholder) input.placeholder = field.placeholder;
      if(field.min != null) input.min = field.min;
    }

    input.name = field.name;
    if(field.required) input.required = true;
    wrapper.appendChild(input);
    form.appendChild(wrapper);
  });

  const submit = document.createElement("button");
  submit.type = "submit";
  submit.textContent = "Create Category";
  form.appendChild(submit);

  form.addEventListener("submit", event => {
    event.preventDefault();
    const formData = new FormData(form);
    const values = Object.fromEntries(formData.entries());
    onSubmit(values);
  });

  return form;
}
```

### src/services/storage.js

```js
export function loadCategories(){
  const saved = localStorage.getItem("categories");
  if(!saved) return [];
  try { return JSON.parse(saved); } catch { localStorage.removeItem("categories"); return []; }
}

export function saveCategories(categories){
  localStorage.setItem("categories", JSON.stringify(categories));
}

export function migrateLegacyCategories(legacyCategories){
  return legacyCategories.map(category => {
    const type = category.type === "Timer" ? "study" : category.type === "Loan" ? "loan" : category.type === "Payment" ? "bill" : "study";
    return {
      id: category.key,
      name: category.label,
      type,
      metadata: {
        duration: category.duration,
        startTime: category.startTime,
        amount: category.amount,
        monthlyPayment: category.monthlyPayment,
        dueDate: category.dueDate
      },
      tasks: Array.isArray(category.initial) ? category.initial.map((item, index) => ({ id: `task_${index}`, text: typeof item === "string" ? item : item.text, done: false })) : [],
      createdAt: new Date().toISOString()
    };
  });
}
```

### src/services/render.js

```js
import { renderCategoryCard } from "../components/CategoryCard.js";

export function renderDashboard(categories, container){
  container.innerHTML = "";
  categories.forEach(category => {
    const card = renderCategoryCard(category);
    container.appendChild(card);
  });
}
```

### script.js

```js
import { loadCategories, saveCategories, migrateLegacyCategories } from "./src/services/storage.js";
import { renderDashboard } from "./src/services/render.js";
import categoryTypes from "./src/categories/categoryTypes.js";
import CategoryForm from "./src/components/CategoryForm.js";

const categoryGrid = document.getElementById("categoryGrid");
const categoryModalOverlay = document.getElementById("categoryModalOverlay");
const quickCategoryButton = document.getElementById("newCategoryAction");
const categoryTypeSelect = document.getElementById("categoryTypeSelect");
const toastMessage = document.getElementById("toastMessage");

let categories = loadCategories();
if(categories.length === 0){
  categories = migrateLegacyCategories(loadLegacyCategories());
  saveCategories(categories);
}

function showModal(){
  categoryModalOverlay.classList.remove("hidden");
  document.body.classList.add("modal-open");
}

function hideModal(){
  categoryModalOverlay.classList.add("hidden");
  document.body.classList.remove("modal-open");
}

function openCategoryModal(typeId){
  const formContainer = document.getElementById("categoryFormContainer");
  formContainer.innerHTML = "";
  const form = CategoryForm({
    typeId,
    onSubmit: data => {
      const categoryType = categoryTypes[typeId];
      const category = {
        id: `${typeId}_${Date.now()}`,
        name: data.name,
        type: typeId,
        metadata: categoryType.normalize(data).metadata,
        tasks: categoryType.normalize(data).tasks || [],
        createdAt: new Date().toISOString()
      };
      categories.push(category);
      saveCategories(categories);
      renderDashboard(categories, categoryGrid);
      hideModal();
      showToast("Category created successfully.");
    }
  });
  formContainer.appendChild(form);
  showModal();
}

quickCategoryButton.addEventListener("click", () => openCategoryModal("study"));
renderDashboard(categories, categoryGrid);
```

## Summary of Design

- `category.type` drives rendering and form fields.
- Each type has its own component and its own data schema.
- Legacy categories migrate to new type-based model.
- Quick actions remain modals and refresh dashboard on submit.
- Adding a new category type requires only:
  1. add type entry in `categoryTypes.js`
  2. create new card component
  3. define form schema in type definition

## Next Step

Implement the new files and restructure `index.html` to house one generic modal target and root render containers. This gives a stable baseline for scaling to new trackers like Habit, Reading, Water, and Expense.

---

If you want, I can now apply this architecture directly into the workspace files and update `index.html`/`script.js` with the new structure. 