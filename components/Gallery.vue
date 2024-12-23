<template>
    <main class="gallery content-container">
        <h1>
            <span class="highlighted">
                <span class="highlight" id="upload-highlight">
                    <img src="~/assets/images/marker-1b.svg" alt="Highlight Marker" class="highlight-svg" />
                </span>
                <span class="accent">Upload your own</span>
            </span> images to&nbsp;the&nbsp;SOURCIX Gallery
        </h1>
        <Button text="Upload" buttonClass="accent-btn" @click="triggerFileInput" />
        <!-- Hidden file input for to make the button open the file chooser immediately -->
        <input type="file" ref="fileInput" style="display: none" @change="handleFileSelected" accept="image/*" />
        <div v-if="isLoading" class="gallery-content spinner">
            Loading images...
        </div>
        <GalleryGrid v-else :images="images" :sources="sources" :selectedSource="selectedSource"
            :selectedLabel="selectedLabel" :page="page" :totalPages="totalPages" @applyFilters="applyFilters"
            @changePage="changePage" />
        <div v-if="isUploading" class="file-loader spinner">Uploading...</div>

        <Teleport to="body">
            <Popup v-if="popupVisible" title="Upload Image" @close="closePopup">
                <UploadForm :file="selectedFile" @save="handleSaveImage" @close="closePopup" />
            </Popup>
        </Teleport>
    </main>
</template>

<script setup>
import "~/assets/css/gallery.css";
import { ref } from "vue";
import { fetchImages, uploadImage } from "~/composables/useGallery";

const fileInput = ref(null);
const popupVisible = ref(false);
const selectedFile = ref(null);
const images = ref([]);
const sources = ref([]);
const isLoading = ref(false);
const isUploading = ref(false);

const page = ref(1);
const limit = ref(20);
const total = ref(0);
const selectedSource = ref("");
const selectedLabel = ref("");

const totalPages = computed(() => Math.ceil(total.value / limit.value));

// Logic for showing images
const getImages = async () => {
    isLoading.value = true;
    try {
        const data = await fetchImages(page.value, limit.value, selectedSource.value, selectedLabel.value);
        images.value = data.images;
        total.value = data.total;
        sources.value = data.allSources;
    } catch (error) {
        console.error("Error fetching images:", error);
    }
    finally {
        isLoading.value = false;
    }
};

const applyFilters = ({ source = "", label = "" }) => {
    selectedSource.value = source;
    selectedLabel.value = label;
    page.value = 1;
    getImages();
};

const changePage = (newPage) => {
    page.value = newPage;
    getImages();
};

onMounted(() => {
    getImages(); // Fetch images when the component is mounted
});

// Logic for uploading images
const triggerFileInput = () => {
    // immitate user click on the input
    fileInput.value.click();
};

const handleFileSelected = (event) => {
    const file = event.target.files[0];
    if (file) {
        selectedFile.value = file;
        popupVisible.value = true;
    }
};

const handleSaveImage = async ({ file, label, source }) => {
    closePopup();
    isUploading.value = true;

    try {
        const result = await uploadImage(file, label, source);
        console.log("Upload result:", result);
        applyFilters({ source: selectedSource.value, label: selectedLabel.value });
    } catch (error) {
        console.error("Error uploading image:", error);
    } finally {
        isUploading.value = false;
    }
};

const closePopup = () => {
    popupVisible.value = false;
    selectedFile.value = null;
    fileInput.value.value = ""; // reset the input to ensure form opening after canceling
};
</script>
