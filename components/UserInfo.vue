<template>
    <div class="user-info">
        <div class="user-info-details">
            <!-- You can change name here for testing -->
            <p v-if="!isEditing" class="name" @click="startEditing" title="Click to edit for testing">{{ userContext.name }}</p>
            <input
                v-else
                v-model="userContext.name"
                @blur="stopEditing"
                @keyup.enter="stopEditing"
                class="name-input"
                placeholder="Enter new name"
            />
            <p class="email">{{ userContext.email }}</p>
        </div>
        <div class="user-info-avatar">
            <img :src="avatarUrl || '/avatar-placeholder.svg'" :alt="userContext.name" @error="onError" />
        </div>
    </div>
</template>

<script setup>
import "~/assets/css/user-info.css";

const props = defineProps({
    avatarUrl: {
        type: String,
        default: null,
    },
});

const userContext = inject("userContext");
const isEditing = ref(false);

const startEditing = () => {
    isEditing.value = true;
};

const stopEditing = () => {
    isEditing.value = false;
};

const onError = (event) => {
    event.target.src = '/avatar-placeholder.svg';
};
</script>