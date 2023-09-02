<script setup>
const drawer = ref(null)
const {
  // pending, // @TODO do something clever while pending
  data,
  // refresh, // @TODO implement auto refresh
} = await useFetch('/api/v1/getMessages')
</script>

<template>
  <v-app id="p2k2">
    <v-navigation-drawer v-model="drawer" temporary>
      <!-- Add menu items -->
    </v-navigation-drawer>

    <v-app-bar>
      <v-app-bar-nav-icon @click="drawer = !drawer" />
      <v-app-bar-title>P2000 v2</v-app-bar-title>
    </v-app-bar>

    <v-main>
      <v-list>
        <v-list-item
          v-for="(item, index) in data"
          :key="`item-${index}`"
        >
          <v-card>
            <v-card-title>{{ item.msg }}</v-card-title>
            <v-card-subtitle>
              {{ item.prio }}
            </v-card-subtitle>
            <v-card-text>
              {{ item.capcodes }}
            </v-card-text>
          </v-card>
        </v-list-item>
      </v-list>

      <!-- <pre>{{ data }}</pre> -->
    </v-main>
  </v-app>
</template>
