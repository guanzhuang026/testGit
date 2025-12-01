<!-- App.vue（剧本） -->
<template>
  <h1>你好！Vue3</h1>
  <p>{{ currentTime }}</p>
</template>
<script>
import { ref, onMounted } from 'vue';
export default {
  setup() {
    const currentTime = ref(new Date().toLocaleString());
    onMounted(() => {
      setInterval(() => currentTime.value = new Date().toLocaleString(), 1000);
    });
    return { currentTime };
  }
};
</script>