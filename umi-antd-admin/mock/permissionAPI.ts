/**
 * 权限管理 Mock API
 * 模拟后端用户账号管理相关接口
 * 数据与 React 原型中 Permissions.tsx 的 mockData 对应
 */

/** 辅助函数：模拟网络延迟 */
const sleep = (ms: number) =>
  new Promise<void>((resolve) => {
    setTimeout(() => resolve(), ms);
  });

/**
 * 用户账号列表 Mock 数据
 * 与 React 原型 Permissions.tsx 中的 mockData 保持一致
 */
const userList: PERMISSION.UserModel[] = [
  {
    id: '1',
    username: 'admin_super',
    role: 'admin',
    status: 'active',
    createdAt: '2023-01-01',
  },
  {
    id: '2',
    username: 'sub_account_1',
    role: 'sub-admin',
    status: 'active',
    createdAt: '2023-10-15',
  },
  {
    id: '3',
    username: 'sub_account_2',
    role: 'sub-admin',
    status: 'disabled',
    createdAt: '2023-10-20',
  },
];

export default {
  /** 用户账号分页列表查询 */
  'POST /api/admin/permission/pages': async (req: any, res: any) => {
    await sleep(500);
    res.json({
      code: 0,
      message: '',
      data: {
        data: userList,
        success: true,
        total: userList.length,
      } as ProTableResult,
    });
  },

  /** 新增用户账号 */
  'POST /api/admin/permission/add': async (req: any, res: any) => {
    await sleep(500);
    res.json({
      code: 0,
      message: '',
      data: true,
    });
  },

  /** 更新用户账号 */
  'POST /api/admin/permission/update': (req: any, res: any) => {
    res.json({
      code: 0,
      message: '',
      data: true,
    });
  },

  /** 删除用户账号 */
  'POST /api/admin/permission/delete': async (req: any, res: any) => {
    await sleep(500);
    res.json({
      code: 0,
      message: '',
      data: true,
    });
  },

  /** 切换用户账号状态（启用/停用） */
  'POST /api/admin/permission/toggleStatus': (req: any, res: any) => {
    res.json({
      code: 0,
      message: '',
      data: true,
    });
  },
};
