<script lang="ts" setup>
defineProps({
  what: {
    type: String,
    default: 'NSI',
  },
})
</script>

<template>
  <div class="flex flex-row items-center gap-2">
    <LogoSVG class="h-10 w-10" />
    <span>{{ what }} Rocks !</span>
  </div>
</template>

  <style>

  </style>
