/**
 * 权限管理 API 服务
 * 提供用户账号的增删改查及状态管理接口
 * 所有接口均通过 POST 方法调用，与后端 /api/admin/permission/* 路径对应
 */
import { post } from '@/utils/request';

/**
 * 获取用户账号列表（分页）
 * @param params - ProTable 标准分页参数
 * @returns 分页数据
 */
export const permissionPages = (params: ProTableParams) =>
  post('/admin/permission/pages', params) as Promise<ProTableResult>;

/**
 * 新增用户账号（子账号）
 * @param params - 用户表单数据
 * @returns 操作结果
 */
export const permissionAdd = (params: PERMISSION.UserFormData) =>
  post('/admin/permission/add', params);

/**
 * 更新用户账号信息
 * @param params - 包含 id 的用户数据
 * @returns 操作结果
 */
export const permissionUpdate = (params: Partial<PERMISSION.UserModel> & { password?: string }) =>
  post('/admin/permission/update', params);

/**
 * 删除用户账号
 * @param id - 用户唯一标识
 * @returns 操作结果
 */
export const permissionRemove = (id: string | number) =>
  post('/admin/permission/delete', { id });

/**
 * 切换用户账号状态（启用/停用）
 * @param id - 用户唯一标识
 * @returns 操作结果
 */
export const permissionToggleStatus = (id: string | number) =>
  post('/admin/permission/toggleStatus', { id });
