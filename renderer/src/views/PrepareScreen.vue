<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
const router = useRouter();
const gss_url = ref('');
const status = ref('');
const strictUrl = 'https://';

async function save() {
  if (gss_url.value == '') return;
  if (gss_url.value.startsWith(strictUrl)) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const saving = await (window as any).prefs.set('gss_url', gss_url.value);
      if (saving) {
        status.value = `Success`;
        router.replace('/');
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
      <label for="input-url">Insert URL</label>
      <form v-on:submit.prevent="save">
        <input id="input-url" class="input-url" type="text" v-model="gss_url"
          :placeholder="'URL must be use ' + strictUrl">
        <button class="btn-save" type="submit">Save</button>
      </form>
      <div class="res-status" v-if="status != ''">{{ status }}</div>
    </div>
  </div>
</template>
