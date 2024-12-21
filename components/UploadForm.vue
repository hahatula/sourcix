<template>
    <form @submit.prevent="saveImage" class="popup-form">
        <div class="form-field">
            <label>File:</label>
            <p>{{ file?.name || "No file selected" }}</p>
        </div>
        <div class="form-field">
            <label for="label">Label:</label>
            <input v-model="label" id="label" type="text" placeholder="Enter label" />
        </div>
        <div class="form-field">
            <label for="source">Source:</label>
            <input v-model="source" id="source" type="text" placeholder="Enter source" />
        </div>
        <div class="popup-actions">
            <Button text="Save" buttonClass="accent-btn" @click="saveImage" />
            <Button text="Cancel" @click="closeForm" />
        </div>
    </form>
</template>

<script setup>
import { ref } from "vue";

const props = defineProps({
    file: {
        type: Object,
        required: true,
    },
});

// Emits for passing events up
const emit = defineEmits(["close", "save"]);

// Local data
const label = ref("");
const source = ref("");

const saveImage = () => {
    emit("save", {
        file: props.file,
        label: label.value,
        source: source.value,
    });
};

const closeForm = () => {
    emit("close");
};
</script>