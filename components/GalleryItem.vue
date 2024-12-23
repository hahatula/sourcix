<template>
    <div class="gallery-item" @click="togglePopup">
        <img :src="image.url" :alt="image.label" class="image" />
        <div class="image-info">
            <p class="image-label">{{ image.label }}</p>
            <p class="image-source">Source: <span>{{ image.source }}</span></p>
        </div>
    </div>

    <Teleport to="body">
        <Popup v-if="popupVisible" :title="image.label" :subtitle="image.source" @close="closePopup">
            <div class="popup-image-container">
                <img :src="image.url" :alt="image.label"/>
            </div>
        </Popup>
    </Teleport>
</template>

<script setup>  
import { ref } from "vue";

defineProps(['image']);

import "~/assets/css/gallery-item.css";

const popupVisible = ref(false);

const togglePopup = () => {
    popupVisible.value = !popupVisible.value;
};

const closePopup = () => {
    popupVisible.value = false;
};

</script>