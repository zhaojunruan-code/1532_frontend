/**
 * 报告类型管理 API 服务
 * 提供报告类型数据的增删改查及目录管理接口
 * 所有接口均通过 POST 方法调用，与后端 /api/admin/reportType/* 路径对应
 */
import { post } from '@/utils/request';

/**
 * 获取报告类型列表（分页）
 * @param params - ProTable 标准分页参数
 * @returns 分页数据
 */
export const reportTypePages = (params: ProTableParams) =>
  post('/admin/reportType/pages', params) as Promise<ProTableResult>;

/**
 * 获取所有报告类型（不分页，用于下拉选择）
 * @returns 报告类型完整列表
 */
export const reportTypeList = () =>
  post('/admin/reportType/list') as Promise<REPORT_TYPE.ReportTypeModel[]>;

/**
 * 新增报告类型
 * @param params - 报告类型表单数据
 * @returns 操作结果
 */
export const reportTypeAdd = (params: REPORT_TYPE.ReportTypeFormData) =>
  post('/admin/reportType/add', params);

/**
 * 更新报告类型
 * @param params - 包含 id 的报告类型数据
 * @returns 操作结果
 */
export const reportTypeUpdate = (
  params: Partial<REPORT_TYPE.ReportTypeModel>,
) => post('/admin/reportType/update', params);

/**
 * 删除报告类型
 * @param id - 报告类型唯一标识
 * @returns 操作结果
 */
export const reportTypeRemove = (id: string | number) =>
  post('/admin/reportType/delete', { id });

/**
 * 更新报告类型的目录内容
 * @param params - 包含 id 和目录内容的参数
 * @returns 操作结果
 */
export const reportTypeUpdateDirectory = (params: {
  id: string | number;
  directoryContent: string;
}) => post('/admin/reportType/updateDirectory', params);
