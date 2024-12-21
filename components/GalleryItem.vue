<template>
    <div class="gallery-item">
        <img :src="image.url" :alt="image.label" class="image" />
        <div class="image-info">
            <p class="image-label">{{ image.label }}</p>
            <p class="image-source">Source: <span>{{ image.source }}</span></p>
        </div>
    </div>
</template>

<script setup>
defineProps(['image']);

import "~/assets/css/gallery-item.css";

</script>