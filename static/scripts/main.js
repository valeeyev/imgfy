const search = document.getElementById("search_btn");
const query = document.getElementById("input_query");

const img_container = document.querySelector(".img_container");
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
    console.log("API Key:", apiKey);
  } catch (error) {
    console.error("Error fetching API key:", error);
  }
}

document.addEventListener("DOMContentLoaded", (event) => {
  getApiKey();
});
