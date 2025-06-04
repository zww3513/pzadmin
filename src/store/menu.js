const state = {
  isCollapse: false,
  selectMenu: [],
}

const mutations = {
  collapseMenu(state) {
    state.isCollapse = !state.isCollapse
  },

  addMenu(state, payload) {
    // 检查 selectMenu 数组中是否已经存在路径与 payload.path 相同的菜单项
    // 如果存在，则不做任何操作；如果不存在，则将 payload 添加到 selectMenu 数组中
    state.selectMenu.find((item) => item.path === payload.path) ? "" : state.selectMenu.push(payload)
  },

  closeMenu(state, payload) {
    // 找到点击数据的索引
    const index = state.selectMenu.findIndex(val => val.name === payload.name)
    // 通过索引删除数组指定元素
    state.selectMenu.splice(index, 1)
  },

  // 新增：关闭右侧标签页
  closeRightMenus(state, index) {
    if (index >= 0 && index < state.selectMenu.length) {
      state.selectMenu.splice(index + 1)
    }
  },

  // 新增：关闭所有标签页
  closeAllMenus(state) {
    state.selectMenu = []
  }
}

export default {
  state,
  mutations,
}