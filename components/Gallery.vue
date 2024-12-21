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
        <div v-if="isLoading" class="gallery-content spinner">
            Loading images...
        </div>
        <GalleryGrid v-else :images="images" />

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
const images = ref([]);
const isLoading = ref(false);

const fetchImages = async () => {
    isLoading.value = true;
    try {
        const response = await fetch('/api/images');
        const data = await response.json();
        images.value = data.images; // Assuming the API returns an object with an 'images' array
    } catch (error) {
        console.error("Error fetching images:", error);
    } 
    finally {
        isLoading.value = false;
    }
};

onMounted(() => {
    fetchImages(); // Fetch images when the component is mounted
});

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


const handleSaveImage = async ({ file, label, source }) => {
    console.log("File:", file);
    console.log("Label:", label);
    console.log("Source:", source);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("label", label);
    formData.append("source", source);

    for (const pair of formData.entries()) {
        console.log(pair[0], pair[1]);
    }

    try {
        const response = await fetch("/api/upload", {
            method: "POST",
            body: formData,
        });

        const result = await response.json();
        console.log("Upload result:", result);

        if (response.ok) {
            alert("Image uploaded successfully!");
            images.value.unshift(result.image);
        } else {
            alert(`Failed to upload image: ${result.message}`);
        }
    } catch (error) {
        console.error("Error uploading image:", error);
        alert("An error occurred during the upload.");
    }

    // Logic to save
    popupVisible.value = false;
    selectedFile.value = null;
};

const closePopup = () => {
    popupVisible.value = false;
    selectedFile.value = null;
};
</script>