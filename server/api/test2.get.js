async function fetchDataFromAPI(event) {
  try {
    // Replace 'https://your-api.com/endpoint' with the actual API URL
    const response = await fetch("https://ipapi.co/json");
    //https://ipapi.co/json
    //https://api.fxer.net/api/trial
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    // Parse the response as JSON
    const data = await response.json();

    console.log(data);
    // Return the data from the API
    return data;
  } catch (error) {
    // Handle errors
    console.error("Error fetching data:", error);
    throw new Error("Internal Server Error");
  }
}

export default fetchDataFromAPI;
