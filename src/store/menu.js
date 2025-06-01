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
}

export default {
  state,
  mutations,
}
