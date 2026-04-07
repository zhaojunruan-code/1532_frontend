/**
 * 报告类型管理相关类型定义
 * 对应 React 原型中的 ReportType 接口
 */
declare namespace REPORT_TYPE {
  /**
   * 报告类型数据模型
   * @property id - 报告类型唯一标识
   * @property name - 报告类型名称（如：行业研究报告、企业尽调报告）
   * @property directoryCount - 包含的目录章节数量
   * @property updatedAt - 最后更新时间
   */
  interface ReportTypeModel {
    id?: number | string;
    name: string;
    directoryCount: number;
    updatedAt: string;
  }

  /**
   * 报告类型表单数据（新增/编辑时使用）
   */
  interface ReportTypeFormData {
    name: string;
    directoryContent?: string;
  }
}
