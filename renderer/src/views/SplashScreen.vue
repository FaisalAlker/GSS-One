<template>
  <div class="splash">
    <div class="loader"></div>
    <p style="white-space: pre-line;text-align: center;">{{ status }}</p>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router'

const router = useRouter();
const status = ref('Loading preferences...');

onMounted(async () => {
  status.value = 'Checking User Data ...';

  // Call your Electron API
  const token = ref(null);
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    token.value = await (window as any).prefs.get('gss_url');

    if (token.value) router.replace('/home');
    else router.replace('/prepare');
  } catch (e) {
    status.value = `Oops, Some Problem Found!\n\n ${e}`;
  }

});
</script>

<style scoped>
.splash {
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: #121212;
  color: white;
  font-family: sans-serif;
}

.loader {
  width: 50px;
  height: 50px;
  border: 5px solid #444;
  border-top: 5px solid #1db954;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
