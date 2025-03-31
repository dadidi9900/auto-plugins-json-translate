<script setup lang="ts">
import TranslationForm from './components/TranslationForm.vue'
import FeatureGuide from './components/FeatureGuide.vue'
</script>

<template>
  <div class="app-container">  
    <TranslationForm />
    <FeatureGuide />
  </div>
</template>

<style>
body {
  margin: 0;
  padding: 0;
  background-color: #ffffff;
  min-height: 100vh;
}

.app-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

h1 {
  text-align: center;
  color: #85c2ff;
  margin-bottom: 30px;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
}
</style>
