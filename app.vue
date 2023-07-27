<script setup>
const {
  // pending, // @TODO do something clever while pending
  data,
  // refresh, // @TODO implement auto refresh
} = await useFetch('/api/v1/getMessages')
</script>

<template>
  <pre>{{ data }}</pre>
</template>
