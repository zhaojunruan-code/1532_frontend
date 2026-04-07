import { LayoutRouteType } from './types';

/**
 * 路由配置
 *
 * 路由结构说明：
 * - 登录页：/login（独立布局，不显示菜单/头部/底部）
 * - 数据概览（首页）：/dashboard - 对应 React 原型 Dashboard 页面
 * - 企业资料库：/enterprise - 对应 React 原型 Enterprises 页面
 *   - 生成AI报告：/enterprise/generate/:id - 对应 React 原型 GenerateReport 页面
 * - 报告类型管理：/report-type - 对应 React 原型 ReportTypes 页面
 * - 权限管理：/permission - 对应 React 原型 Permissions 页面
 * - 以下为原有框架路由，保留但不在主导航中突出显示
 */
export default {
  routes: <LayoutRouteType[]>[
    {
      path: '/',
      redirect: '/login',
    },
    {
      name: '登录',
      path: '/login',
      component: './Login',
      menuRender: false,
      footerRender: false,
      headerRender: false,
      hideInMenu: true,
      layout: false,
    },
    /* ==================== 企业报告系统核心页面 ==================== */
    {
      name: '数据概览',
      path: '/dashboard',
      component: './Dashboard',
      icon: 'DashboardOutlined',
    },
    {
      name: '企业资料库',
      path: '/enterprise',
      icon: 'BankOutlined',
      routes: [
        { path: '/enterprise/', redirect: '/enterprise/list' },
        {
          name: '企业列表',
          path: '/enterprise/list',
          component: './Enterprise/List',
        },
        {
          name: '生成AI报告',
          path: '/enterprise/generate/:id',
          component: './Enterprise/GenerateReport',
          hideInMenu: true,
          parentKeys: ['/enterprise/list'],
        },
      ],
    },
    {
      name: '报告类型管理',
      path: '/report-type',
      component: './ReportType',
      icon: 'FileTextOutlined',
    },
    {
      name: '权限管理',
      path: '/permission',
      component: './Permission',
      icon: 'SafetyOutlined',
    },
    /* ==================== 原有框架页面（保留） ==================== */
    // {
    //   name: '工作台',
    //   path: '/workplace',
    //   component: './Workplace',
    //   icon: 'LaptopOutlined',
    // },
    // {
    //   name: '商品管理',
    //   path: '/product',
    //   icon: 'ContainerOutlined',
    //   routes: [
    //     { path: '/product/', redirect: '/product/list' },
    //     {
    //       name: '商品分类',
    //       path: '/product/category',
    //       component: './Product/Category',
    //     },
    //     {
    //       name: '商品列表',
    //       path: '/product/list',
    //       component: './Product/List',
    //     },
    //   ],
    // },
    // {
    //   name: '文章管理',
    //   path: '/article',
    //   icon: 'FileOutlined',
    //   routes: [
    //     { path: '/article/', redirect: '/article/list' },
    //     {
    //       name: '文章分类',
    //       path: '/article/category',
    //       component: './Article/Category',
    //     },
    //     {
    //       name: '文章列表',
    //       path: '/article/list',
    //       component: './Article/List',
    //     },
    //   ],
    // },
    // {
    //   name: '系统设置',
    //   path: '/system',
    //   icon: 'setting',
    //   component: './Access',
    //   wrappers: ['@/wrappers/auth'],
    //   routes: [
    //     { path: '/system/', redirect: '/system/account' },
    //     {
    //       name: '账号管理',
    //       path: '/system/account',
    //       component: './Account',
    //     },
    //     {
    //       name: '部门管理',
    //       path: '/system/dept',
    //       component: './Account',
    //     },
    //     {
    //       name: '角色管理',
    //       path: '/system/role',
    //       component: './Account',
    //     },
    //     {
    //       name: '菜单管理',
    //       path: '/system/menu',
    //       component: './Account',
    //     },
    //     {
    //       name: '操作记录',
    //       path: '/system/operate',
    //       component: './Account',
    //     },
    //   ],
    // },
  ],
};
