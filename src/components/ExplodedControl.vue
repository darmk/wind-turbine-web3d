<script setup lang="ts">
import {Pause,Play,RotateCcw} from '@lucide/vue';
defineProps<{level:number;paused:boolean}>();const emit=defineEmits<{change:[n:number];pause:[];reset:[]}>();
</script>
<template><div class="exploded-control"><span class="control-label">拆解层级 <small>{{level===0?'ASSEMBLED':`LEVEL 0${level}`}}</small></span><div class="explosion-row"><div class="explosion-levels"><button v-for="(label,i) in ['整机','一级','二级','完全拆解']" :key="i" :class="{active:level===i}" :aria-pressed="level===i" :data-level="i" @click="emit('change',i)">{{label}}</button></div><button class="icon-button" :aria-label="paused?'继续拆解动画':'暂停拆解动画'" @click="emit('pause')"><Play v-if="paused" :size="14"/><Pause v-else :size="14"/></button><button class="icon-button" aria-label="重置拆解" @click="emit('reset')"><RotateCcw :size="14"/></button></div></div></template>
