<script setup lang="ts">
import {Box,Layers,ScanLine,Slice} from '@lucide/vue';import type {ViewMode} from '../data/turbine';
defineProps<{mode:ViewMode}>();const emit=defineEmits<{change:[value:ViewMode]}>();
const modes=[{id:'normal' as const,name:'实体',icon:Box},{id:'transparent' as const,name:'透视',icon:Layers},{id:'xray' as const,name:'X-Ray',icon:ScanLine},{id:'section' as const,name:'剖切',icon:Slice}];
</script>
<template><div class="view-mode-control"><span class="control-label">显示模式</span><div class="segmented"><button v-for="item in modes" :key="item.id" :class="{active:mode===item.id}" :aria-pressed="mode===item.id" :data-mode="item.id" @click="emit('change',item.id)"><component :is="item.icon" :size="15"/><span>{{item.name}}</span></button></div></div></template>
