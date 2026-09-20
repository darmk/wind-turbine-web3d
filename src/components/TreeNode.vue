<script setup lang="ts">
import {computed,ref} from 'vue';
import {ChevronDown,ChevronRight,Eye,EyeOff,Box,Layers} from '@lucide/vue';
import {components,type ComponentDefinition} from '../data/components';
const props=defineProps<{node:ComponentDefinition;selected:string;hidden:string[];depth:number;query:string}>();
const emit=defineEmits<{select:[id:string];focus:[id:string];toggle:[id:string]}>();
const open=ref(props.depth<2);const children=computed(()=>components.filter(c=>c.parent===props.node.id));
const matches=(id:string):boolean=>components.some(c=>c.id===id&&(`${c.name} ${c.english} ${c.specification}`.toLowerCase().includes(props.query.toLowerCase())||components.filter(ch=>ch.parent===id).some(ch=>matches(ch.id))));
</script>
<template><div v-if="!query||matches(node.id)" class="tree-node">
 <div class="tree-row" :class="{selected:selected===node.id,hidden:hidden.includes(node.id)}" :style="{'--depth':depth}">
  <button v-if="children.length" class="tree-disclosure" :aria-label="`${open?'收起':'展开'}${node.name}`" :aria-expanded="open" @click="open=!open"><ChevronDown v-if="open||query" :size="13"/><ChevronRight v-else :size="13"/></button><span v-else class="tree-spacer"/>
  <button class="tree-label" :data-component="node.id" @click="emit('select',node.id)" @dblclick="emit('focus',node.id)"><Layers v-if="children.length" :size="14"/><Box v-else :size="13"/><span>{{node.name}}</span><small v-if="children.length">{{children.length}}</small></button>
  <button class="tree-eye" :aria-label="`${hidden.includes(node.id)?'显示':'隐藏'}${node.name}`" @click="emit('toggle',node.id)"><EyeOff v-if="hidden.includes(node.id)" :size="13"/><Eye v-else :size="13"/></button>
 </div>
 <div v-if="open||query"><TreeNode v-for="child in children" :key="child.id" :node="child" :selected="selected" :hidden="hidden" :depth="depth+1" :query="query" @select="emit('select',$event)" @focus="emit('focus',$event)" @toggle="emit('toggle',$event)"/></div>
</div></template>
