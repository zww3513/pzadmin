<template>
  <el-menu
    :style="{ width: isCollapse ? '64px' : '200px' }"
    active-text-color="#ffd04b"
    background-color="#545c64"
    class="aside-container"
    default-active="2"
    text-color="#fff"
    @open="handleOpen"
    @close="handleClose"
    :collapse="isCollapse"
  >
    <p class="logo-lg">{{ isCollapse ? 'DIDI' : 'DIDI陪诊' }}</p>
    <TreeMenu :menuData="menuData" :index="0" />
  </el-menu>
</template>

<script setup>
import TreeMenu from "./TreeMenu.vue"
import { useRouter } from "vue-router"
import { reactive,computed } from "vue"
import { useStore } from "vuex"
const router = useRouter()
const menuData = reactive(router.options.routes[0].children)
console.log("router", router)

const store = useStore()
const isCollapse=computed(()=>store.state.menu.isCollapse)
const handleOpen = () => {}
const handleClose = () => {}
</script>

<style lang="less" scoped>
.aside-container {
  height: 100%;
  .logo-lg {
    text-align: center;
    height: 50px;
    line-height: 50px;
    color: #fff;
  }
}
</style>
