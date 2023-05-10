<template>
  <div class="container">
    <div class="top">
      <div class="left" @click="handleClick('home')">Home</div>
      <div class="right" @click="handleClick('about')">About</div>
    </div>
    <router-view></router-view>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const handleClick = (type: string) => {
  if (type === 'home') {
    router.push('/')
  }
  if (type === 'about') {
    router.push('/about')
  }
}
</script>

<style scoped lang="less">
.container {
  height: 100%;
  .top {
    display: flex;
    background-color: #fefefe;
    .left,
    .right {
      flex: auto;
      line-height: 48px;
      text-align: center;
      cursor: pointer;
    }
  }
}
</style>
