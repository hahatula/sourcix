<template>
    <div class="popup-overlay" @click.self="emit('close')">
        <div class="popup">
            <h2>{{ title }}</h2>
            <p v-if="subtitle">{{ subtitle }}</p>
            <slot></slot>
        </div>
    </div>
</template>

<script setup>
import "~/assets/css/popup.css";
const props = defineProps({
    title: {
        type: String,
        required: true,
    },
    subtitle: {
        type: String,
        required: false,
    },
});

const emit = defineEmits(["close"]);
</script>