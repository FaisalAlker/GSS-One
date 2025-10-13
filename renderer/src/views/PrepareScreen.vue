<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
const router = useRouter();
function redir() {
  router.replace('/');
}
const gss_url = ref('');
const status = ref('');
const strictUrl = 'https://docs.google.com/spreadsheets';
async function save() {
  if (gss_url.value == '') return;
  if (gss_url.value.startsWith(strictUrl)) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const saving = await (window as any).prefs.set('gss_url', gss_url.value);
      if (saving) {
        status.value = `Success`;
        redir();
      } else {
        status.value = `Failed`;
      }
    } catch (e) {
      status.value = `Err: ${e}`;
    }
  } else {
    status.value = `Wrong URL! Url must be start with ${strictUrl}`;
  }
}

</script>

<template>
  <div class="full-screen vh-center bg-dark">
    <div class="prepare-container">
      <div>Spreadsheet URL</div>
      <form v-on:submit.prevent="save">
        <input class="input-url" type="text" v-model="gss_url" :placeholder="strictUrl">
        <button class="btn-save" type="submit">Save</button>
      </form>
      <div class="res-status" v-if="status != ''">{{ status }}</div>
    </div>
  </div>
</template>
