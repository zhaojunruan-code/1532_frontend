/**
 * 企业资料库相关类型定义
 * 对应 React 原型中的 Enterprise 接口
 */
declare namespace ENTERPRISE {
  /**
   * 企业数据模型
   * @property id - 企业唯一标识
   * @property name - 企业名称
   * @property region - 所在地区（如：北京、上海）
   * @property industry - 所属行业（如：互联网、制造业）
   * @property coreBusiness - 核心业务描述
   * @property reportType - 关联的报告类型名称
   * @property licenseUploaded - 营业执照是否已上传
   * @property reportGenerated - AI报告是否已生成
   * @property published - 报告是否已公示
   * @property createTime - 创建时间
   */
  interface EnterpriseModel {
    id?: number | string;
    name: string;
    region: string;
    industry: string;
    coreBusiness: string;
    reportType: string;
    licenseUploaded: boolean;
    reportGenerated: boolean;
    published: boolean;
    createTime?: string;
  }

  /**
   * 企业表单数据（新增/编辑时使用）
   * 不包含状态字段，仅包含用户可编辑的字段
   */
  interface EnterpriseFormData {
    name: string;
    region: string;
    industry: string;
    coreBusiness: string;
    reportType: string;
    license?: any[];
    otherFiles?: any[];
  }

  /**
   * 数据概览统计数据模型
   * 用于 Dashboard 页面的统计卡片展示
   */
  interface DashboardStats {
    reportTypeCount: number;
    clientCount: number;
    regionCount: number;
    industryCount: number;
  }

  /**
   * 行业分布数据模型
   * 用于 Dashboard 页面的柱状图展示
   */
  interface IndustryDistribution {
    name: string;
    value: number;
  }
}
