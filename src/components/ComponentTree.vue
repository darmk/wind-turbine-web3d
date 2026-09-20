<script setup lang="ts">
import {ref} from 'vue';import {Search,GitBranch,MousePointer2} from '@lucide/vue';
import TreeNode from './TreeNode.vue';import {components} from '../data/components';
defineProps<{selected:string;hidden:string[]}>();
const emit=defineEmits<{select:[id:string];focus:[id:string];toggle:[id:string]}>();const query=ref('');
</script>
<template><aside class="component-panel panel">
 <div class="panel-heading"><span><GitBranch :size="15"/>部件结构</span><small>ASSEMBLY</small></div>
 <label class="search-field"><Search :size="14"/><input v-model="query" placeholder="搜索部件名称…" aria-label="搜索部件"/><kbd>/</kbd></label>
 <div class="tree-scroll"><TreeNode :node="components[0]" :selected="selected" :hidden="hidden" :depth="0" :query="query" @select="emit('select',$event)" @focus="emit('focus',$event)" @toggle="emit('toggle',$event)"/></div>
 <div class="tree-footer"><MousePointer2 :size="13"/><span>单击选择 · 双击聚焦</span><small>{{components.length}} 部件</small></div>
</aside></template>
