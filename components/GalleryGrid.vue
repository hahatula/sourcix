<template>
    <div class="gallery-content">
        <div class="gallery-filters">
            <div class="gallery-filter">
                <label for="source-filter">Filter by source:</label>
                <select v-model="localSource" @change="emitApplyFilters">
                    <option value="">All</option>
                    <option v-for="source in sources" :value="source">{{ source }}</option>
                </select>
            </div>
            <div class="gallery-filter">
                <label for="source-filter">Search by label:</label>
                <input ref="searchInput" type="text" v-model="localLabel" placeholder="Search by label"
                    @keyup.enter="emitApplyFilters" />
                <Button text="Search" @click="emitApplyFilters" :disabled="localLabel === ''" />
            </div>
        </div>
        <p v-if="images.length === 0" class="gallery-grid no-images">No images found</p>
        <div v-else class="gallery-grid">
            <GalleryItem v-for="(image, index) in images" :key="index" :image="image" />
        </div>
        <div v-if="totalPages > 1" class="gallery-pagination">
            <Button text="<" @click="$emit('changePage', page - 1)" :disabled="page === 1" />
            <span>Page {{ page }} of {{ totalPages }}</span>
            <Button text=">" @click="$emit('changePage', page + 1)" :disabled="page === totalPages" />
        </div>
    </div>
</template>

<script setup>
import { ref } from "vue";
import "~/assets/css/gallery-grid.css";

const props = defineProps({
    images: { type: Array, required: true },
    sources: { type: Array, required: true },
    selectedSource: { type: String, required: true },
    selectedLabel: { type: String, required: true },
    page: { type: Number, required: true },
    totalPages: { type: Number, required: true },
});

const emit = defineEmits(["applyFilters", "changePage"]);

const localSource = ref(props.selectedSource);
const localLabel = ref(props.selectedLabel);
const searchInput = ref(null);

watch(localLabel, (newVal) => {
    if (newVal === "") {
        emitApplyFilters(); // Fetch all images if label input is empty
    }
});

onMounted(() => {
    // Focus on search input if label is not empty
    if (localLabel.value !== "") {
        searchInput.value.focus();
    }
});

const emitApplyFilters = () => {
    emit("applyFilters", { source: localSource.value, label: localLabel.value });
};

</script>