class RequestHandler {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.baseUrl = "https://api.unsplash.com";
  }

  async fetchPhotos(query, offset = 0, perPage = 15) {
    const apiUrl = `${this.baseUrl}/search/photos?query=${query}&client_id=${
      this.apiKey
    }&per_page=${perPage}&page=${Math.ceil((offset + 1) / perPage)}`;

    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      return data.results;
    } catch (error) {
      console.error("Error fetching photos:", error);
      return [];
    }
  }
}
