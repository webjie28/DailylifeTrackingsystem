import { getTodayKey } from '../stores/appStore'

const safeDate = value => {
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? null : date
}
const dateKey = value => safeDate(value)?.toISOString().slice(0, 10) || ''
const title = (value, fallback) => String(value || fallback).slice(0, 120)

export function buildTimeline(store) {
  const items = []
  store.financeTransactions.forEach(x => items.push({ type:'Money', icon:x.type === 'income' ? '↗' : '↘', title:`${x.type === 'income' ? 'Income' : 'Expense'}: ${title(x.description || x.category, 'Transaction')}`, detail:`₱${Number(x.amount || 0).toLocaleString()}`, date:x.date }))
  store.savingsContributions.forEach(x => items.push({ type:'Savings', icon:'₱', title:'Savings contribution', detail:`₱${Number(x.amount || 0).toLocaleString()}`, date:x.date }))
  store.eventsList.forEach(x => items.push({ type:'Calendar', icon:'▦', title:title(x.title, 'Calendar event'), detail:x.category || 'Event', date:x.date }))
  store.workTimeLogs.forEach(x => items.push({ type:'Work', icon:'◷', title:'Work session', detail:x.duration ? `${Math.round(Number(x.duration) / 60)} min` : 'Session logged', date:x.clockIn || x.date }))
  store.readingLogs.forEach(x => items.push({ type:'Study', icon:'▤', title:`Read ${title(x.bookTitle, 'a book')}`, detail:`${x.minsRead || 0} min · page ${x.pageNumber || 1}`, date:x.date }))
  Object.entries(store.waterIntakeLog).forEach(([date,amount]) => items.push({ type:'Hydration', icon:'◌', title:'Water logged', detail:`${amount} ml`, date }))
  Object.entries(store.walkTrackerData).forEach(([date,steps]) => items.push({ type:'Movement', icon:'⌁', title:'Steps logged', detail:`${Number(steps).toLocaleString()} steps`, date }))
  Object.entries(store.gymTrackerData).forEach(([date,workout]) => items.push({ type:'Movement', icon:'⌁', title:title(workout?.workout, 'Workout logged'), detail:`${workout?.calories || 0} kcal`, date }))
  Object.entries(store.dailyCheckins).forEach(([date,checkin]) => items.push({ type:'Check-in', icon:'♡', title:'Daily check-in', detail:`Mood: ${checkin?.mood || 'recorded'}`, date }))
  return items.map((item,index)=>({ ...item, id:`${item.type}-${index}-${item.date}`, stamp:safeDate(item.date)?.getTime() || 0, dateKey:dateKey(item.date) || String(item.date || '').slice(0,10) })).sort((a,b)=>b.stamp-a.stamp)
}

export function buildNotifications(store) {
  const today = getTodayKey()
  const soon = new Date(); soon.setDate(soon.getDate()+7)
  const notices = []
  if ((store.waterIntakeLog[today] || 0) < store.waterDailyTarget) notices.push({ level:'today', icon:'◌', title:'Hydration goal in progress', detail:`${store.waterIntakeLog[today] || 0} of ${store.waterDailyTarget} ml logged`, to:'/water' })
  if (!store.dailyCheckins[today]) notices.push({ level:'today', icon:'♡', title:'Daily check-in is open', detail:'Record how your day feels when you are ready.', to:'/check-in' })
  store.eventsList.filter(event => { const d=safeDate(event.date); return d && d>=new Date(today) && d<=soon }).forEach(event=>notices.push({level:'upcoming',icon:'▦',title:title(event.title,'Upcoming event'),detail:`Scheduled ${event.date}`,to:'/events'}))
  store.longtermGoalsList.filter(goal=>!goal.completed && goal.deadline).forEach(goal=>{ const d=safeDate(goal.deadline); if(d && d<=soon) notices.push({level:'upcoming',icon:'◎',title:title(goal.title,'Goal deadline'),detail:`Due ${goal.deadline}`,to:'/goals'}) })
  if (!notices.length) notices.push({level:'clear',icon:'✓',title:'You are all caught up',detail:'No time-sensitive tracker reminders right now.',to:'/'})
  return notices.slice(0,20)
}

export function buildAchievements(store) {
  const completedGoals = store.longtermGoalsList.filter(g=>g.completed || (g.milestones?.length && g.milestones.every(m=>m.done))).length
  const completedShows = store.animeWatchlist.filter(x=>x.status==='completed').length
  const completedBooks = store.studyBooksList.filter(x=>x.status==='completed').length
  return [
    { icon:'◌', name:'Well hydrated', detail:'Reach your daily water target', value:store.waterStreak, target:1, unit:'day streak' },
    { icon:'⌁', name:'On the move', detail:'Build a movement streak', value:store.fitnessStreak, target:3, unit:'day streak' },
    { icon:'▤', name:'Focused reader', detail:'Complete your first book', value:completedBooks, target:1, unit:'books' },
    { icon:'◎', name:'Goal getter', detail:'Complete a life goal', value:completedGoals, target:1, unit:'goals' },
    { icon:'₱', name:'Savings starter', detail:'Record your first contribution', value:store.savingsContributions.length, target:1, unit:'contributions' },
    { icon:'▷', name:'Watchlist finisher', detail:'Complete something from your list', value:completedShows, target:1, unit:'completed' }
  ].map(item=>({...item,unlocked:item.value>=item.target,progress:Math.min(100,Math.round(item.value/item.target*100))}))
}

export function reportSnapshot(store, days=7) {
  const timeline=buildTimeline(store); const cutoff=Date.now()-days*86400000
  const recent=timeline.filter(x=>x.stamp>=cutoff)
  const habitRows=store.dailyTasks.filter(x=>x.kind==='everyday-habit')
  const habitChecks=habitRows.reduce((sum,x)=>sum+(x.dates || []).filter(d=>safeDate(d)?.getTime()>=cutoff).length,0)
  const waterDays=Object.entries(store.waterIntakeLog).filter(([d])=>safeDate(d)?.getTime()>=cutoff)
  const avgWater=waterDays.length?Math.round(waterDays.reduce((s,[,v])=>s+Number(v||0),0)/waterDays.length):0
  const steps=Object.entries(store.walkTrackerData).filter(([d])=>safeDate(d)?.getTime()>=cutoff)
  const totalSteps=steps.reduce((s,[,v])=>s+Number(v||0),0)
  const expenses=store.financeTransactions.filter(x=>x.type==='expense'&&safeDate(x.date)?.getTime()>=cutoff).reduce((s,x)=>s+Number(x.amount||0),0)
  return {days,recent:recent.length,habitChecks,avgWater,totalSteps,expenses,studyMinutes:store.readingLogs.filter(x=>safeDate(x.date)?.getTime()>=cutoff).reduce((s,x)=>s+Number(x.minsRead||0),0),checkins:Object.keys(store.dailyCheckins).filter(d=>safeDate(d)?.getTime()>=cutoff).length}
}

export function searchTracker(store, query) {
  const q=query.trim().toLowerCase(); if(!q) return []
  const pool=[
    ...store.dailyTasks.map(x=>({type:'Task',title:title(x.title||x.text,'Task'),detail:x.done?'Completed':'Open',to:'/habits'})),
    ...store.longtermGoalsList.map(x=>({type:'Goal',title:title(x.title,'Goal'),detail:x.category||'Life goal',to:'/goals'})),
    ...store.eventsList.map(x=>({type:'Event',title:title(x.title,'Event'),detail:x.date||'',to:'/events'})),
    ...store.studyBooksList.map(x=>({type:'Book',title:title(x.title,'Book'),detail:x.author||x.status||'',to:'/study'})),
    ...store.animeWatchlist.map(x=>({type:'Watchlist',title:title(x.title,'Show'),detail:x.status||'',to:'/anime'})),
    ...store.financeTransactions.map(x=>({type:'Transaction',title:title(x.description||x.category,'Transaction'),detail:`₱${Number(x.amount||0).toLocaleString()}`,to:'/finance'})),
    ...store.savingsGoals.map(x=>({type:'Savings',title:title(x.name||x.title,'Savings goal'),detail:`₱${Number(x.targetAmount||x.target||0).toLocaleString()}`,to:'/savings'}))
  ]
  return pool.filter(x=>`${x.type} ${x.title} ${x.detail}`.toLowerCase().includes(q)).slice(0,40)
}
