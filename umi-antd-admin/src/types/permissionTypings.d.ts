/**
 * 权限管理相关类型定义
 * 对应 React 原型中的 User/Permissions 接口
 */
declare namespace PERMISSION {
  /**
   * 用户角色枚举
   * admin - 总管理员，拥有全部权限
   * sub-admin - 子账号，受限访问
   */
  type UserRole = 'admin' | 'sub-admin';

  /**
   * 用户状态枚举
   * active - 正常启用状态
   * disabled - 已停用状态
   */
  type UserStatus = 'active' | 'disabled';

  /**
   * 用户账号数据模型
   * @property id - 用户唯一标识
   * @property username - 登录账号名称
   * @property role - 角色权限（admin/sub-admin）
   * @property status - 账号状态（active/disabled）
   * @property createdAt - 账号创建时间
   */
  interface UserModel {
    id?: number | string;
    username: string;
    role: UserRole;
    status: UserStatus;
    createdAt: string;
  }

  /**
   * 用户表单数据（新增/编辑时使用）
   */
  interface UserFormData {
    username: string;
    password?: string;
    role: UserRole;
  }
}
