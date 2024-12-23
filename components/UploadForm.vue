<template>
    <form @submit.prevent="saveImage" class="popup-form">
        <div class="form-field">
            <label>File:</label>
            <p>{{ file?.name || "No file selected" }}</p>
        </div>
        <div class="form-field">
            <label for="label">Label:</label>
            <input ref="labelInput" v-model="label" id="label" type="text" placeholder="Enter label" />
        </div>
        <div class="form-field checkbox">
            <label>
                <input type="checkbox" v-model="isAnonymous" />
                Upload anonymously
            </label>
        </div>
        <div class="popup-actions">
            <Button text="Save" buttonClass="accent-btn" @click="saveImage" />
            <Button text="Cancel" @click="closeForm" />
        </div>
    </form>
</template>

<script setup>
import { ref, inject, watch } from "vue";

const userContext = inject("userContext");
if (!userContext) {
    console.error("userContext is undefined. Make sure it is provided at a higher level.");
}

const props = defineProps({
    file: {
        type: Object,
        required: true,
    },
});

// Emits - methods for passing events up
const emit = defineEmits(["close", "save"]);

const label = ref("");
const isAnonymous = ref(false);
const labelInput = ref(null);

// Watch the file prop and set the label to the file name when the file changes
watch(
    () => props.file,
    (newFile) => {
        if (newFile) {
            label.value = newFile.name.split(".")[0]; // Set label to file name without extension
        }
    },
    { immediate: true }
);

// Focus on the input to make it easy to edit
onMounted(() => {
    if (labelInput.value) {
        labelInput.value.focus();
    }
});

const saveImage = () => {
    const source = isAnonymous.value ? "Anonymous" : userContext.name;

    emit("save", {
        file: props.file,
        label: label.value,
        source,
    });
};

const closeForm = () => {
    emit("close");
};
</script>