<template>
  <header class="header content-container">
    <a class="logo-link" href="https://sourcixai.com/" target="_blank">
      <img class="logo" src="/assets/images/sx-logo.svg" alt="Logo" />
    </a>
    <UserInfo />
  </header>
</template>

<script setup>
import "~/assets/css/header.css";
import UserInfo from "./UserInfo.vue";
</script>