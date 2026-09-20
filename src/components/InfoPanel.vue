<script setup lang="ts">
import {computed} from 'vue';import {ArrowUpRight,Focus,Scan,Info,Zap,MoveHorizontal,MoveVertical,Wind} from '@lucide/vue';
import {componentMap} from '../data/components';import {turbine,displayModelName} from '../data/turbine';
const props=defineProps<{selected:string;isolated:boolean;ready:boolean}>();
const emit=defineEmits<{focus:[];isolate:[];internals:[]}>();
const current=computed(()=>componentMap.get(props.selected)!);
</script>
<template><aside class="info-panel">
 <section class="model-card panel"><Wind :size="42" :stroke-width="1.2"/><div><span class="info-kicker">WIND ENERGY / DIGITAL TWIN</span><h1>{{displayModelName}}</h1><p>陆上风力发电机 · 数字样机</p></div></section>
 <section class="metrics-card panel" aria-label="整机参数"><dl>
  <div><dt><Zap :size="19"/>额定功率</dt><dd>{{turbine.rated_power_mw}} <small>MW</small></dd></div>
  <div><dt><MoveHorizontal :size="19"/>转子直径</dt><dd>{{turbine.rotor_diameter_m}} <small>m</small></dd></div>
  <div><dt><MoveVertical :size="19"/>轮毂高度</dt><dd>{{turbine.hub_height_m}} <small>m</small></dd></div>
 </dl></section>
 <slot name="structure"/>
 <section class="detail-card panel">
  <div class="panel-heading"><span><Info :size="15"/>{{selected==='turbine'?'模型说明':'部件说明'}}</span><small>DETAILS</small></div>
  <div class="info-scroll"><h2>{{selected==='turbine'?'结构数字化展示':current.name}}</h2>
   <p v-if="selected!=='turbine'" class="info-subtitle">{{current.specification}}</p>
   <div v-if="selected==='gearbox'" class="gear-stages"><span>P1</span><i/><span>P2</span><i/><span>H</span></div>
   <p class="component-description">{{current.description}}</p>
   <div v-if="selected!=='turbine'" class="inspector-actions"><button :disabled="!ready" @click="emit('focus')"><Focus :size="14"/>聚焦部件</button><button :disabled="!ready" :class="{active:isolated}" @click="emit('isolate')"><Scan :size="14"/>{{isolated?'退出单独查看':'单独查看'}}</button></div>
   <button v-else class="inspect-cta" :disabled="!ready" @click="emit('internals')"><span>探索机舱内部</span><ArrowUpRight :size="17"/></button>
   <small class="engineering-note">结构展示用途 · 几何尺寸含工程近似</small>
  </div>
 </section>
</aside></template>
