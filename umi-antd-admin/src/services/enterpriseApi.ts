/**
 * 企业资料库 API 服务
 * 提供企业数据的增删改查接口调用
 * 所有接口均通过 POST 方法调用，与后端 /api/admin/enterprise/* 路径对应
 */
import { post } from '@/utils/request';

/**
 * 获取企业列表（分页）
 * @param params - ProTable 标准分页参数
 * @returns 分页数据，包含 data、total、success 字段
 */
export const enterprisePages = (params: ProTableParams) =>
  post('/admin/enterprise/pages', params) as Promise<ProTableResult>;

/**
 * 新增企业
 * @param params - 企业表单数据
 * @returns 操作结果
 */
export const enterpriseAdd = (params: ENTERPRISE.EnterpriseFormData) =>
  post('/admin/enterprise/add', params);

/**
 * 更新企业信息
 * @param params - 包含 id 的企业数据
 * @returns 操作结果
 */
export const enterpriseUpdate = (params: Partial<ENTERPRISE.EnterpriseModel>) =>
  post('/admin/enterprise/update', params);

/**
 * 删除企业
 * @param id - 企业唯一标识
 * @returns 操作结果
 */
export const enterpriseRemove = (id: string | number) =>
  post('/admin/enterprise/delete', { id });

/**
 * 获取企业详情
 * @param id - 企业唯一标识
 * @returns 企业完整数据
 */
export const enterpriseDetail = (id: string | number) =>
  post('/admin/enterprise/detail', { id });

/**
 * 公示企业报告
 * @param id - 企业唯一标识
 * @returns 操作结果
 */
export const enterprisePublish = (id: string | number) =>
  post('/admin/enterprise/publish', { id });

/**
 * 生成 AI 报告
 * @param params - 包含企业 id 和报告版本的参数
 * @returns 操作结果
 */
export const enterpriseGenerateReport = (params: {
  id: string | number;
  version: 'basic' | 'standard';
}) => post('/admin/enterprise/generateReport', params);

/**
 * 获取数据概览统计
 * @returns Dashboard 统计数据
 */
export const getDashboardStats = () =>
  post('/admin/enterprise/dashboardStats') as Promise<ENTERPRISE.DashboardStats>;

/**
 * 获取行业分布数据
 * @returns 行业名称和数量的分布数组
 */
export const getIndustryDistribution = () =>
  post('/admin/enterprise/industryDistribution') as Promise<
    ENTERPRISE.IndustryDistribution[]
  >;
