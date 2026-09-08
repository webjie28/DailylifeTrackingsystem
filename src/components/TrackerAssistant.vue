<script setup>
import { ref, watch, nextTick, onUnmounted } from 'vue'
import { useAppStore } from '../stores/appStore'
import { assistantContext } from '../services/assistantContext'
const store = useAppStore()
const panel = ref(null)
const trigger = ref(null)
const thread = ref(null)
const question = ref('')
const messages = ref([])
const pending = ref(false)
const error = ref('')
let request
const suggestions = ["How am I doing today?", "What haven't I logged today?", 'Which goal should I revisit?']
function close() { panel.value?.close(); trigger.value?.focus() }
async function ask(text = question.value) {
  if (pending.value || !text.trim()) return
  question.value = text
  error.value = ''
  pending.value = true
  request = new AbortController()
  const timeout = setTimeout(()=>request?.abort(),30000)
  try {
    const token = await store.user.getIdToken()
    const response = await fetch('/api/assistant', {method:'POST',headers:{'Content-Type':'application/json',Authorization:`Bearer ${token}`},body:JSON.stringify({question:text,context:assistantContext(store)}),signal:request.signal})
    if (!(response.headers.get('content-type') || '').includes('application/json')) throw new Error('AI server is not available here yet. Open the deployed site or start the API server.')
    const result = await response.json()
    if (!response.ok) throw new Error(result.error || 'Unable to reach the assistant.')
    if (typeof result.reply !== 'string') throw new Error('The assistant returned an invalid response.')
    messages.value.push({question:text,reply:result.reply})
    question.value = ''
    await nextTick()
    thread.value?.scrollTo({top:thread.value.scrollHeight,behavior:'smooth'})
  } catch (err) { if (store.isAuthenticated) error.value = err.name === 'AbortError' ? 'The response took too long. Please try again.' : err.message }
  finally { clearTimeout(timeout); pending.value = false }
}
watch(()=>store.user?.uid,()=>{request?.abort();messages.value=[];question.value='';error.value='';panel.value?.close()})
onUnmounted(()=>request?.abort())
</script>
<template>
  <button ref="trigger" class="assistant-launch" @click="panel.showModal()" aria-haspopup="dialog" aria-label="Open DLT AI assistant">
    <span class="assistant-launch-label"><strong>AI Assistant</strong><small>Ask about your day</small></span>
    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 15a4 4 0 0 1-4 4H8l-4 3v-3a4 4 0 0 1-2-3.46V8a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4Z"/><path d="M7 9h10M7 13h7"/></svg>
    <span class="assistant-pulse"></span>
  </button>
  <Teleport to="body">
    <dialog ref="panel" class="assistant-panel" aria-labelledby="assistant-title" @cancel.prevent="close" @click="e=>{if(e.target===panel)close()}">
      <header><div><h2 id="assistant-title">Your DLT assistant</h2><p>Understand your day, one check-in at a time.</p></div><button @click="close" aria-label="Close assistant">×</button></header>
      <p class="assistant-disclosure">When you send a question, a summary of your tracker—including wellbeing and money totals—is shared with the connected AI workflow. Answers use your current logs. A missing log does not mean you skipped an activity.</p>
      <div ref="thread" class="assistant-thread" aria-live="polite">
        <p v-if="!messages.length">Ask about today's progress, unchecked habits, or your goals.</p>
        <article v-for="(message,i) in messages" :key="i"><p class="assistant-question">{{ message.question }}</p><p class="assistant-reply">{{ message.reply }}</p></article>
        <p v-if="pending" role="status">Checking your tracker…</p>
      </div>
      <div class="assistant-suggestions"><button v-for="text in suggestions" :key="text" :disabled="pending" @click="ask(text)">{{ text }}</button></div>
      <p v-if="error" role="alert" class="assistant-error">{{ error }}</p>
      <form @submit.prevent="ask()"><label for="assistant-question">Ask about your tracker</label><div><input id="assistant-question" v-model="question" maxlength="1000" placeholder="What should I focus on next?" required :disabled="pending"><button :disabled="pending || !question.trim()">{{ pending ? 'Waiting…' : 'Send' }}</button></div></form>
    </dialog>
  </Teleport>
</template>
<style scoped>
.assistant-launch{position:fixed;right:24px;bottom:24px;z-index:900;width:58px;height:58px;border:1px solid #ff9b54;border-radius:50%;display:grid;place-items:center;background:linear-gradient(145deg,#ff7a1a,#e95500);color:white;box-shadow:0 12px 30px #d957004f,0 0 0 7px #ef6c1b18;cursor:pointer;transition:transform .2s ease,box-shadow .2s ease;animation:assistant-arrive .55s cubic-bezier(.2,.8,.2,1) both}
.assistant-launch:hover{transform:translateY(-4px) scale(1.07);box-shadow:0 18px 40px #d957006b,0 0 0 10px #ef6c1b24}.assistant-launch:focus-visible{outline:3px solid #ef6c1b55;outline-offset:5px}.assistant-launch svg{width:25px;height:25px;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round;transform-origin:center;transition:transform .2s ease}.assistant-launch:hover svg{animation:assistant-wave .55s ease}.assistant-launch-label{position:absolute;right:69px;min-width:128px;padding:9px 12px;border:1px solid var(--border-color);border-radius:12px;background:var(--bg-card);color:var(--text-primary);box-shadow:0 8px 24px #18231d20;text-align:left;white-space:nowrap;transition:transform .22s ease,box-shadow .22s ease,border-color .22s ease}.assistant-launch:hover .assistant-launch-label{transform:translateX(-5px);border-color:#ef6c1b80;box-shadow:0 12px 30px #b750172b}.assistant-launch-label strong,.assistant-launch-label small{display:block}.assistant-launch-label strong{font-size:13px}.assistant-launch-label small{margin-top:2px;color:var(--text-muted);font-size:11px;font-weight:500}.assistant-pulse{position:absolute;right:2px;top:2px;width:11px;height:11px;border:2px solid var(--bg-primary);border-radius:50%;background:#8fb46d}.assistant-pulse::after{content:'';position:absolute;inset:-4px;border:1px solid #8fb46d;border-radius:50%;animation:assistant-ping 2s ease-out infinite}@keyframes assistant-ping{0%{transform:scale(.7);opacity:.8}70%,100%{transform:scale(1.8);opacity:0}}@keyframes assistant-arrive{from{opacity:0;transform:translateY(18px) scale(.84)}to{opacity:1;transform:none}}@keyframes assistant-wave{0%,100%{transform:rotate(0) scale(1)}30%{transform:rotate(-8deg) scale(1.08)}65%{transform:rotate(7deg) scale(1.12)}}
.assistant-panel{margin:auto;width:min(560px,calc(100vw - 28px));max-height:calc(100dvh - 28px);overflow:auto;padding:24px;border:1px solid var(--border-color);border-radius:22px;background:var(--bg-card);color:var(--text-primary)}
.assistant-panel::backdrop{background:#08170f88;backdrop-filter:blur(5px)}header{display:flex;justify-content:space-between;align-items:start;text-align:left;margin:0}h2{font-size:23px;margin:0}header p{font-size:14px;color:var(--text-muted)}header button{background:none;border:0;color:inherit;font-size:27px;cursor:pointer}.assistant-disclosure{font-size:12px;color:var(--text-muted);line-height:1.6;padding:12px;background:var(--bg-subtle);border-radius:10px}.assistant-thread{max-height:38dvh;overflow:auto;font-size:15px;line-height:1.7}.assistant-question{background:var(--bg-subtle);padding:12px;border-radius:12px}.assistant-reply{white-space:pre-wrap;overflow-wrap:anywhere}.assistant-suggestions{display:flex;gap:7px;flex-wrap:wrap;margin:16px 0}.assistant-suggestions button{background:var(--bg-subtle);color:var(--text-primary);border:1px solid var(--border-color);padding:8px 10px;border-radius:15px;font-size:12px;cursor:pointer}form label{font-size:13px;display:block;margin:12px 0 8px}form>div{display:flex;gap:8px}input{min-width:0;flex:1;padding:12px;border:1px solid var(--border-color);border-radius:10px;background:var(--bg-primary);color:var(--text-primary);font-size:16px}form button{border:0;background:#315f47;color:white;padding:12px;border-radius:10px;cursor:pointer}button:disabled{opacity:.6;cursor:wait}.assistant-error{color:var(--text-primary);border-left:3px solid #c68766;padding:10px;font-size:13px}
@media (max-width:700px){.assistant-launch{right:16px;bottom:16px;width:54px;height:54px}.assistant-launch-label{display:none}.assistant-panel{padding:18px;border-radius:18px}}
@media (prefers-reduced-motion:reduce){.assistant-launch,.assistant-launch svg,.assistant-launch-label{animation:none!important;transition:none}.assistant-pulse::after{animation:none}}
</style>
