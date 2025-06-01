<template>
  <template v-for="(item) in props.menuData">
    <!-- 无子菜单的菜单项 -->
    <el-menu-item
      v-if="!item.children || item.children.length == 0"
      :index="`${props.index}-${item.meta.id}`"
      :key="`${props.index}-${item.meta.id}`"
      @click="handleClick(item,`${props.index}-${item.meta.id}`)"
    >
      <el-icon size="20">
        <!-- 动态渲染图标组件 -->
        <component :is="item.meta.icon"></component>
      </el-icon>
      <span>{{ item.meta.name }}</span>
    </el-menu-item>

    <!-- 有子菜单的菜单项 -->
    <el-sub-menu
      v-else
      :index="`${props.index}-${item.meta.id}`"
      @open="handleOpen"
    >
      <template #title>
        <el-icon size="20">
          <!-- 动态渲染图标组件 -->
          <component :is="item.meta.icon"></component>
        </el-icon>
        <span>{{ item.meta.name }}</span>
      </template>
      <tree-menu
        :index="`${props.index}-${item.meta.id}`"
        :menuData="item.children"
      />
    </el-sub-menu>
  </template>
</template>

<script setup>
import {useRouter} from "vue-router"
defineOptions({
  name: "TreeMenu",
})

const props = defineProps(["menuData", "index"])
console.log("menuData", props.menuData)


//点击菜单
const router = useRouter()
const handleClick = (item,active) => {
  console.log("item",item)
  console.log("active",active)
  router.push(item.meta.path)
}
</script>

<style lang="less" scoped></style>
