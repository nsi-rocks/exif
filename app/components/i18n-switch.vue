<template>
  <div>
    <NuxtLink :to="$switchLocalePath(locale === 'fr' ? 'en' : 'fr')">{{ locale === 'fr' ? 'FR' : 'EN' }}</NuxtLink>
  </div>
</template>

<script setup lang="ts">
const { locale } = useI18n()
</script>
