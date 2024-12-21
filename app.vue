<template>
  <div class="app">
    <Header />
    <Gallery />
    <Footer />
  </div>
</template>

<script setup>
import { provide } from "vue";
import { userContext } from "~/contexts/UserContext";

provide("userContext", userContext);
</script>