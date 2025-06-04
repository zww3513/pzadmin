<template>
  <div class="header-container flex-box">
    <div class="header-left flex-box">
      <el-icon class="icon" :size="20" @click="store.commit('collapseMenu')">
        <Fold />
      </el-icon>
      <ul class="flex-box">
        <li
          v-for="(item, index) in selectMenu"
          :key="item.path"
          class="tab flex-box"
          :class="{ selected: route.path === item.path }"
          @contextmenu.prevent="showContextMenu($event, item, index)"
        >
          <el-icon :size="12">
            <component :is="item.icon"></component>
          </el-icon>
          <router-link class="text flex-box" :to="{ path: item.path }">
            {{ item.name }}
          </router-link>
          <el-icon class="close" :size="12" @click="closeTab(item, index)">
            <Close />
          </el-icon>
        </li>
      </ul>
    </div>
    <!-- 右键菜单 -->
    <div
      v-if="contextMenuVisible"
      class="context-menu"
      :style="{ left: contextMenuX + 'px', top: contextMenuY + 'px' }"
    >
      <div class="menu-item" @click="closeAllTabs">关闭全部</div>
      <div class="menu-item" @click="closeRightTabs">关闭右侧</div>
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
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
import { computed, ref } from "vue";

const store = useStore();
const route = useRoute();
const router = useRouter();
const selectMenu = computed(() => store.state.menu.selectMenu);

// 右键菜单相关变量
const contextMenuVisible = ref(false);
const contextMenuX = ref(0);
const contextMenuY = ref(0);
const currentMenuItem = ref(null);

// 显示右键菜单
const showContextMenu = (event, item, index) => {
  event.preventDefault();
  contextMenuVisible.value = true;
  contextMenuX.value = event.clientX;
  contextMenuY.value = event.clientY;
  currentMenuItem.value = { item, index };
};

// 关闭当前标签
const closeTab = (item, index) => {
  console.log("item", item);
  console.log("index", index);
  store.commit("closeMenu", item);
  if (route.path !== item.path) return;
  const selectMenuData = selectMenu.value;
  if (index === selectMenuData.length) {
    if (index === 0) {
      router.push({ path: "/" });
      return;
    }
    router.push({ path: selectMenuData[index - 1].path });
  } else {
    router.push({ path: selectMenuData[index].path });
  }
};

// 关闭全部标签
const closeAllTabs = () => {
  store.commit("closeAllMenus");
  contextMenuVisible.value = false;
  router.push({ path: "/" });
};

// 关闭右侧标签
const closeRightTabs = () => {
  if (!currentMenuItem.value) return;
  const { index } = currentMenuItem.value;
  store.commit("closeRightMenus", index);
  contextMenuVisible.value = false;
};

// 点击其他地方隐藏右键菜单
document.addEventListener("click", () => {
  contextMenuVisible.value = false;
});
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

/* 右键菜单样式 */
.context-menu {
  position: fixed;
  background-color: #fff;
  border: 1px solid #ddd;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 9999;
}

.menu-item {
  padding: 5px 10px;
  cursor: pointer;
  &:hover {
    background-color: #f5f5f5;
  }
}
</style>
