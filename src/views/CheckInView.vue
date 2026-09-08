<template>
  <main class="checkin-page" id="main-content">
    <div class="checkin-crumb">Everyday <span>/</span> Daily check-in</div>

    <header class="checkin-header">
      <div><small>A QUIET MOMENT FOR YOURSELF</small><h1>How are you, really?</h1><p>Notice the patterns that shape your day—without judging them.</p></div>
      <label class="checkin-date"><span>Check-in date</span><input v-model="selectedDate" type="date" :max="today" /></label>
    </header>

    <section class="checkin-hero">
      <div class="checkin-orbit" :style="{ '--complete': `${completionPercent * 3.6}deg` }"><div><strong>{{ completionPercent }}%</strong><span>complete</span></div></div>
      <div class="checkin-hero-copy"><small>{{ isToday ? "TODAY'S CHECK-IN" : formattedSelectedDate.toUpperCase() }}</small><h2>{{ heroMessage }}</h2><p>{{ completedSections }} of 6 wellbeing areas checked in.</p><div class="checkin-track"><span :style="{ width: completionPercent + '%' }"></span></div></div>
      <div class="checkin-streak"><span>◒</span><div><strong>{{ checkinStreak }} day streak</strong><small>{{ checkinStreak ? 'Keep showing up for yourself.' : 'Your rhythm can begin today.' }}</small></div></div>
    </section>

    <section class="week-strip" aria-label="Recent check-ins">
      <button v-for="day in weekDays" :key="day.key" :class="{ selected: selectedDate === day.key, saved: day.saved }" @click="selectedDate = day.key">
        <small>{{ day.weekday }}</small><strong>{{ day.day }}</strong><span>{{ day.saved ? day.mood : '·' }}</span>
      </button>
    </section>

    <div class="checkin-grid">
      <section class="checkin-card sleep-card">
        <div class="card-heading"><div><small>REST & RECOVERY</small><h2>How did you sleep?</h2></div><span>☾</span></div>
        <div class="sleep-value"><strong>{{ draft.sleepHours }}</strong><span>hours</span></div>
        <input v-model.number="draft.sleepHours" class="range" type="range" min="0" max="12" step="0.5" aria-label="Hours slept" />
        <div class="range-labels"><span>0h</span><span>6h</span><span>12h</span></div>
        <p>Sleep quality</p>
        <div class="choice-row five"><button v-for="quality in sleepQualities" :key="quality.value" :class="{ active: draft.sleepQuality === quality.value }" @click="draft.sleepQuality = quality.value"><span>{{ quality.icon }}</span>{{ quality.label }}</button></div>
      </section>

      <section class="checkin-card mood-card">
        <div class="card-heading"><div><small>EMOTIONAL WEATHER</small><h2>What is your mood?</h2></div><span>◌</span></div>
        <div class="mood-grid"><button v-for="mood in moods" :key="mood.value" :class="{ active: draft.mood === mood.value }" @click="draft.mood = mood.value"><span>{{ mood.icon }}</span><strong>{{ mood.label }}</strong></button></div>
        <p>Energy level</p>
        <div class="energy-row"><button v-for="n in 5" :key="n" :class="{ active: draft.energy === n }" @click="draft.energy = n"><span></span>{{ energyLabels[n - 1] }}</button></div>
      </section>

      <section class="checkin-card care-card">
        <div class="card-heading"><div><small>SMALL ACTS THAT HELP</small><h2>Self-care moments</h2></div><span>✦</span></div>
        <p>Select everything you made space for.</p>
        <div class="care-grid"><button v-for="care in selfCareOptions" :key="care.id" :class="{ active: draft.selfCare.includes(care.id) }" @click="toggleCare(care.id)"><span>{{ care.icon }}</span><div><strong>{{ care.label }}</strong><small>{{ care.note }}</small></div><i>{{ draft.selfCare.includes(care.id) ? '✓' : '+' }}</i></button></div>
      </section>

      <section class="checkin-card meals-card">
        <div class="card-heading"><div><small>NOURISHMENT</small><h2>Meals today</h2></div><span>⌁</span></div>
        <p>Track the meals you had. No calorie counting required.</p>
        <div class="meal-grid"><button v-for="meal in meals" :key="meal.id" :class="{ active: draft.meals.includes(meal.id) }" @click="toggleMeal(meal.id)"><span>{{ meal.icon }}</span><strong>{{ meal.label }}</strong><small>{{ draft.meals.includes(meal.id) ? 'Logged' : 'Not yet' }}</small></button></div>
        <label class="meal-note"><span>How nourishing did today feel?</span><select v-model="draft.nourishment"><option value="">Choose one</option><option>Light</option><option>Balanced</option><option>Very nourishing</option></select></label>
      </section>
    </div>

    <section class="reflection-card">
      <div><small>ONE THOUGHT TO KEEP</small><h2>A note about your day</h2><p>A sentence is enough. What helped, what felt heavy, or what do you want to remember?</p></div>
      <textarea v-model="draft.reflection" maxlength="500" placeholder="Today I noticed…"></textarea>
      <footer><span>{{ draft.reflection.length }}/500</span><div><button v-if="hasSavedEntry" class="delete-checkin" @click="removeCheckin">Delete check-in</button><button class="save-checkin" @click="saveCheckin">{{ hasSavedEntry ? 'Update check-in' : 'Save check-in' }} <span>→</span></button></div></footer>
    </section>

    <transition name="toast"><div v-if="showToast" class="checkin-toast">✓ Your check-in has been saved.</div></transition>
  </main>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useAppStore, getTodayKey } from '../stores/appStore'

const store = useAppStore()
const today = getTodayKey()
const selectedDate = ref(today)
const showToast = ref(false)
const moods = [{ value:'rough', icon:'☁', label:'Rough' },{ value:'low', icon:'◔', label:'Low' },{ value:'okay', icon:'◌', label:'Okay' },{ value:'good', icon:'◕', label:'Good' },{ value:'great', icon:'☀', label:'Great' }]
const sleepQualities = [{ value:1, icon:'○', label:'Poor' },{ value:2, icon:'◔', label:'Fair' },{ value:3, icon:'◑', label:'Okay' },{ value:4, icon:'◕', label:'Good' },{ value:5, icon:'●', label:'Restful' }]
const energyLabels = ['Empty','Low','Steady','Good','Full']
const selfCareOptions = [
  { id:'sunlight', icon:'☼', label:'Sunlight', note:'Stepped into daylight' }, { id:'stretch', icon:'⌁', label:'Stretching', note:'Moved gently' },
  { id:'mindful', icon:'◌', label:'Mindful pause', note:'Breathed or meditated' }, { id:'outside', icon:'⌂', label:'Time outside', note:'Spent time outdoors' },
  { id:'screenfree', icon:'□', label:'Screen-free time', note:'Disconnected for a while' }, { id:'connect', icon:'♡', label:'Connection', note:'Talked with someone' }
]
const meals = [{ id:'breakfast', icon:'☼', label:'Breakfast' },{ id:'lunch', icon:'◐', label:'Lunch' },{ id:'dinner', icon:'☾', label:'Dinner' },{ id:'snack', icon:'◇', label:'Snack' }]
const blankDraft = () => ({ sleepHours:0, sleepQuality:0, mood:'', energy:0, selfCare:[], meals:[], nourishment:'', reflection:'' })
const draft = ref(blankDraft())

const hasSavedEntry = computed(() => Boolean(store.dailyCheckins[selectedDate.value]))
const isToday = computed(() => selectedDate.value === today)
const completedSections = computed(() => [draft.value.sleepHours > 0, Boolean(draft.value.mood), draft.value.energy > 0, draft.value.selfCare.length > 0, draft.value.meals.length > 0, Boolean(draft.value.reflection.trim())].filter(Boolean).length)
const completionPercent = computed(() => Math.round((completedSections.value / 6) * 100))
const heroMessage = computed(() => completionPercent.value === 100 ? 'You made space for the whole picture.' : completionPercent.value >= 50 ? 'You are halfway through this moment.' : 'Start with what feels easiest to answer.')
const formattedSelectedDate = computed(() => new Date(`${selectedDate.value}T00:00:00`).toLocaleDateString('en-US',{month:'long',day:'numeric',year:'numeric'}))
const checkinStreak = computed(() => { let count=0; const cursor=new Date(`${today}T00:00:00`); while(store.dailyCheckins[toKey(cursor)]){ count++; cursor.setDate(cursor.getDate()-1) } return count })
const weekDays = computed(() => Array.from({length:7},(_,index)=>{ const date=new Date(`${today}T00:00:00`); date.setDate(date.getDate()-(6-index)); const key=toKey(date); const entry=store.dailyCheckins[key]; return { key, weekday:date.toLocaleDateString('en-US',{weekday:'short'}), day:date.getDate(), saved:Boolean(entry), mood:moods.find(item=>item.value===entry?.mood)?.icon || '✓' } }))

function toKey(date){ return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}` }
function loadDate(){ const saved=store.dailyCheckins[selectedDate.value]; draft.value=saved ? { ...blankDraft(), ...saved, selfCare:[...(saved.selfCare||[])], meals:[...(saved.meals||[])] } : blankDraft() }
function toggleCare(id){ draft.value.selfCare = draft.value.selfCare.includes(id) ? draft.value.selfCare.filter(item=>item!==id) : [...draft.value.selfCare,id] }
function toggleMeal(id){ draft.value.meals = draft.value.meals.includes(id) ? draft.value.meals.filter(item=>item!==id) : [...draft.value.meals,id] }
async function saveCheckin(){ await store.saveDailyCheckin(selectedDate.value,draft.value); showToast.value=true; setTimeout(()=>showToast.value=false,2200) }
function removeCheckin(){ store.showConfirm({ title:'Delete this check-in?', message:`Remove your check-in for ${formattedSelectedDate.value}?`, confirmText:'Delete', onConfirm:async()=>{ await store.deleteDailyCheckin(selectedDate.value); loadDate() } }) }
watch(selectedDate,loadDate,{immediate:true})
</script>

<style scoped>
.checkin-page{--ci-bg:#fff;--ci-ink:#304c3c;--ci-muted:#7c8c80;--ci-line:#e2e9e2;--ci-soft:#edf2e9;--ci-green:#4f7d60;max-width:1400px;margin:auto;color:var(--ci-ink)}
[data-theme="dark"] .checkin-page{--ci-bg:#1c2922;--ci-ink:#e1ebe2;--ci-muted:#a0afa4;--ci-line:#35473a;--ci-soft:#293e30;--ci-green:#91b59d}[data-theme="navy"] .checkin-page{--ci-bg:#182b37;--ci-ink:#dceaf0;--ci-muted:#9bafbb;--ci-line:#304854;--ci-soft:#294655;--ci-green:#9ec3ba}
.checkin-crumb{font-size:11px;color:var(--ci-muted);padding-bottom:24px;border-bottom:1px solid var(--ci-line)}.checkin-crumb span{margin:0 12px}.checkin-header{display:flex;align-items:flex-end;justify-content:space-between;gap:25px;margin:32px 0 28px}.checkin-header small,.card-heading small,.reflection-card small{font-size:9px;letter-spacing:1.5px;color:var(--ci-muted)}.checkin-header h1{font-size:clamp(28px,2.8vw,37px);font-weight:500;letter-spacing:-1px;margin:11px 0 9px}.checkin-header p{font-size:12px;color:var(--ci-muted);margin:0}.checkin-date span{display:block;font-size:9px;color:var(--ci-muted);margin-bottom:7px}.checkin-date input{border:1px solid var(--ci-line);background:var(--ci-bg);color:var(--ci-ink);border-radius:8px;padding:10px 12px;font:400 11px inherit}
.checkin-hero{display:grid;grid-template-columns:auto minmax(240px,1fr) auto;align-items:center;gap:30px;padding:28px 32px;border-radius:18px;background:linear-gradient(125deg,#e8eee2,#dce9e6);color:#304c3c}.checkin-orbit{width:126px;height:126px;border-radius:50%;display:grid;place-items:center;background:conic-gradient(#5b8467 var(--complete),#cfdbcd 0);position:relative}.checkin-orbit::after{content:"";position:absolute;inset:10px;border-radius:50%;background:#f6f8f2}.checkin-orbit div{position:relative;z-index:1;text-align:center}.checkin-orbit strong{display:block;font-size:27px;font-weight:500}.checkin-orbit span{font-size:9px;color:#718070}.checkin-hero-copy>small{font-size:8px;letter-spacing:1.4px;color:#718070}.checkin-hero h2{font-size:23px;font-weight:500;letter-spacing:-.5px;margin:10px 0}.checkin-hero-copy p{font-size:10px;color:#718070}.checkin-track{height:6px;background:#ced9ca;border-radius:8px;overflow:hidden;margin-top:16px}.checkin-track span{display:block;height:100%;background:#60866b;border-radius:inherit;transition:width .5s}.checkin-streak{display:flex;align-items:center;gap:12px;padding-left:27px;border-left:1px solid #cbd7c7}.checkin-streak>span{display:grid;place-items:center;width:36px;height:36px;border-radius:9px;background:#f7f9f4;color:#60866b}.checkin-streak strong{display:block;font-size:12px;font-weight:500}.checkin-streak small{display:block;font-size:8px;color:#718070;margin-top:5px}
.week-strip{display:grid;grid-template-columns:repeat(7,1fr);gap:8px;margin:18px 0}.week-strip button{display:flex;align-items:center;justify-content:center;gap:8px;border:1px solid var(--ci-line);background:var(--ci-bg);color:var(--ci-muted);border-radius:10px;padding:10px;cursor:pointer}.week-strip small{font-size:8px}.week-strip strong{font-size:12px;font-weight:500;color:var(--ci-ink)}.week-strip button>span{font-size:12px}.week-strip button.saved{background:var(--ci-soft)}.week-strip button.selected{border-color:var(--ci-green);box-shadow:inset 0 0 0 1px var(--ci-green)}
.checkin-grid{display:grid;grid-template-columns:1fr 1fr;gap:18px}.checkin-card,.reflection-card{background:var(--ci-bg);border:1px solid var(--ci-line);border-radius:16px;padding:25px}.card-heading{display:flex;justify-content:space-between;align-items:flex-start}.card-heading h2,.reflection-card h2{font-size:18px;font-weight:500;margin:8px 0}.card-heading>span{display:grid;place-items:center;width:37px;height:37px;border-radius:9px;background:var(--ci-soft);color:var(--ci-green);font-size:19px}.checkin-card>p{color:var(--ci-muted);font-size:10px;margin:20px 0 10px}.sleep-value{margin:25px 0 6px}.sleep-value strong{font-size:38px;font-weight:500}.sleep-value span{font-size:11px;color:var(--ci-muted);margin-left:6px}.range{width:100%;accent-color:var(--ci-green)}.range-labels{display:flex;justify-content:space-between;color:var(--ci-muted);font-size:8px}.choice-row{display:grid;grid-template-columns:repeat(5,1fr);gap:6px}.choice-row button,.mood-grid button,.energy-row button,.care-grid button,.meal-grid button{border:1px solid var(--ci-line);background:transparent;color:var(--ci-muted);border-radius:9px;cursor:pointer}.choice-row button{padding:8px 3px;font:400 8px inherit}.choice-row button span{display:block;font-size:14px;margin-bottom:4px}.choice-row button.active,.mood-grid button.active,.energy-row button.active,.care-grid button.active,.meal-grid button.active{background:var(--ci-soft);border-color:#b9c9b8;color:var(--ci-ink)}.mood-grid{display:grid;grid-template-columns:repeat(5,1fr);gap:7px;margin-top:24px}.mood-grid button{padding:14px 4px}.mood-grid span{display:block;font-size:24px;margin-bottom:7px}.mood-grid strong{font-size:8px;font-weight:500}.energy-row{display:grid;grid-template-columns:repeat(5,1fr);gap:5px}.energy-row button{font:400 8px inherit;padding:9px 2px}.energy-row span{display:block;width:5px;height:5px;margin:0 auto 5px;border-radius:50%;background:var(--ci-line)}.energy-row button.active span{background:var(--ci-green)}
.care-card>p,.meals-card>p{margin-top:12px}.care-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px}.care-grid button{display:flex;align-items:center;gap:10px;text-align:left;padding:11px}.care-grid button>span{font-size:18px;color:var(--ci-green)}.care-grid div{flex:1}.care-grid strong{display:block;color:var(--ci-ink);font-size:10px;font-weight:500}.care-grid small{display:block;font-size:8px;color:var(--ci-muted);margin-top:3px}.care-grid i{font-style:normal}.meal-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:7px}.meal-grid button{padding:15px 4px}.meal-grid button>span{display:block;font-size:20px;color:var(--ci-green);margin-bottom:7px}.meal-grid strong,.meal-grid small{display:block;font-size:9px}.meal-grid small{font-size:7px;margin-top:4px;color:var(--ci-muted)}.meal-note{display:block;margin-top:18px;font-size:9px;color:var(--ci-muted)}.meal-note select{display:block;width:100%;box-sizing:border-box;margin-top:7px;border:1px solid var(--ci-line);border-radius:8px;background:var(--ci-bg);color:var(--ci-ink);padding:10px;font:400 10px inherit}
.reflection-card{margin-top:18px}.reflection-card>div p{font-size:10px;color:var(--ci-muted)}.reflection-card textarea{width:100%;min-height:100px;box-sizing:border-box;resize:vertical;margin-top:15px;padding:14px;border:1px solid var(--ci-line);border-radius:10px;background:var(--ci-bg);color:var(--ci-ink);font:400 12px/1.7 inherit;outline:0}.reflection-card textarea:focus{border-color:var(--ci-green)}.reflection-card footer{display:flex;align-items:center;justify-content:space-between;margin-top:12px}.reflection-card footer>span{font-size:8px;color:var(--ci-muted)}.reflection-card footer>div{display:flex;gap:8px}.save-checkin,.delete-checkin{border:1px solid var(--ci-line);border-radius:8px;padding:10px 14px;background:transparent;color:var(--ci-muted);font:500 10px inherit;cursor:pointer}.save-checkin{background:var(--ci-green);border-color:var(--ci-green);color:white}.save-checkin span{margin-left:8px}.checkin-toast{position:fixed;right:25px;bottom:25px;z-index:3000;background:#305b46;color:#fff;padding:12px 17px;border-radius:9px;font-size:11px;box-shadow:0 12px 35px #18322535}.toast-enter-active,.toast-leave-active{transition:.2s}.toast-enter-from,.toast-leave-to{opacity:0;transform:translateY(8px)}
@media(max-width:1050px){.checkin-hero{grid-template-columns:auto 1fr}.checkin-streak{grid-column:1/-1;border-left:0;border-top:1px solid #cbd7c7;padding:18px 0 0}.checkin-grid{grid-template-columns:1fr}.week-strip button{flex-direction:column;gap:3px}}
@media(max-width:700px){.checkin-header{align-items:flex-start;flex-direction:column}.checkin-date{width:100%}.checkin-date input{width:100%;box-sizing:border-box}.checkin-hero{grid-template-columns:1fr;padding:24px}.checkin-orbit{margin:auto}.checkin-hero-copy{text-align:center}.checkin-streak{grid-column:auto}.week-strip{gap:4px}.week-strip button{padding:8px 2px}.week-strip small{display:none}.care-grid{grid-template-columns:1fr}.reflection-card footer{align-items:flex-start;gap:12px;flex-direction:column}.reflection-card footer>div{width:100%}.reflection-card footer button{flex:1}}
@media(max-width:450px){.mood-grid,.choice-row{grid-template-columns:repeat(5,minmax(0,1fr));gap:3px}.mood-grid span{font-size:19px}.meal-grid{grid-template-columns:1fr 1fr}.checkin-card,.reflection-card{padding:20px}}
</style>
