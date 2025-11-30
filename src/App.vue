<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
// import HelloWorld from './components/HelloWorld.vue'

</script>

<template>
  <RouterView />
</template>

<style scoped>
/* 可以在这里把全局的 margin/padding 去掉，防止有白边 */
html,
body,
#app {
  margin: 0;
  padding: 0;
  height: 100%;
}

.site-header {
  position: sticky;
  top: 0;
  z-index: 10;
  background: #ffffffcc;
  /* 半透明白底 */
  backdrop-filter: saturate(180%) blur(6px);
  border-bottom: 1px solid #e5e7eb;
}

.nav {
  max-width: 960px;
  margin: 0 auto;
  padding: 12px 16px;
  display: flex;
  gap: 12px;
}

.nav-link {
  color: #1f2937;
  text-decoration: none;
  font-weight: 500;
}

.nav-link.router-link-exact-active {
  color: #2563eb;
}
</style>
