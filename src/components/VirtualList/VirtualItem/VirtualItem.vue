<template>
  <div class="item-wrap">{{ props.items.item.text }}</div>
</template>

<script setup lang="ts">
interface ItemProps {
  items: { id: number; item: any }
}

const props = defineProps<ItemProps>()
</script>

<style scoped lang="less">
.item-wrap {
  display: flex;
  color: #333;
  font-size: 16px;
  line-height: 24px;
  background-color: #fff;
}
</style>
