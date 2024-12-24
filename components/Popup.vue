<template>
    <div class="popup-overlay" @click.self="emit('close')">
        <div class="popup">
            <h2>{{ title }}</h2>
            <p v-if="subtitle">{{ subtitle }}</p>
            <slot></slot>
            <button @click="emit('close')" class="popup-close" />
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
        default: "",
    },
});

const emit = defineEmits(["close"]);

// Add event listener for keydown
const handleKeydown = (event) => {
    if (event.key === 'Escape') {
        emit('close');
    }
};

// Attach event listener on mount
onMounted(() => {
    window.addEventListener('keydown', handleKeydown);
});

// Clean up event listener on unmount
onBeforeUnmount(() => {
    window.removeEventListener('keydown', handleKeydown);
});
</script>