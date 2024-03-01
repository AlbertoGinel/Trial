// server/api/countries.js

export default defineEventHandler(async () => {
  try {
    const response = await $fetch("https://restcountries.com/v3.1/all");

    // Map and transform the response data
    const mappedData = response.map((country) => ({
      nameCommon: country.name?.common || "",
      nameOfficial: country.name?.official || "",
      cca2: country.cca2 || "",
      capital: country.capital?.[0] || "", // Assuming capital is an array
      currencies: country.currencies
        ? Object.values(country.currencies)
            .map((currency) => currency.name)
            .join(", ")
        : "", // Assuming currencies is an object
      region: country.region || "",
      subregion: country.subregion || "",
      languages: country.languages
        ? Object.values(country.languages).join(", ")
        : "", // Assuming languages is an object
      area: country.area,
      flag: country.flag || "",
      population: country.population,
      flagsPng: country.flags?.png || "",
    }));

    return mappedData;
  } catch (error) {
    console.error("Error fetching countries:", error);
    throw error;
  }
});
