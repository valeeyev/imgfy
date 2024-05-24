const searchBtn = document.getElementById("search_btn");
const queryInput = document.getElementById("input_query");
const imgContainer = document.querySelector(".img_container");
const alertPopup = document.getElementById("alert-popup");

let displayedPhotos = [];
let totalPhotos = [];
let requestHandler;

async function getApiKey() {
  try {
    const response = await fetch("/try", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Network response was not ok " + response.statusText);
    }

    const data = await response.json();
    if (data.error) {
      throw new Error(data.error);
    }

    const apiKey = data.api_key;
    requestHandler = new RequestHandler(apiKey);

    searchBtn.addEventListener("click", handleSearch);
    displaySavedPhotos();
  } catch (error) {
    console.error("Error fetching API key:", error);
  }
}

async function handleSearch() {
  const query = queryInput.value.trim();
  if (query) {
    try {
      const photos = await requestHandler.fetchPhotos(query);
      savePhotosToLocal(photos);
      displayPhotos(photos);
    } catch (error) {
      console.error("Error fetching photos:", error);
      showAlert("Iltimos keyinroq qayta urinib ko'ring");
    }
  } else {
    showAlert("Input bo'sh bo'lishi mumkin emas");
  }
}

function displayPhotos(photos) {
  totalPhotos = photos;
  imgContainer.innerHTML = "";
  displayedPhotos = totalPhotos.slice(0, 30);

  displayedPhotos.forEach((photo) => {
    const midParentDiv = document.createElement("div");
    midParentDiv.classList.add("mid_parent");

    const imgElement = document.createElement("img");
    imgElement.src = photo.urls.small;

    const buttonContainer = document.createElement("div");
    buttonContainer.classList.add("button-container");

    const downloadButtonJPG = document.createElement("button");
    downloadButtonJPG.innerHTML = "jpg<i class='bx bx-download'></i>";
    downloadButtonJPG.addEventListener("click", () =>
      downloadImage(photo.urls.full, "jpg")
    );

    const downloadButtonPNG = document.createElement("button");
    downloadButtonPNG.innerHTML = "png<i class='bx bx-download'></i>";
    downloadButtonPNG.addEventListener("click", () =>
      downloadImage(photo.urls.full, "png")
    );

    const fullscreenButton = document.createElement("button");
    fullscreenButton.innerHTML = "<i class='bx bx-fullscreen'></i>";
    fullscreenButton.addEventListener("click", () =>
      openFullscreen(imgElement)
    );

    buttonContainer.appendChild(downloadButtonJPG);
    buttonContainer.appendChild(downloadButtonPNG);
    buttonContainer.appendChild(fullscreenButton);

    midParentDiv.appendChild(imgElement);
    midParentDiv.appendChild(buttonContainer);
    imgContainer.appendChild(midParentDiv);
  });
}

async function loadMorePhotos() {
  try {
    nextPagePhotos.forEach((photo) => {
      const midParentDiv = document.createElement("div");
      midParentDiv.classList.add("mid_parent");

      const imgElement = document.createElement("img");
      imgElement.src = photo.urls.small;

      const buttonContainer = document.createElement("div");
      buttonContainer.classList.add("button-container");

      const downloadButtonJPG = document.createElement("button");
      downloadButtonJPG.innerHTML = "<i class='bx bx-download'></i>";
      downloadButtonJPG.addEventListener("click", () =>
        downloadImage(photo.urls.full, "jpg")
      );

      const downloadButtonPNG = document.createElement("button");
      downloadButtonPNG.innerHTML = "<i class='bx bx-download'></i>";
      downloadButtonPNG.addEventListener("click", () =>
        downloadImage(photo.urls.full, "png")
      );

      const fullscreenButton = document.createElement("button");
      fullscreenButton.innerHTML = "<i class='bx bx-fullscreen'></i>";
      fullscreenButton.addEventListener("click", () =>
        openFullscreen(imgElement)
      );

      buttonContainer.appendChild(downloadButtonJPG);
      buttonContainer.appendChild(downloadButtonPNG);
      buttonContainer.appendChild(fullscreenButton);

      midParentDiv.appendChild(imgElement);
      midParentDiv.appendChild(buttonContainer);
      imgContainer.appendChild(midParentDiv);
    });

    if (displayedPhotos.length === totalPhotos.length) {
      const seeMoreBtn = document.querySelector("button");
      seeMoreBtn.remove();
    }
  } catch (error) {
    console.error("Error loading more photos:", error);
    showAlert("Iltimos keyinroq urinib ko'ring");
  }
}

function displaySavedPhotos() {
  const savedPhotos = getPhotosFromLocal();
  if (savedPhotos) {
    displayPhotos(savedPhotos);
  }
}

function showAlert(message) {
  alertPopup.textContent = message;
  alertPopup.style.display = "block";
  setTimeout(() => {
    alertPopup.style.display = "none";
  }, 3000);
}

function savePhotosToLocal(photos) {
  localStorage.setItem("photos", JSON.stringify(photos));
}

function getPhotosFromLocal() {
  const photosString = localStorage.getItem("photos");
  return photosString ? JSON.parse(photosString) : null;
}

async function downloadImage(url, format = "jpg") {
  try {
    const response = await fetch(url, { mode: "cors" });

    if (!response.ok) {
      throw new Error(`Error fetching the image: ${response.statusText}`);
    }

    const blob = await response.blob();
    const img = document.createElement("img");

    img.src = URL.createObjectURL(blob);

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const mimeType = format === "png" ? "image/png" : "image/jpeg";
      const extension = format === "png" ? "png" : "jpg";
      canvas.toBlob((blob) => {
        const blobUrl = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = blobUrl;
        link.download = `${url.split("/").pop().split(".")[0]}.${extension}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(blobUrl);
      }, mimeType);
    };
  } catch (error) {
    console.error("Error downloading the image:", error);
  }
}

function openFullscreen(element) {
  element.classList.add("fullscreen-image");

  const handleExitFullscreen = () => {
    element.classList.remove("fullscreen-image");
    document.removeEventListener("fullscreenchange", handleExitFullscreen);
    document.removeEventListener(
      "webkitfullscreenchange",
      handleExitFullscreen
    );
    document.removeEventListener("mozfullscreenchange", handleExitFullscreen);
    document.removeEventListener("MSFullscreenChange", handleExitFullscreen);
  };

  if (element.requestFullscreen) {
    element.requestFullscreen();
  } else if (element.mozRequestFullScreen) {
    element.mozRequestFullScreen();
  } else if (element.webkitRequestFullscreen) {
    element.webkitRequestFullscreen();
  } else if (element.msRequestFullscreen) {
    element.msRequestFullscreen();
  }

  document.addEventListener("fullscreenchange", handleExitFullscreen);
  document.addEventListener("webkitfullscreenchange", handleExitFullscreen);
  document.addEventListener("mozfullscreenchange", handleExitFullscreen);
  document.addEventListener("MSFullscreenChange", handleExitFullscreen);
}

document.addEventListener("DOMContentLoaded", () => {
  getApiKey();
});
