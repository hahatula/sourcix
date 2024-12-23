<!-- Nuxt docs: If you only have a single layout in your application, we recommend using app.vue with <NuxtPage /> instead of Layouts. -->
<template>
  <div class="app">
    <Header />
    <NuxtPage />
    <Footer />
  </div>
</template>

<script setup>
import { provide } from "vue";
import { userContext } from "~/contexts/UserContext";

provide("userContext", userContext);
</script>