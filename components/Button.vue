<template>
    <button
      :class="'generic-button ' + buttonClass"
      @click="handleClick"
    >
      {{ text }}
    </button>
  </template>
  
  <script setup>
  import { defineProps } from 'vue';
  import "~/assets/css/button.css";
  
  const props = defineProps({
    text: {
      type: String,
      required: true,
    },
    buttonClass: {
      type: String,
      default: '',
    },
    onClick: {
      type: Function,
      required: true,
    },
  });
  
  const handleClick = (event) => {
    props.onClick(event);
  };
  </script>