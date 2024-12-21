<template>
    <button
      :class="'generic-button ' + buttonClass"
      @click="handleClick"
      :type="type"
    >
      {{ text }}
    </button>
  </template>
  
  <script setup>
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
    },
    type: {
      type: String,
      default: 'button',
    },
  });
  
  const handleClick = (event) => {
    props.onClick(event);
  };
  </script>