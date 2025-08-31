<template>
  <footer class="mb-5">
    <USeparator icon="mdi:alarm-plus" />

    <UContainer class="my-5 flex justify-center">
      <ul class="flex flex-col gap-3">
        <li>
          <NuxtLink
            title="Github"
            to="https://github.com/Ex-iT/P2K2"
            target="_blank"
            rel="noopener noreferrer"
            class="transition flex items-center hover:opacity-75"
          >
            <UIcon name="mdi:github-box" size="25" />
            <p class="pl-1.5">
              P2K2 Github
            </p>
          </NuxtLink>
        </li>

        <li>
          <NuxtLink
            title="livep2000.nl"
            to="https://www.livep2000.nl/"
            target="_blank"
            rel="noopener noreferrer"
            class="transition flex items-center hover:opacity-75"
          >
            <UIcon name="mdi:web" size="25" />
            <p class="pl-1.5">
              Data livep2000.nl
            </p>
          </NuxtLink>
        </li>
      </ul>
    </UContainer>
  </footer>
</template>
