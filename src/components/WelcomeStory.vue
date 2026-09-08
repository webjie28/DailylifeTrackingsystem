<template>
  <section class="welcome-story" aria-label="Welcome to Daily Life Tracker">
    <div class="story-brand"><span class="brand-mark">d.</span> DAILY LIFE TRACKER</div>
    <div class="story-copy">
      <span class="story-eyebrow"><i></i> A LITTLE PROGRESS, EVERY DAY</span>
      <h2>Make room for<br>your <em>best life.</em></h2>
      <p>Your goals, your routines, your everyday wins.<br>One thoughtful space to bring it all together.</p>
    </div>
    <div class="story-art" aria-hidden="true">
      <div class="orbit orbit-one"></div><div class="orbit orbit-two"></div>
      <div class="life-flower"><span v-for="n in 8" :key="n" :style="{ '--petal': n }"></span><b>✦</b></div>
      <div class="floating-note note-focus"><span>↗</span><div><small>ONE STEP AT A TIME</small><strong>Build a better routine</strong></div></div>
      <div class="floating-note note-balance"><span>✓</span><div><small>YOUR DAILY REMINDER</small><strong>Progress over perfection</strong></div></div>
    </div>
    <div class="story-tags"><span>◷ Find your focus</span><span>↗ Grow your goals</span><span>♡ Feel your best</span></div>
    <p class="story-footnote">Small habits. Meaningful change. All yours.</p>
  </section>
</template>
