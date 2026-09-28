<script setup lang="ts">
import { Check, MessageCircleMore, ScanLine } from '@lucide/vue';
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { followGateConfig } from '../data/followGate';

const emit = defineEmits<{ enter: [] }>();
const qrCodeUrl = `${import.meta.env.BASE_URL}${followGateConfig.qrCodePath}`;
const granted = ref(!followGateConfig.enabled || wasGranted());

function wasGranted() {
  try {
    return localStorage.getItem(followGateConfig.storageKey) === 'granted';
  } catch {
    return false;
  }
}

function enterExperience() {
  try {
    localStorage.setItem(followGateConfig.storageKey, 'granted');
  } catch {
    // Privacy modes may block storage; allow access for this session instead.
  }
  granted.value = true;
  emit('enter');
}

function syncAccess(event: StorageEvent) {
  if (event.key === followGateConfig.storageKey && event.newValue === 'granted') {
    granted.value = true;
    emit('enter');
  }
}

onMounted(() => {
  window.addEventListener('storage', syncAccess);
  if (granted.value) emit('enter');
});
onBeforeUnmount(() => window.removeEventListener('storage', syncAccess));
</script>

<template>
  <main v-if="!granted" class="follow-gate" aria-labelledby="follow-gate-title">
    <section class="follow-gate-card">
      <div class="follow-gate-seal" aria-hidden="true"><MessageCircleMore :size="28" :stroke-width="1.35" /></div>
      <p class="follow-gate-eyebrow">{{ followGateConfig.eyebrow }}</p>
      <h1 id="follow-gate-title">{{ followGateConfig.title }}</h1>
      <p class="follow-gate-copy">{{ followGateConfig.description }}</p>

      <div class="follow-gate-qr-wrap">
        <img class="follow-gate-qr" :src="qrCodeUrl" :alt="`“${followGateConfig.accountName}”公众号二维码`" width="860" height="860" />
      </div>
      <p class="follow-gate-scan"><ScanLine :size="17" :stroke-width="1.45" /> 请使用微信扫一扫</p>

      <button class="follow-gate-enter" type="button" @click="enterExperience">
        <span>{{ followGateConfig.confirmLabel }}</span><Check :size="20" :stroke-width="1.8" />
      </button>
      <p class="follow-gate-helper">{{ followGateConfig.helperText }}</p>
    </section>
  </main>
</template>

<style scoped>
.follow-gate{min-height:100svh;display:grid;place-items:center;padding:30px 20px;background:radial-gradient(circle at 50% -12%,#123c60 0,#061a34 46%,#020b1c 100%);color:#e4f2ff;overflow:hidden;position:relative;isolation:isolate}
.follow-gate::before,.follow-gate::after{content:"";position:absolute;z-index:-1;border:1px solid #75bfff24;border-radius:50%;pointer-events:none}.follow-gate::before{width:min(88vw,860px);aspect-ratio:1;top:50%;left:50%;transform:translate(-50%,-54%)}.follow-gate::after{width:min(67vw,650px);aspect-ratio:1;top:50%;left:50%;transform:translate(-50%,-54%);border-color:#75bfff16}
.follow-gate-card{width:min(100%,430px);padding:34px 42px 30px;text-align:center;background:#071b35df;border:1px solid #32668f;border-radius:12px;box-shadow:0 22px 60px #000b;backdrop-filter:blur(12px)}
.follow-gate-seal{width:52px;height:52px;margin:0 auto 17px;display:grid;place-items:center;border-radius:50%;background:#2b82bf;color:#eff9ff;box-shadow:0 5px 16px #268cd066}.follow-gate-eyebrow{margin:0 0 10px;color:#8dcaff;font:12px/1.4 var(--mono,monospace);letter-spacing:.14em}.follow-gate h1{margin:0;font:500 clamp(29px,7vw,37px)/1.3 "Microsoft YaHei",sans-serif;letter-spacing:.055em}.follow-gate-copy{white-space:pre-line;margin:14px auto 21px;max-width:310px;color:#a8c8e3;font-size:14px;line-height:1.8}
.follow-gate-qr-wrap{width:190px;height:190px;margin:0 auto 12px;padding:8px;background:#fff;border:1px solid #a7cbe2;border-radius:5px;box-shadow:0 6px 20px #0008}.follow-gate-qr{display:block;width:100%;height:100%;object-fit:contain}.follow-gate-scan{display:flex;align-items:center;justify-content:center;gap:7px;margin:0 0 22px;color:#a8c8e3;font-size:13px}.follow-gate-scan svg{color:#7ec7ff}
.follow-gate-enter{width:100%;min-height:52px;padding:0 19px;display:flex;align-items:center;justify-content:space-between;border:1px solid #65b6ed;background:#17679d;color:#eff9ff;border-radius:4px;font-size:18px;box-shadow:inset 0 0 0 1px #0e4e7b;cursor:pointer;transition:background .18s,transform .18s}.follow-gate-enter:hover{background:#2383c1}.follow-gate-enter:active{transform:translateY(1px)}.follow-gate-enter:focus-visible{outline:2px solid #b9e4ff;outline-offset:4px}.follow-gate-helper{margin:14px auto 0;max-width:315px;color:#7596b5;font-size:11px;line-height:1.65}
@media(max-width:440px){.follow-gate{padding:20px 16px}.follow-gate-card{padding:27px 25px 24px}.follow-gate-qr-wrap{width:174px;height:174px}.follow-gate h1{font-size:29px}.follow-gate-copy{font-size:13px}.follow-gate-enter{font-size:17px}}
@media(prefers-reduced-motion:reduce){.follow-gate-enter{transition:none}}
</style>
