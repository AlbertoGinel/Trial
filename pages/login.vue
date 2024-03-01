<script setup>
import { useRouter } from "vue-router"; // Import useRouter function from Vue Router
import { ref, watchEffect } from "vue"; // Import ref and watchEffect from Vue

const { signIn, status } = useAuth(); // Destructure signIn and status from useAuth()
const router = useRouter(); // Initialize router

const email = ref("");
const password = ref("");

watchEffect(() => {
  if (status.value === "authenticated") {
    router.push("/dashboard");
  }
});
</script>

<style scoped>
/* Component styles */
</style>

<template>
  <form
    class="space-y-4 md:space-y-6"
    @submit.prevent="
      signIn('credentials', { email: email, password: password })
    "
  >
    <div>
      <label for="email">Email</label>
      <input
        v-model="email"
        type="email"
        name="email"
        id="email"
        placeholder="name@company.com"
        required
      />
    </div>
    <div>
      <label for="password">Password</label>
      <input
        v-model="password"
        type="password"
        name="password"
        id="password"
        placeholder="••••••••"
        required
      />
    </div>

    <button type="submit">Sign in</button>
  </form>
</template>
