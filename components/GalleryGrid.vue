<template>
    <div class="gallery-content">
        <div class="gallery-filters">
            <div class="gallery-filter">
                <label for="source-filter">Filter by source:</label>
                <select v-model="selectedSource">
                    <option value="">All</option>
                    <option v-for="source in sources" :value="source">{{ source }}</option>
                </select>
            </div>
            <div class="gallery-filter">
                <input type="text" v-model="selectedLabel" />
                <Button text="Search" />
            </div>
        </div>
        <div class="gallery-grid">
            <GalleryItem v-for="(image, index) in filteredImages" :key="index" :image="image" />
        </div>
        <p>
            < Page 1 of 10>
        </p>
    </div>
</template>

<script setup>
import { ref, computed } from "vue";
import "~/assets/css/gallery-grid.css";
import { images } from '~/assets/tempdata/images.vue';

const selectedSource = ref("");
const selectedLabel = ref("");

const sources = computed(() => {
    return [...new Set(images.value.map(image => image.source))];
});

const filteredImages = computed(() => {
    return images.value.filter((image) => {
        const matchesSource =
            selectedSource.value === "" || image.source === selectedSource.value;
        const matchesLabel =
            selectedLabel.value === "" || image.label.toLowerCase().includes(selectedLabel.value.toLowerCase());
        return matchesSource && matchesLabel;
    });
});
</script>