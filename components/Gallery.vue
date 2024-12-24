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
        <GalleryGrid :images="images" :sources="sources" :selectedSource="selectedSource" :selectedLabel="selectedLabel"
        :page="page" :totalPages="totalPages" :isLoading="isLoading" @applyFilters="applyFilters" />
        <div v-if="isUploading" class="file-loader spinner">Uploading...</div>
        <div v-if="isError" class="file-loader error">Error occurred while uploading image</div>
        <Button v-if="scrollPosition > 700" text="Scroll to top" @click="scrollToTop" buttonClass="scroll-to-top-btn" />

        <Teleport to="body">
            <Popup v-if="popupVisible" title="Upload Image" @close="closePopup">
                <UploadForm :file="selectedFile" @save="handleSaveImage" @close="closePopup" />
            </Popup>
        </Teleport>
    </main>
</template>

<script setup>
import "~/assets/css/gallery.css";
import { ref, onMounted, onUnmounted } from "vue";
import { fetchImages, uploadImage } from "~/composables/useGallery";

const fileInput = ref(null);
const popupVisible = ref(false);
const scrollPosition = ref(0);
const selectedFile = ref(null);
const images = ref([]);
const sources = ref([]);
const isLoading = ref(false);
const isUploading = ref(false);
const isError = ref(false);

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

const loadNextPage = async () => {
    if (page.value >= totalPages.value) return;

    isLoading.value = true;
    page.value += 1;

    try {
        const data = await fetchImages(page.value, limit.value, selectedSource.value, selectedLabel.value);
        images.value.push(...data.images); // Add new images to the existing ones
    } catch (error) {
        console.error("Error fetching next page:", error);
    } finally {
        isLoading.value = false;
    }
};

const applyFilters = ({ source = "", label = "" }) => {
    selectedSource.value = source;
    selectedLabel.value = label;
    page.value = 1;
    images.value = []; // Reset images
    getImages();
};

// const changePage = (newPage) => {
//     page.value = newPage;
//     getImages();
// };

const handleScroll = () => {
    const { scrollTop, clientHeight, scrollHeight } = document.documentElement;
    scrollPosition.value = scrollTop;
    if (scrollHeight - scrollTop <= clientHeight + 100 && !isLoading.value) {
        console.log("Loading next page");
        loadNextPage();
    }
};

const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
};

onMounted(() => {
    getImages(); // Fetch images when the component is mounted
    window.addEventListener("scroll", handleScroll); // listen to scroll event on window
});

onUnmounted(() => {
    window.removeEventListener("scroll", handleScroll); // remove scroll event listener
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
        isError.value = true;
        setTimeout(() => {
            isError.value = false;
        }, 3000);
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
