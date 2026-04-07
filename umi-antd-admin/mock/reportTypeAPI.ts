/**
 * 报告类型管理 Mock API
 * 模拟后端报告类型相关接口
 * 数据与 React 原型中 ReportTypes.tsx 的 mockData 对应
 */

/** 辅助函数：模拟网络延迟 */
const sleep = (ms: number) =>
  new Promise<void>((resolve) => {
    setTimeout(() => resolve(), ms);
  });

/**
 * 报告类型列表 Mock 数据
 * 与 React 原型 ReportTypes.tsx 中的 mockData 保持一致
 */
const reportTypeList: REPORT_TYPE.ReportTypeModel[] = [
  { id: '1', name: '行业研究报告', directoryCount: 12, updatedAt: '2023-10-25' },
  { id: '2', name: '企业尽调报告', directoryCount: 8, updatedAt: '2023-10-26' },
  { id: '3', name: '市场分析报告', directoryCount: 15, updatedAt: '2023-10-27' },
];

export default {
  /** 报告类型分页列表查询 */
  'POST /api/admin/reportType/pages': async (req: any, res: any) => {
    await sleep(500);
    res.json({
      code: 0,
      message: '',
      data: {
        data: reportTypeList,
        success: true,
        total: reportTypeList.length,
      } as ProTableResult,
    });
  },

  /** 获取所有报告类型（用于下拉选择） */
  'POST /api/admin/reportType/list': async (req: any, res: any) => {
    await sleep(300);
    res.json({
      code: 0,
      message: '',
      data: reportTypeList,
    });
  },

  /** 新增报告类型 */
  'POST /api/admin/reportType/add': async (req: any, res: any) => {
    await sleep(500);
    res.json({
      code: 0,
      message: '',
      data: true,
    });
  },

  /** 更新报告类型 */
  'POST /api/admin/reportType/update': (req: any, res: any) => {
    res.json({
      code: 0,
      message: '',
      data: true,
    });
  },

  /** 删除报告类型 */
  'POST /api/admin/reportType/delete': async (req: any, res: any) => {
    await sleep(500);
    res.json({
      code: 0,
      message: '',
      data: true,
    });
  },

  /** 更新报告类型目录 */
  'POST /api/admin/reportType/updateDirectory': (req: any, res: any) => {
    res.json({
      code: 0,
      message: '',
      data: true,
    });
  },
};
