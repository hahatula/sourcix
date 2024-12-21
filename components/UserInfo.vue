<template>
    <div class="user-info">
        <div class="user-info-details">
            <p class="name">{{ userName }}</p>
            <p class="email">{{ userEmail }}</p>
        </div>
        <div class="user-info-avatar">
            <img :src="avatarUrl || '/avatar-placeholder.svg'" :alt="userName" @error="onError" />
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

const userName = "Olga Golubev";
const userEmail = "your.email@example.com";

const onError = (event) => {
    event.target.src = '/avatar-placeholder.svg';
};
</script>