<script setup>
import { useRouter } from "vue-router";
import { computed, watchEffect, ref } from "vue";
import TableHeader from "@/components/TableHeader";

// Initialize router
const router = useRouter();

// Destructure signOut and status from useAuth()
const { signOut, status } = useAuth();

// Computed property to check if user is logged in
const loggedIn = computed(() => status.value === "authenticated");

// Define data as a ref
const data = ref([]);
const dataModified = ref([]);
const filters = ref({
  nameCommon: "",
  nameOfficial: "",
  cca2: "",
  capital: "",
  currencies: "",
  region: "",
  subregion: "",
  languages: "",
  population: 0,
  area: 0,
});

// Watch for changes in loggedIn status and redirect to login page if not logged in
watchEffect(() => {
  if (!loggedIn.value) {
    router.push("/login");
  }
});

// Fetch data from API and update the data ref
const fetchData = async () => {
  try {
    const response = await fetch("/api/test3");
    const fetchedData = await response.json();
    data.value = fetchedData;
    // Copy fetched data to dataModified
    dataModified.value = [...fetchedData];
  } catch (error) {
    // Handle errors
    console.error("Error fetching data:", error);
  }
};

// Function to reset data
const resetData = () => {
  // Clear existing dataModified
  dataModified.value = [...data.value];
  // Reset pagination
  currentPage.value = 0;

  // Update the properties of the filters ref object to empty strings
  filters.value.nameCommon = "";
  filters.value.nameOfficial = "";
  filters.value.cca2 = "";
  filters.value.capital = "";
  filters.value.currencies = "";
  filters.value.region = "";
  filters.value.subregion = "";
  filters.value.languages = "";
  filters.value.area = 0;
  filters.value.population = 0;
};

// Pagination
const pageSize = 100; // Number of items per page
const currentPage = ref(0); // Current page index
const totalPages = computed(() =>
  Math.ceil(dataModified.value.length / pageSize)
);
const paginatedData = computed(() => {
  const startIndex = currentPage.value * pageSize;
  const endIndex = Math.min(startIndex + pageSize, dataModified.value.length);
  return dataModified.value.slice(startIndex, endIndex);
});

// Functions to navigate between pages
const nextPage = () => {
  if (currentPage.value < totalPages.value - 1) {
    currentPage.value++;
  }
};

const prevPage = () => {
  if (currentPage.value > 0) {
    currentPage.value--;
  }
};

// Function to sort data
const sortData = (direction, field) => {
  const compareFn = (a, b) => {
    // Handle different types of fields
    const aValue =
      typeof a[field] === "string" ? a[field].toLowerCase() : a[field];
    const bValue =
      typeof b[field] === "string" ? b[field].toLowerCase() : b[field];

    if (aValue < bValue) {
      return direction === "up" ? -1 : 1;
    }
    if (aValue > bValue) {
      return direction === "up" ? 1 : -1;
    }
    return 0;
  };

  dataModified.value.sort(compareFn);
};

// Function to filter data based on the filters object
const filterData = () => {
  // Create a copy of the original data
  dataModified.value = [...data.value];

  // Iterate through each filter property
  Object.keys(filters.value).forEach((field) => {
    // Get the filter value for the current field
    const filterValue = filters.value[field];

    // If the filter value is non-empty and not a number, filter the data
    if (filterValue !== "" && isNaN(filterValue)) {
      dataModified.value = dataModified.value.filter((item) => {
        const fieldValue = item[field];

        // Check for matches regardless of case for string fields
        if (typeof fieldValue === "string") {
          return fieldValue.toLowerCase().includes(filterValue.toLowerCase());
        }

        // For non-string fields, skip filtering
        return true;
      });
    }

    // If the filter value is non-empty and a number, filter out elements with values less than the filter value
    if (filterValue !== "" && !isNaN(filterValue)) {
      dataModified.value = dataModified.value.filter((item) => {
        const fieldValue = item[field];

        // For numeric fields (population and area), filter out elements with values less than filterValue
        return fieldValue >= filterValue;
      });
    }
  });
  currentPage.value = 0;
};

watchEffect(() => {
  filterData();
});

function formatBigNumbers(number) {
  if (number >= 1000000) {
    return (number / 1000000).toFixed(1) + "M";
  } else if (number >= 1000) {
    return (number / 1000).toFixed(1) + "K";
  } else {
    return number.toString();
  }
}

// Fetch data initially
fetchData();
</script>
<template>
  <div>
    <button @click="resetData">Reset</button>
    <button @click="signOut()">Sign out</button>
    <div>
      <h1>Dashboard</h1>
      <div class="input-grid">
        <div class="input-container">
          <label for="nameCommon">Name (Common):</label>
          <input type="text" id="nameCommon" v-model="filters.nameCommon" />
        </div>
        <div class="input-container">
          <label for="nameOfficial">Name (Official):</label>
          <input type="text" id="nameOfficial" v-model="filters.nameOfficial" />
        </div>
        <div class="input-container">
          <label for="cca2">CCA2:</label>
          <input type="text" id="cca2" v-model="filters.cca2" />
        </div>
        <div class="input-container">
          <label for="capital">Capital:</label>
          <input type="text" id="capital" v-model="filters.capital" />
        </div>
        <div class="input-container">
          <label for="currencies">Currencies:</label>
          <input type="text" id="currencies" v-model="filters.currencies" />
        </div>
        <div class="input-container">
          <label for="region">Region:</label>
          <input type="text" id="region" v-model="filters.region" />
        </div>
        <div class="input-container">
          <label for="subregion">Subregion:</label>
          <input type="text" id="subregion" v-model="filters.subregion" />
        </div>
        <div class="input-container">
          <label for="languages">Languages:</label>
          <input type="text" id="languages" v-model="filters.languages" />
        </div>
        <div class="input-container">
          <label for="area">Area:</label>
          <input type="number" id="area" v-model="filters.area" />
        </div>
        <div class="input-container">
          <label for="population">Population:</label>
          <input type="number" id="population" v-model="filters.population" />
        </div>
      </div>
      <div class="pagination-controls">
        <!-- Pagination controls -->
        <button @click="prevPage" :disabled="currentPage === 0">
          Previous Page
        </button>
        <span>Page {{ currentPage + 1 }} of {{ totalPages }}</span>
        <button @click="nextPage" :disabled="currentPage === totalPages - 1">
          Next Page
        </button>
      </div>

      <table>
        <thead>
          <tr>
            <TableHeader
              name="Name (Common)"
              nameCod="nameCommon"
              @sortColumn="sortData"
            />
            <TableHeader
              name="Name (Official)"
              nameCod="nameOfficial"
              @sortColumn="sortData"
            />
            <TableHeader name="CCA2" nameCod="cca2" @sortColumn="sortData" />
            <TableHeader
              name="Capital"
              nameCod="capital"
              @sortColumn="sortData"
            />
            <TableHeader
              name="Currencies"
              nameCod="currencies"
              @sortColumn="sortData"
            />
            <TableHeader
              name="Region"
              nameCod="region"
              @sortColumn="sortData"
            />
            <TableHeader
              name="Subregion"
              nameCod="subregion"
              @sortColumn="sortData"
            />
            <TableHeader
              name="Languages"
              nameCod="languages"
              @sortColumn="sortData"
            />
            <TableHeader name="Area" nameCod="area" @sortColumn="sortData" />
            <TableHeader
              name="Population"
              nameCod="population"
              @sortColumn="sortData"
            />
            <th>Flags</th>
          </tr>
        </thead>
        <tbody>
          <!-- Iterate over paginatedData -->
          <tr v-for="item in paginatedData" :key="item.nameCommon">
            <td>{{ item.nameCommon }}</td>
            <td>{{ item.nameOfficial }}</td>
            <td>{{ item.cca2 }}</td>
            <td>{{ item.capital }}</td>
            <td>{{ item.currencies }}</td>
            <td>{{ item.region }}</td>
            <td>{{ item.subregion }}</td>
            <td>{{ item.languages }}</td>
            <td>{{ formatBigNumbers(item.area) }}</td>
            <td>{{ formatBigNumbers(item.population) }}</td>
            <td>
              <nuxt-img
                :src="item.flagsPng"
                alt="Flag Image"
                width="50"
                height="auto"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style>
/* Style for the dashboard container */
.dashboard-container {
  padding: 20px;
  font-family: Arial, sans-serif;
}

/* Style for the input fields */
input[type="text"],
input[type="number"] {
  width: 200px;
  padding: 5px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

/* Style for the table */
table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

/* Style for table headers */
th {
  background-color: #f2f2f2;
  padding: 10px;
  text-align: left;
}

/* Style for table cells */
td {
  border: 1px solid #ddd;
  padding: 10px;
}

/* Style for pagination controls */
.pagination-controls {
  margin-top: 20px;
}

/* Style for buttons */
button {
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

/* Style for page number */
.page-number {
  margin-left: 10px;
  font-weight: bold;
}
/* Style for the container */
.input-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr)); /* Four columns */
  gap: 15px; /* Gap between grid items */
}

/* Style for each input container */
.input-container {
  display: flex;
  flex-direction: column;
}

/* Style for labels */
label {
  margin-bottom: 5px;
  font-weight: bold;
}

/* Style for inputs */
input[type="text"],
input[type="number"] {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  transition: border-color 0.3s ease;
}

/* Hover effect for inputs */
input[type="text"]:hover,
input[type="number"]:hover {
  border-color: #007bff;
}

/* Focus effect for inputs */
input[type="text"]:focus,
input[type="number"]:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
}

.pagination-controls {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
}

.pagination-controls button {
  margin: 0 10px; /* Adjust margin as needed */
}
</style>
