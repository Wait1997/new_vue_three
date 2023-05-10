<template>
  <div
    :class="['upload-icon', props.classname, disabled && 'disabled']"
    @click.stop="
      (event) => {
        onClick(event)
      }
    "
  >
    <slot name="icon"><van-icon name="plus" :size="props.iconSize" color="#dcdee0" /></slot>
    <slot name="upload"></slot>
  </div>
</template>

<script setup lang="ts">
interface IconFileProps {
  iconSize?: number
  disabled?: boolean
  classname?: string
}

const props = withDefaults(defineProps<IconFileProps>(), {
  iconSize: 24,
  disabled: false
})

const emits = defineEmits(['onClick'])

const onClick = (event: Event) => {
  emits('onClick', event)
}
</script>

<style scoped lang="less">
.upload-icon {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 80px;
  height: 80px;
  background-color: #f7f8fa;
  cursor: pointer;
  &.disabled {
    cursor: not-allowed;
  }
}
</style>
