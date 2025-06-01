<template>
  <div class="header-container flex-box">
    <div class="header-left flex-box">
      <el-icon class="icon" :size="20" @click="store.commit('collapseMenu')">
        <Fold />
      </el-icon>
      <ul class="flex-box">
        <li
          v-for="(item, index) in slectMenu"
          :key="item.path"
          class="tab flex-box"
          :class="{ selected: route.path === item.path }"
        >
          <el-icon :size="12">
            <component :is="item.icon"></component>
          </el-icon>
          <router-link class="text flex-box" :to="{ path: item.path }">
            {{ item.name }}
          </router-link>
          <el-icon class="close" :size="12">
            <Close />
          </el-icon>
        </li>
      </ul>
    </div>
    <div class="header-right">
      <el-dropdown>
        <div class="el-dropdown-link flex-box">
          <el-avatar
            src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
          ></el-avatar>
          <p class="user-name">admin</p>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item>Action 1</el-dropdown-item>
            <el-dropdown-item>Action 2</el-dropdown-item>
            <el-dropdown-item>Action 3</el-dropdown-item>
            <el-dropdown-item disabled>Action 4</el-dropdown-item>
            <el-dropdown-item divided>Action 5</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup>
import { useRoute } from "vue-router"
import { useStore } from "vuex"
import { computed } from "vue"
const store = useStore()
// 获取当前路由信息
const route = useRoute()
const slectMenu = computed(() => store.state.menu.selectMenu)
</script>

<style lang="less" scoped>
.flex-box {
  display: flex;
  align-items: center;
}

.header-container {
  justify-content: space-between;
  height: 100%;
  background-color: #fff;
  padding-right: 25px;

  .header-left {
    height: 100%;

    .icon {
      width: 45px;
      height: 100%;
    }

    .icon:hover {
      /* 导航栏头部背景色（浅灰色）及悬停时指针样式 */
      background-color: #f5f5f5;
      cursor: pointer;
    }

    .tab {
      padding: 0 10px;
      height: 100%;
      .text {
        margin: 0 5px;
      }
      .close {
        visibility: hidden;
      }
      &.selected {
        a {
          color: #409eff;
        }
        i {
          color: #409eff;
          background-color: #f5f5f5;
        }
      }
    }

    .tab:hover {
      background-color: #f5f5f5;
      .close {
        visibility: inherit;
        cursor: pointer;
      }
    }
  }

  .header-right {
    .user-name {
      margin-left: 10px;
    }
  }
  a {
    height: 100%;
    color: #333;
    font-size: 15px;
  }
}
</style>
