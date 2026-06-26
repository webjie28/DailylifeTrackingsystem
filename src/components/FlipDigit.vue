<template>
  <div class="flip-card" :class="{ 'is-flipping': flipping }">
    <!-- Background cards -->
    <div class="flip-card-face top-back">
      <span>{{ value }}</span>
    </div>
    <div class="flip-card-face bottom-back">
      <span>{{ prevValue }}</span>
    </div>
    
    <!-- Animating front cards -->
    <div class="flip-card-face top-front">
      <span>{{ prevValue }}</span>
    </div>
    <div class="flip-card-face bottom-front">
      <span>{{ value }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'

const props = defineProps({
  value: {
    type: [String, Number],
    required: true
  }
})

const prevValue = ref(props.value)
const flipping = ref(false)

watch(() => props.value, (newVal, oldVal) => {
  prevValue.value = oldVal
  flipping.value = true
  
  // Reset flipping state after animation completes (600ms)
  setTimeout(() => {
    flipping.value = false
    prevValue.value = newVal
  }, 600)
})

onMounted(() => {
  prevValue.value = props.value
})
</script>

<style scoped>
.flip-card {
  position: relative;
  width: 42px;
  height: 64px;
  font-size: 40px;
  font-weight: 800;
  line-height: 1.1;
  color: var(--time-accent, var(--accent-orange));
  perspective: 200px;
  user-select: none;
}

.flip-card-face {
  position: absolute;
  left: 0;
  width: 100%;
  height: 50%;
  overflow: hidden;
  background: var(--glass-bg, rgba(255, 255, 255, 0.15)) !important;
  backdrop-filter: blur(20px) saturate(180%) !important;
  -webkit-backdrop-filter: blur(20px) saturate(180%) !important;
  border: 1px solid var(--glass-border, rgba(255, 255, 255, 0.2)) !important;
  display: flex;
  justify-content: center;
  backface-visibility: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.top-back, .top-front {
  top: 0;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  border-bottom: 0.5px solid rgba(0, 0, 0, 0.15);
  align-items: flex-end;
}
.top-back span, .top-front span {
  transform: translateY(50%);
}

.bottom-back, .bottom-front {
  bottom: 0;
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
  border-top: 0.5px solid rgba(255, 255, 255, 0.1);
  align-items: flex-start;
}
.bottom-back span, .bottom-front span {
  transform: translateY(-50%);
}

/* 3D rotations for split flaps */
.top-front {
  transform-origin: bottom center;
  z-index: 3;
}

.bottom-front {
  transform-origin: top center;
  transform: rotateX(90deg);
  z-index: 2;
}

.is-flipping .top-front {
  animation: flipTop 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

.is-flipping .bottom-front {
  animation: flipBottom 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

@keyframes flipTop {
  0% { transform: rotateX(0deg); }
  100% { transform: rotateX(-90deg); }
}

@keyframes flipBottom {
  0% { transform: rotateX(90deg); }
  100% { transform: rotateX(0deg); }
}

/* Responsive adjustments */
@media (max-width: 600px) {
  .flip-card {
    width: 32px;
    height: 48px;
    font-size: 30px;
  }
}
</style>
