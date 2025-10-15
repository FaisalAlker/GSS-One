<script setup lang="ts">
import { nextTick, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router'
const router = useRouter();

const gss_url = ref('');
const status = ref('');
const strictUrl = 'https:';
async function save() {
  if (gss_url.value == '') return;
  if (gss_url.value.startsWith(strictUrl)) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const saving = await (window as any).prefs.set('gss_url', gss_url.value);
      if (saving) {
        status.value = `Success`;
        router.replace({ name: 'index' });
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
async function getUrl() {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    gss_url.value = await (window as any).prefs.get('gss_url');
  } catch (e) {
    status.value = `Fail: ${e}`;
  }
}

async function resetApp() {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rest = (window as any).electronAPI?.reset()
    status.value = `Reset: ${rest}`;
  } catch (e) {
    status.value = `Err ${e}`;
  }
}

onMounted(async () => {
  await nextTick();
  await getUrl();
});
</script>

<template>
  <div class="browser-container bg-dark">
    <div class="fluid-container vh-center" style="min-height: 100%;">
      <div class=" form-gap">
        <form class="form-gap" v-on:submit.prevent="save">
          <label for="url_to_open">URL to Open</label>
          <div class="fit-input-button">
            <input id="url_to_open" class="base-input-url" type="text" v-model="gss_url" :placeholder="strictUrl">
            <button class="btn-save" type="submit">Save</button>
          </div>
        </form>
        <div style="font-size: small;">*Note: When new Save button pressed the App will
          <strong style="font-weight: bold;">"Restart"</strong>
        </div>
        <div class="res-status" v-if="status != ''">Status: {{ status }}</div>
        <hr>

        <div class="disclaimer">
          <div class="fit-input-button">
            <img src="/src/assets/icon.png" alt="" style="height: 128px;width: 128px;">
            <div style="width: 100%;margin-left: 20px;">
              <div>⚠️ Don't open other URL ⚠️</div>
              <hr style="margin-bottom: 12px;margin-top: 12px;">
              <div>This App don't allow:</div>
              <ol>
                <li>Open newtab</li>
                <li>Popups</li>
              </ol>
            </div>
          </div>

        </div>
        <hr>
        <div class="disclaimer">
          <div>Disclaimer:<div>
              <ol>
                <li>This application was created using native tools.</li>
                <li>The developer does <strong>not access or receive any user data.</strong>
                </li>
                <li>The developer does <strong> not earn any money from this application.</strong></li>
                <li>All user data belongs <strong> solely to the user.</strong></li>
                <li>Any incidents, crashes, or other issues occurring while using this app are the <strong>sole
                    responsibility
                    of the user. </strong></li>
                <li><strong>No data is collected;</strong> all information stays entirely within the app.</li>
                <li>Please be cautious when using email; it is recommended to use only <strong>one work email.</strong>
                </li>
                <li>Please be cautious this button will reset App like first Run <button @click="resetApp"
                    class="reset-btn">Reset</button>
                </li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.form-gap {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.fluid-container {
  font-size: 28px;
  padding: 20px;
  width: 100%;
}

.fit-input-button {
  display: flex;
  width: 100%;
}

.disclaimer {
  font-size: 18px;
  border: 2px solid teal;
  padding: 12px;
  border-radius: 12px;
}

.disclaimer li strong {
  font-weight: bold;
  color: teal;
}

.reset-btn {
  background-color: var(--vt-c-black-mute);
  border: 1px solid teal;
  color: teal;
  padding-left: 10px;
  padding-right: 10px;
  border-radius: 5px;
  text-transform: uppercase;
  font-weight: bold;
}
</style>
