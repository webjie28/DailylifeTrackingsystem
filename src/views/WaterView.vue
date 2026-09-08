<template>
  <div class="water-view wellness-page hydration-page">
    <div class="wellness-crumb">Everyday <span>/</span> Hydration</div>
    <header class="wellness-header hydration-header">
      <div><small>A GENTLE REMINDER TO REFILL</small><h1>Take a moment. Have some water.</h1><p>Small sips throughout the day can make a real difference.</p></div>
      <div class="hydration-streak"><span>◒</span><div><strong>{{ store.waterStreak }} day streak</strong><small>{{ store.waterStreak ? 'Keep your rhythm flowing.' : 'A fresh start begins today.' }}</small></div></div>
    </header>

    <section class="hydration-hero">
      <div class="hydration-orb" :style="{ '--fill': intakePercentage + '%' }" aria-hidden="true"><span class="water-wave wave-one"></span><span class="water-wave wave-two"></span><div><strong>{{ intakePercentage }}%</strong><small>of today’s goal</small></div></div>
      <div class="hydration-today"><small>TODAY'S HYDRATION</small><h2>{{ hydrationMessage }}</h2><p><strong>{{ store.todayWaterIntake.toLocaleString() }}</strong> of {{ store.waterDailyTarget.toLocaleString() }} ml</p><div class="hydration-track"><span :style="{ width: intakePercentage + '%' }"></span></div><small>{{ remainingText }}</small></div>
      <div class="hydration-quick"><span>Quick add</span><div><button v-for="amount in [250, 350, 500]" :key="amount" @click="addWater(amount)"><b>＋</b>{{ amount }} ml</button></div><button class="custom-water" @click="openCustom">Use a custom amount <span>↗</span></button></div>
    </section>

    <div v-if="justAdded" class="hydration-toast" role="status">✓ Added {{ justAdded }} ml to today</div>

    <section class="hydration-grid">
      <article class="hydration-panel weekly-panel"><div class="panel-title"><div><small>YOUR WEEK AT A GLANCE</small><h2>Hydration rhythm</h2></div><span>{{ weeklyAverage.toLocaleString() }} ml avg.</span></div><div class="water-week"><div v-for="day in weeklyData" :key="day.date" class="water-day" :title="`${day.label}: ${day.amount} ml`"><div class="water-bar"><span :style="{ height: day.percent + '%' }"></span><i v-if="day.amount >= store.waterDailyTarget">✓</i></div><strong>{{ day.short }}</strong><small>{{ day.amount ? Math.round(day.amount / 100) / 10 + 'L' : '—' }}</small></div></div></article>
      <article class="hydration-panel target-panel"><div class="panel-title"><div><small>YOUR PACE, YOUR GOAL</small><h2>Daily target</h2></div><span>◎</span></div><p>Choose a goal that feels realistic for your routine.</p><label for="water-target">Daily water goal</label><div class="target-input"><input id="water-target" type="number" v-model.number="targetDraft" min="500" max="10000" step="250"><span>ml</span></div><div class="target-presets"><button v-for="amount in [1500,2000,2500,3000]" :key="amount" :aria-pressed="targetDraft === amount" @click="targetDraft = amount">{{ amount / 1000 }} L</button></div><button class="save-target" @click="saveTarget">Save daily goal</button></article>
    </section>

    <section class="hydration-panel history-panel"><div class="panel-title"><div><small>A LOOK BACK</small><h2>Recent check-ins</h2></div><span>{{ sortedHistory.length }} days</span></div><div v-if="!sortedHistory.length" class="hydration-empty"><span>♒</span><h3>Your first glass starts here.</h3><p>Add some water above and your daily history will appear here.</p></div><div v-else class="hydration-history"><div v-for="log in sortedHistory" :key="log.date"><span class="history-date"><strong>{{ formatDate(log.date) }}</strong><small>{{ log.date }}</small></span><div class="history-progress"><span :style="{ width: Math.min(100, log.amount / store.waterDailyTarget * 100) + '%' }"></span></div><strong>{{ log.amount.toLocaleString() }} ml</strong><button @click="deleteLog(log.date)" :aria-label="`Delete hydration entry for ${log.date}`">×</button></div></div></section>

    <Teleport to="body"><dialog ref="customDialog" class="hydration-dialog" aria-labelledby="custom-water-title" @cancel.prevent="closeCustom" @click="event => { if (event.target === customDialog) closeCustom() }"><button class="dialog-close" @click="closeCustom" aria-label="Close custom water form">×</button><small>LOG A DRINK</small><h2 id="custom-water-title">How much did you have?</h2><p>Add the amount in milliliters.</p><form @submit.prevent="saveCustom"><label for="custom-water">Water amount</label><div><input id="custom-water" ref="customInputEl" type="number" v-model.number="customAmount" min="1" max="5000" step="10" required><span>ml</span></div><div class="dialog-actions"><button type="button" @click="closeCustom">Cancel</button><button type="submit">Add water ↗</button></div></form></dialog></Teleport>
  </div>
</template>

<script setup>
import { computed, ref, nextTick } from 'vue'
import { useAppStore, getTodayKey } from '../stores/appStore'
const store = useAppStore()
const customDialog = ref(null)
const customInputEl = ref(null)
const customAmount = ref(330)
const targetDraft = ref(store.waterDailyTarget)
const justAdded = ref(0)
let toastTimer
const intakePercentage = computed(() => Math.min(100, Math.round(store.todayWaterIntake / Math.max(1, store.waterDailyTarget) * 100)))
const hydrationMessage = computed(() => intakePercentage.value >= 100 ? 'You’re beautifully topped up.' : intakePercentage.value >= 70 ? 'Nearly there. Keep sipping.' : intakePercentage.value >= 35 ? 'You’re finding your flow.' : 'Let’s pour the first glass.')
const remainingText = computed(() => store.todayWaterIntake >= store.waterDailyTarget ? 'Goal reached — anything more is a bonus.' : `${(store.waterDailyTarget - store.todayWaterIntake).toLocaleString()} ml to go`)
const sortedHistory = computed(() => Object.entries(store.waterIntakeLog).map(([date,amount]) => ({date,amount})).sort((a,b) => b.date.localeCompare(a.date)).slice(0,10))
const weeklyData = computed(() => Array.from({length:7}, (_,i) => { const date=new Date(); date.setDate(date.getDate()-(6-i)); const key=`${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`; const amount=store.waterIntakeLog[key] || 0; return {date:key,amount,percent:Math.min(100,amount/Math.max(1,store.waterDailyTarget)*100),short:date.toLocaleDateString('en-US',{weekday:'short'}).slice(0,2),label:date.toLocaleDateString('en-US',{weekday:'long'})} }))
const weeklyAverage = computed(() => Math.round(weeklyData.value.reduce((sum,d)=>sum+d.amount,0)/7))
function showAdded(amount) { justAdded.value=amount; clearTimeout(toastTimer); toastTimer=setTimeout(()=>justAdded.value=0,2200) }
function addWater(amount) { store.addWater(amount); showAdded(amount) }
async function openCustom() { customDialog.value.showModal(); await nextTick(); customInputEl.value?.select() }
function closeCustom() { customDialog.value.close() }
function saveCustom() { const amount=parseInt(customAmount.value); if(!amount || amount<1)return; addWater(amount); closeCustom() }
function saveTarget() { const target=parseInt(targetDraft.value); if(target>=500 && target<=10000) store.updateWaterTarget(target) }
function formatDate(date) { return date === getTodayKey() ? 'Today' : new Date(date+'T00:00:00').toLocaleDateString('en-US',{weekday:'short',month:'short',day:'numeric'}) }
function deleteLog(date) { store.showConfirm({title:'Delete hydration entry?',message:`Remove the water total for ${formatDate(date)}?`,confirmText:'Delete',onConfirm:()=>store.deleteWaterLog(date)}) }
</script>
