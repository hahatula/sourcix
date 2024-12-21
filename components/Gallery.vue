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
        <input type="file" ref="fileInput" style="display: none" @change="handleFileSelected" accept="image/*" />
        <GalleryGrid />

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
const fileInput = ref(null);
const popupVisible = ref(false);
const selectedFile = ref(null);
const imageLabel = ref("");
const imageSource = ref("");


const triggerFileInput = () => {
    fileInput.value.click();
};

const handleFileSelected = (event) => {
    const file = event.target.files[0];
    if (file) {
        selectedFile.value = file;
        popupVisible.value = true;
        imageLabel.value = "";
        imageSource.value = "";
    }
};


const handleSaveImage = ({ file, label, source }) => {
    console.log("File:", file);
    console.log("Label:", label);
    console.log("Source:", source);

    // Logic to save
    popupVisible.value = false;
    selectedFile.value = null;
};

const closePopup = () => {
    popupVisible.value = false;
    selectedFile.value = null;
};
</script>