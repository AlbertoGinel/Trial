<template></template>
<script>
export default {
  async beforeMount() {
    // Redirect to /login
    this.$router.push("/login");
  },
};
</script>
