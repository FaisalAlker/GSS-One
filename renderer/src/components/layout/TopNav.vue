<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
import { ref, computed, onMounted, nextTick, onUnmounted } from 'vue'

const webViewSrc = ref('https://workspace.google.com/products/sheets/');
const router = useRouter()
const route = useRoute()
const isHome = computed(() => route.path === '/home');

function onSelect(event: Event) {
  const value = (event.target as HTMLSelectElement).value
  if (value === 'home') router.push({ name: 'home' })
  else if (value === 'settings') router.push({ name: 'settings' })

  else if (value === 'restart') (window as any).electronAPI?.restart()
}
const showWebview = ref(true);
const tx = ref(0);
const rx = ref(0);
const dataUsage = ref(0);
const webviews = ref<any>(null);


const currentTime = ref('');
const updateTime = () => {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, '0');
  const month = now.toLocaleString('en-US', { month: 'short' });
  const year = now.getFullYear();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');

  currentTime.value = `${day}-${month}-${year} ${hours}:${minutes}`;
};

function getElectronTraffic() {
  const view = webviews.value;
  if (!view) return;


  if (view) {
    view.addEventListener("did-attach", () => {
      const id = view.getWebContentsId();

      (window as any).network.traffic(id);
    });
  }

  (window as any).network.trafficUpdate(({ rxRate, txRate, totalUsage }: { rxRate: any; txRate: any, totalUsage: any }) => {
    rx.value = rxRate;
    tx.value = txRate;
    dataUsage.value = totalUsage;
  });
}

async function getUrl() {
  webViewSrc.value = await (window as any).prefs.get('gss_url');
}


onMounted(async () => {
  await nextTick();
  await getUrl();
  getElectronTraffic();
  updateTime();
  const timer = setInterval(updateTime, 1000);
  onUnmounted(() => clearInterval(timer));
});

</script>


<template>
  <div class="navbar">
    <div class="d-flex space-between">
      <div>Working Hour: {{ currentTime }}</div>
    </div>
    <div class="d-flex" style=" align-items: center; justify-content: flex-end; gap: 10px;">
      <div>[{{ dataUsage.toFixed(2) }}MB]</div>
      <div class="network-stats">
        Tx: {{ tx.toFixed(0) }} KB/s | Rx: {{ rx.toFixed(0) }} KB/s
      </div>
      <div>
        <select class="navbar-select" @change="onSelect">
          <option value="home">Home</option>
          <option value="settings">Settings</option>
          <option value="restart">Restart</option>
        </select>
      </div>

    </div>
  </div>
  <template v-if="showWebview">
    <div class="browser-container" :hidden="!isHome">
      <webview ref="webviews" :src="webViewSrc"></webview>
    </div>
  </template>

</template>
