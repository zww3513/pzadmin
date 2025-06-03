import { createRouter, createWebHashHistory } from "vue-router"

const routes = [
  {
    path: "/",
    component: () => import("@/view/Main.vue"),
    name: "main",
    children: [
      {
        path: "dashboard",
        meta: {
          id: "1",
          name: "控制台",
          icon: "Platform",
          path: "/dashboard",
          describe: "用于展示当前系统中的统计数据、统计报表等",
        },
        component: () => import("@/view/dashboard/index.vue"),
      },
      {
        path: "auth",
        meta: { id: "2", name: "权限管理", icon: "Grid" },
        children: [
          {
            path: "",
            alias: ["admin"],
            meta: {
              id: "1",
              name: "账号管理",
              icon: "Avatar",
              path: "/auth/admin",
              describe: "管理员可以进行编辑,权限修改后需要重新登录",
            },
            component: () => import("@/view/auth/admin/index.vue"),
          },
          {
            path: "group",
            meta: {
              id: "2",
              name: "菜单管理",
              icon: "Menu",
              path: "/auth/group",
              describe:
                "菜单规则通常对应一个控制器的方法，同时菜单栏数据也从规则中获取",
            },
            component: () => import("@/view/auth/group/index.vue"),
          },
        ],
      },
      {
        path: "vppz",
        meta: { id: "3", name: "DIDI陪诊", icon: "BellFilled" },
        children: [
          {
            path: "order",
            meta: {
              id: "1",
              name: "订单管理",
              icon: "BellFilled",
              path: "/vppz/order",
              describe: "订单管理",
            },
            component: () => import("@/view/vppz/order/index.vue"),
          },
          {
            path: "staff",
            meta: {
              id: "2",
              name: "陪护管理",
              icon: "BellFilled",
              path: "/vppz/staff",
              describe: "陪护管理",
            },
            component: () => import("@/view/vppz/staff/index.vue"),
          }
        ],
      },
    ],
  },
  {
    path: '/login',
    component: () => import('@/view/login/index.vue'),
  },
]

const router = createRouter({
  /**
   * 路由模式
   * createWebHistory  路由模式为history
   * createWebHashHistory 路由模式为hash
   */
  history: createWebHashHistory(),
  routes,
})

export default router
