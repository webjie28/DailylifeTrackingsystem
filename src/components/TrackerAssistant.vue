<script setup>
import { ref, watch, nextTick, onMounted, onUnmounted } from 'vue'
import { useAppStore } from '../stores/appStore'
import { assistantContext } from '../services/assistantContext'
const store = useAppStore()
const trigger = ref(null)
const thread = ref(null)
const open = ref(false)
const question = ref('')
const messages = ref([])
const pending = ref(false)
const error = ref('')
let request
const suggestions = ["How am I doing today?", "What haven't I logged today?", 'Which goal should I revisit?']
const historyKey = () => `dlt-assistant-history:${store.user?.uid || 'anonymous'}`
function loadHistory() {
  try { messages.value = JSON.parse(localStorage.getItem(historyKey()) || '[]').slice(-30) }
  catch { messages.value = [] }
}
function saveHistory() { try { localStorage.setItem(historyKey(), JSON.stringify(messages.value.slice(-30))) } catch {} }
function clearHistory() { messages.value = []; try { localStorage.removeItem(historyKey()) } catch {} }
function close() { open.value = false; trigger.value?.focus() }
async function ask(text = question.value) {
  if (pending.value || !text.trim()) return
  question.value = text
  error.value = ''
  pending.value = true
  request = new AbortController()
  const timeout = setTimeout(()=>request?.abort(),30000)
  try {
    const token = await store.user.getIdToken()
    const history = messages.value.slice(-8).map(item => ({ question:item.question.slice(0,500), reply:item.reply.slice(0,1500) }))
    const response = await fetch('/api/assistant', {method:'POST',headers:{'Content-Type':'application/json',Authorization:`Bearer ${token}`},body:JSON.stringify({question:text,context:assistantContext(store),history}),signal:request.signal})
    if (!(response.headers.get('content-type') || '').includes('application/json')) throw new Error('AI server is not available here yet. Open the deployed site or start the API server.')
    const result = await response.json()
    if (!response.ok) throw new Error(result.error || 'Unable to reach the assistant.')
    if (typeof result.reply !== 'string') throw new Error('The assistant returned an invalid response.')
    messages.value.push({question:text,reply:result.reply})
    saveHistory()
    question.value = ''
    await nextTick()
    thread.value?.scrollTo({top:thread.value.scrollHeight,behavior:'smooth'})
  } catch (err) { if (store.isAuthenticated) error.value = err.name === 'AbortError' ? 'The response took too long. Please try again.' : err.message }
  finally { clearTimeout(timeout); pending.value = false }
}
watch(()=>store.user?.uid,()=>{request?.abort();question.value='';error.value='';open.value=false;loadHistory()},{immediate:true})
function onKeydown(event) { if (event.key === 'Escape' && open.value) close() }
onMounted(()=>window.addEventListener('keydown',onKeydown))
onUnmounted(()=>request?.abort())
onUnmounted(()=>window.removeEventListener('keydown',onKeydown))
</script>
<template>
  <button ref="trigger" class="assistant-launch" @click="open=true" aria-haspopup="dialog" :aria-expanded="open" aria-controls="dlt-assistant-panel" aria-label="Open DLT AI assistant">
    <span class="assistant-launch-label"><strong>AI Assistant</strong><small>Ask about your day</small></span>
    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 15a4 4 0 0 1-4 4H8l-4 3v-3a4 4 0 0 1-2-3.46V8a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4Z"/><path d="M7 9h10M7 13h7"/></svg>
    <span class="assistant-pulse"></span>
  </button>
  <Teleport to="body">
    <aside id="dlt-assistant-panel" class="assistant-panel" :class="{'is-open':open}" :aria-hidden="!open" aria-labelledby="assistant-title">
      <header><div><span class="assistant-eyebrow">DLT AI</span><h2 id="assistant-title">Your daily assistant</h2><p>Understand your day, one check-in at a time.</p></div><button @click="close" aria-label="Close assistant">×</button></header>
      <p class="assistant-disclosure">When you send a question, a summary of your tracker—including wellbeing and money totals—is shared with the connected AI workflow. Answers use your current logs. A missing log does not mean you skipped an activity.</p>
      <div class="assistant-history-bar"><span>{{ messages.length ? `${messages.length} saved conversation${messages.length === 1 ? '' : 's'}` : 'Start a new conversation' }}</span><button v-if="messages.length" @click="clearHistory">Clear history</button></div>
      <div ref="thread" class="assistant-thread" aria-live="polite">
        <p v-if="!messages.length">Ask about today's progress, unchecked habits, or your goals.</p>
        <article v-for="(message,i) in messages" :key="i"><p class="assistant-question">{{ message.question }}</p><p class="assistant-reply">{{ message.reply }}</p></article>
        <p v-if="pending" role="status">Checking your tracker…</p>
      </div>
      <div class="assistant-suggestions"><button v-for="text in suggestions" :key="text" :disabled="pending" @click="ask(text)">{{ text }}</button></div>
      <p v-if="error" role="alert" class="assistant-error">{{ error }}</p>
      <form @submit.prevent="ask()"><label for="assistant-question">Ask about your tracker</label><div><input id="assistant-question" v-model="question" maxlength="1000" placeholder="What should I focus on next?" required :disabled="pending"><button :disabled="pending || !question.trim()">{{ pending ? 'Waiting…' : 'Send' }}</button></div></form>
    </aside>
  </Teleport>
</template>
<style scoped>
.assistant-launch{position:fixed;right:24px;bottom:24px;z-index:900;width:58px;height:58px;border:1px solid #ff9b54;border-radius:50%;display:grid;place-items:center;background:linear-gradient(145deg,#ff7a1a,#e95500);color:white;box-shadow:0 12px 30px #d957004f,0 0 0 7px #ef6c1b18;cursor:pointer;transition:transform .2s ease,box-shadow .2s ease;animation:assistant-arrive .55s cubic-bezier(.2,.8,.2,1) both}
.assistant-launch:hover{transform:translateY(-4px) scale(1.07);box-shadow:0 18px 40px #d957006b,0 0 0 10px #ef6c1b24}.assistant-launch:focus-visible{outline:3px solid #ef6c1b55;outline-offset:5px}.assistant-launch svg{width:25px;height:25px;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round;transform-origin:center;transition:transform .2s ease}.assistant-launch:hover svg{animation:assistant-wave .55s ease}.assistant-launch-label{position:absolute;right:69px;min-width:128px;padding:9px 12px;border:1px solid var(--border-color);border-radius:12px;background:var(--bg-card);color:var(--text-primary);box-shadow:0 8px 24px #18231d20;text-align:left;white-space:nowrap;transition:transform .22s ease,box-shadow .22s ease,border-color .22s ease}.assistant-launch:hover .assistant-launch-label{transform:translateX(-5px);border-color:#ef6c1b80;box-shadow:0 12px 30px #b750172b}.assistant-launch-label strong,.assistant-launch-label small{display:block}.assistant-launch-label strong{font-size:13px}.assistant-launch-label small{margin-top:2px;color:var(--text-muted);font-size:11px;font-weight:500}.assistant-pulse{position:absolute;right:2px;top:2px;width:11px;height:11px;border:2px solid var(--bg-primary);border-radius:50%;background:#8fb46d}.assistant-pulse::after{content:'';position:absolute;inset:-4px;border:1px solid #8fb46d;border-radius:50%;animation:assistant-ping 2s ease-out infinite}@keyframes assistant-ping{0%{transform:scale(.7);opacity:.8}70%,100%{transform:scale(1.8);opacity:0}}@keyframes assistant-arrive{from{opacity:0;transform:translateY(18px) scale(.84)}to{opacity:1;transform:none}}@keyframes assistant-wave{0%,100%{transform:rotate(0) scale(1)}30%{transform:rotate(-8deg) scale(1.08)}65%{transform:rotate(7deg) scale(1.12)}}
.assistant-panel{position:fixed;z-index:950;inset:0 0 0 auto;width:min(440px,100vw);height:100dvh;box-sizing:border-box;display:flex;flex-direction:column;overflow:hidden;padding:26px 22px;border:0;border-left:1px solid var(--border-color);background:var(--bg-card);color:var(--text-primary);box-shadow:-20px 0 55px #101a1530;transform:translateX(105%);visibility:hidden;pointer-events:none;transition:transform .32s cubic-bezier(.2,.8,.2,1),visibility .32s}
.assistant-panel.is-open{transform:translateX(0);visibility:visible;pointer-events:auto}header{display:flex;justify-content:space-between;align-items:start;text-align:left;margin:0}h2{font-size:25px;margin:3px 0 0}.assistant-eyebrow{color:#ef6c1b;font-size:11px;font-weight:800;letter-spacing:.16em}header p{font-size:14px;color:var(--text-muted);margin:5px 0 14px}header button{background:none;border:0;color:inherit;font-size:27px;cursor:pointer}.assistant-disclosure{font-size:12px;color:var(--text-muted);line-height:1.6;padding:12px;background:var(--bg-subtle);border-radius:10px}.assistant-history-bar{display:flex;align-items:center;justify-content:space-between;gap:12px;margin:14px 0 4px;color:var(--text-muted);font-size:12px}.assistant-history-bar button{border:0;background:none;color:#d45e18;font-size:12px;cursor:pointer}.assistant-thread{flex:1;min-height:130px;overflow:auto;padding-right:3px;font-size:15px;line-height:1.7}.assistant-thread article{padding-bottom:8px;border-bottom:1px solid var(--border-color)}.assistant-question{background:var(--bg-subtle);padding:12px;border-radius:12px}.assistant-reply{white-space:pre-wrap;overflow-wrap:anywhere}.assistant-suggestions{display:flex;gap:7px;flex-wrap:wrap;margin:13px 0}.assistant-suggestions button{background:var(--bg-subtle);color:var(--text-primary);border:1px solid var(--border-color);padding:8px 10px;border-radius:15px;font-size:12px;cursor:pointer}form label{font-size:13px;display:block;margin:10px 0 8px}form>div{display:flex;gap:8px}input{min-width:0;flex:1;padding:12px;border:1px solid var(--border-color);border-radius:10px;background:var(--bg-primary);color:var(--text-primary);font-size:16px}form button{border:0;background:#315f47;color:white;padding:12px;border-radius:10px;cursor:pointer}button:disabled{opacity:.6;cursor:wait}.assistant-error{color:var(--text-primary);border-left:3px solid #c68766;padding:10px;font-size:13px}
@media (max-width:700px){.assistant-launch{right:16px;bottom:16px;width:54px;height:54px}.assistant-launch-label{display:none}.assistant-panel{width:min(390px,calc(100vw - 16px));padding:20px 16px}}
@media (prefers-reduced-motion:reduce){.assistant-launch,.assistant-launch svg,.assistant-launch-label{animation:none!important;transition:none}.assistant-pulse::after{animation:none}}
</style>
