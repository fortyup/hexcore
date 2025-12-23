<script setup>
import { computed } from 'vue';

const props = defineProps({
  stats: { type: Object, required: true },
  size: { type: Number, default: 340 },
  max: { type: Number, default: 10 },
  levels: { type: Number, default: 5 },
  labels: { type: Array, default: () => ['Attack', 'Defense', 'Magic', 'Difficulty'] },
  color: { type: String, default: '#3b82f6' },
  visible: { type: Boolean, default: true }
});

const padding = 48;
const center = computed(() => ({ x: props.size / 2, y: props.size / 2 }));
const radius = computed(() => props.size / 2 - padding);
const gradientId = computed(() => `radarFill-${Math.random().toString(36).slice(2, 8)}`);

const values = computed(() => {
  const { attack = 0, defense = 0, magic = 0, difficulty = 0 } = props.stats || {};
  return [attack, defense, magic, difficulty].map(v => Math.max(0, Math.min(props.max, Number(v))));
});

const angleFor = (idx) => -Math.PI / 2 + idx * (2 * Math.PI / values.value.length);
const pointFor = (idx, valRatio) => {
  const ang = angleFor(idx);
  const r = radius.value * valRatio;
  return {
    x: center.value.x + Math.cos(ang) * r,
    y: center.value.y + Math.sin(ang) * r
  };
};

const gridPolygons = computed(() => {
  const arr = [];
  for (let l = 1; l <= props.levels; l++) {
    const ratio = l / props.levels;
    const pts = values.value.map((_, i) => pointFor(i, ratio));
    arr.push(pts);
  }
  return arr;
});

const axes = computed(() => values.value.map((_, i) => [center.value, pointFor(i, 1)]));
const dataPoints = computed(() => values.value.map((v, i) => pointFor(i, (v / props.max))));
const dataPath = computed(() => dataPoints.value.map(p => `${p.x},${p.y}`).join(' '));
const labelPoints = computed(() => values.value.map((_, i) => {
  const pt = pointFor(i, 1.05);
  if (i === 0) pt.y -= 12; // lift Attack label slightly
  return pt;
}));
const levelLabels = computed(() => {
  const items = [];
  for (let l = 1; l <= props.levels; l++) {
    const ratio = l / props.levels;
    const value = Math.round((props.max / props.levels) * l);
    const pos = pointFor(0, ratio);
    items.push({ value, x: pos.x, y: pos.y - 4 });
  }
  return items;
});
</script>

<template>
  <div class="radar-wrap">
    <svg :width="size" :height="size" :viewBox="`0 0 ${size} ${size}`" class="radar">
      <defs>
        <linearGradient :id="gradientId" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" :stop-color="color" stop-opacity="0.4" />
          <stop offset="100%" :stop-color="color" stop-opacity="0.15" />
        </linearGradient>
      </defs>

      <g class="grid">
        <polygon
          v-for="(ring, idx) in gridPolygons"
          :key="idx"
          :points="ring.map(p => `${p.x},${p.y}`).join(' ')"
          class="grid-ring"
        />
        <line
          v-for="(axis, i) in axes"
          :key="'axis-' + i"
          :x1="axis[0].x" :y1="axis[0].y"
          :x2="axis[1].x" :y2="axis[1].y"
          class="axis"
        />
      </g>

      <g class="levels">
        <text
          v-for="(lvl, i) in levelLabels"
          :key="'lvl-' + i"
          :x="lvl.x"
          :y="lvl.y"
          class="level-label"
          text-anchor="middle"
          dominant-baseline="baseline"
        >
          {{ lvl.value }}
        </text>
      </g>

      <g class="labels">
        <text
          v-for="(lp, i) in labelPoints"
          :key="'label-' + i"
          :x="lp.x"
          :y="lp.y"
          class="label"
          :text-anchor="lp.x < center.x - 10 ? 'end' : (lp.x > center.x + 10 ? 'start' : 'middle')"
          :dominant-baseline="lp.y < center.y ? 'auto' : 'hanging'"
        >
          {{ labels[i] }}
        </text>
      </g>

      <g class="data" :class="{ visible }">
        <polygon
          class="data-shape"
          :points="dataPath"
          :fill="`url(#${gradientId})`"
          :stroke="color"
        />
        <circle
          v-for="(p, i) in dataPoints"
          :key="'p-' + i"
          :cx="p.x" :cy="p.y"
          r="3.5"
          :fill="color"
        />
      </g>
    </svg>
  </div>
  
</template>

<style scoped>
.radar-wrap {
  display: flex;
  justify-content: center;
  align-items: center;
}
.radar {
  max-width: 100%;
  height: auto;
  overflow: visible;
}
.grid-ring {
  fill: none;
  stroke: rgba(255, 255, 255, 0.12);
  stroke-width: 1;
}
.axis {
  stroke: rgba(255, 255, 255, 0.15);
  stroke-width: 1;
}
.levels {
  pointer-events: none;
}
.level-label {
  font-family: var(--font-heading, inherit);
  font-size: 10px;
  fill: rgba(255, 255, 255, 0.5);
}
.label {
  font-family: var(--font-heading, inherit);
  font-size: 12px;
  fill: var(--color-text-secondary, #cbd5e1);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}
.data-shape {
  stroke-width: 2;
  filter: drop-shadow(0 0 8px rgba(59, 130, 246, 0.35));
  transition: all 0.6s ease;
}
.data {
  opacity: 0;
  transform: scale(0.8);
  transform-origin: center;
  transition: opacity 0.6s ease, transform 0.6s cubic-bezier(0.22, 1, 0.36, 1);
}
.data.visible {
  opacity: 1;
  transform: scale(1);
}
</style>
