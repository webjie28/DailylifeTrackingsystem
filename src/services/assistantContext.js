import { getTodayKey } from '../stores/appStore'

export function assistantContext(store) {
  const today = getTodayKey()
  const starters = { reading:'Read a few pages', stretch:'Take a stretch break', outdoors:'Spend time outdoors', rest:'Unwind before bed', connect:'Connect with someone', reflect:'Notice one good thing' }
  const saved = store.dailyTasks.filter(t => t.kind === 'everyday-habit')
  const habits = [...Object.entries(starters).map(([id,title]) => ({ id,title })), ...saved.filter(t => t.custom)]
  const checkin = store.dailyCheckins[today]
  return {
    today, timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    capturedAt: new Date().toISOString(),
    scope: 'Current tracker snapshot, not proof of real-world activity. Missing log does not mean not done. No historical study-time breakdown available.',
    habits: habits.slice(0,60).map(t => ({ title:String(t.title).slice(0,160), loggedToday:!!saved.find(s=>s.id===t.id)?.dates?.includes(today) })),
    tasks: store.dailyTasks.filter(t=>t.kind!=='everyday-habit').slice(0,60).map(t=>({title:String(t.title || t.text || '').slice(0,160),done:!!t.done,date:t.date || null})),
    movement: { loggedSteps:store.todaySteps, dailyStepTarget:store.fitnessStepGoal, workoutLogged:!!store.gymTrackerData[today] },
    hydration: { loggedMl:store.todayWaterIntake, dailyTargetMl:store.waterDailyTarget },
    checkin: checkin ? { recorded:true, sleepHours:checkin.sleepHours, mood:checkin.mood, energy:checkin.energy, meals:checkin.meals, selfCare:checkin.selfCare } : { recorded:false },
    goals:store.longtermGoalsList.slice(0,30).map(g=>({title:String(g.title).slice(0,160),deadline:g.deadline,milestones:g.milestones?.slice(0,30).map(m=>({text:String(m.text).slice(0,160),done:!!m.done}))})),
    study:{
      totalMinutesAllTime:store.studyTotalTime,
      books:store.studyBooksList.slice(0,40).map(book=>({title:String(book.title || '').slice(0,160),author:String(book.author || '').slice(0,120),status:book.status || null,progress:book.currentPage || book.page || null}))
    },
    calendar:store.eventsList.slice(0,50).map(event=>({title:String(event.title || '').slice(0,160),date:event.date,time:event.time || null,category:event.category || null})),
    money:{
      monthlyExpenses:store.monthlyExpenses,
      totalSavings:store.totalSavings,
      recentTransactions:store.financeTransactions.slice(0,40).map(tx=>({description:String(tx.desc || '').slice(0,160),type:tx.type,amount:tx.amount,category:tx.category,date:tx.date})),
      savingsGoals:store.savingsGoals.slice(0,30).map(goal=>({title:String(goal.name || goal.title || '').slice(0,160),target:goal.target || goal.amount || null,saved:goal.saved || goal.current || 0,deadline:goal.date || goal.deadline || null}))
    },
    watchlist:{
      total:store.animeWatchlist.length,
      completed:store.animeWatchlist.filter(a=>a.status==='completed').length,
      titles:store.animeWatchlist.slice(0,50).map(item=>({title:String(item.title || '').slice(0,160),status:item.status || null,rating:item.rating || null}))
    }
  }
}
