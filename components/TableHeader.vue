<template>
  <th>
    <div class="header-wrapper">
      <span>{{ name }}</span>
      <div class="button-container">
        <button class="sort-button" @click="handleClick('up')">▲</button>
        <button class="sort-button" @click="handleClick('down')">▼</button>
      </div>
    </div>
  </th>
</template>

<script setup>
import { defineProps, defineEmits } from "vue";

const props = defineProps({
  name: String,
  nameCod: String,
});

const emits = defineEmits(["sortColumn"]);

const handleClick = (direction) => {
  emits("sortColumn", direction, props.nameCod);
};
</script>

<style scoped>
/* Style for the header wrapper */
.header-wrapper {
  display: flex;
  align-items: center;
}

/* Style for the sort buttons container */
.button-container {
  margin-left: 5px;
}

/* Style for the sort buttons */
.sort-button {
  font-size: 12px; /* Adjust button font size */
  padding: 5px 8px; /* Adjust button padding */
  border: none;
  background-color: transparent;
  cursor: pointer;
  transition: color 0.3s ease;
}

/* Hover effect for sort buttons */
.sort-button:hover {
  color: #007bff; /* Change button color on hover */
}
</style>
