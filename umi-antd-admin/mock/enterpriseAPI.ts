/**
 * 企业资料库 Mock API
 * 模拟后端企业管理相关接口，提供前端开发阶段的数据支持
 * 数据与 React 原型中的 mockData 保持一致
 */

/** 辅助函数：模拟网络延迟 */
const sleep = (ms: number) =>
  new Promise<void>((resolve) => {
    setTimeout(() => resolve(), ms);
  });

/**
 * 企业列表 Mock 数据
 * 与 React 原型 Enterprises.tsx 中的 mockData 对应
 */
const enterpriseList: ENTERPRISE.EnterpriseModel[] = [
  {
    id: '1',
    name: '北京科技创新有限公司',
    region: '北京',
    industry: '互联网',
    coreBusiness: '人工智能研发',
    reportType: '行业研究报告',
    licenseUploaded: true,
    reportGenerated: true,
    published: true,
    createTime: '2023-10-01',
  },
  {
    id: '2',
    name: '上海制造集团',
    region: '上海',
    industry: '制造业',
    coreBusiness: '汽车零部件生产',
    reportType: '企业尽调报告',
    licenseUploaded: true,
    reportGenerated: false,
    published: false,
    createTime: '2023-10-05',
  },
  {
    id: '3',
    name: '深圳金融服务公司',
    region: '深圳',
    industry: '金融',
    coreBusiness: '供应链金融',
    reportType: '市场分析报告',
    licenseUploaded: true,
    reportGenerated: true,
    published: false,
    createTime: '2023-10-10',
  },
  {
    id: '4',
    name: '杭州电商科技有限公司',
    region: '杭州',
    industry: '互联网',
    coreBusiness: '跨境电商平台',
    reportType: '市场分析报告',
    licenseUploaded: true,
    reportGenerated: false,
    published: false,
    createTime: '2023-10-15',
  },
  {
    id: '5',
    name: '广州医疗器械厂',
    region: '广州',
    industry: '医疗',
    coreBusiness: '高端医疗设备制造',
    reportType: '行业研究报告',
    licenseUploaded: false,
    reportGenerated: false,
    published: false,
    createTime: '2023-10-20',
  },
];

export default {
  /** 企业分页列表查询 */
  'POST /api/admin/enterprise/pages': async (req: any, res: any) => {
    await sleep(500);
    res.json({
      code: 0,
      message: '',
      data: {
        data: enterpriseList,
        success: true,
        total: enterpriseList.length,
      } as ProTableResult,
    });
  },

  /** 新增企业 */
  'POST /api/admin/enterprise/add': async (req: any, res: any) => {
    await sleep(500);
    res.json({
      code: 0,
      message: '',
      data: true,
    });
  },

  /** 更新企业信息 */
  'POST /api/admin/enterprise/update': (req: any, res: any) => {
    res.json({
      code: 0,
      message: '',
      data: true,
    });
  },

  /** 删除企业 */
  'POST /api/admin/enterprise/delete': async (req: any, res: any) => {
    await sleep(500);
    res.json({
      code: 0,
      message: '',
      data: true,
    });
  },

  /** 获取企业详情 */
  'POST /api/admin/enterprise/detail': (req: any, res: any) => {
    res.json({
      code: 0,
      message: '',
      data: enterpriseList[0],
    });
  },

  /** 公示企业报告 */
  'POST /api/admin/enterprise/publish': (req: any, res: any) => {
    res.json({
      code: 0,
      message: '',
      data: true,
    });
  },

  /** 生成 AI 报告 */
  'POST /api/admin/enterprise/generateReport': async (req: any, res: any) => {
    await sleep(3000);
    res.json({
      code: 0,
      message: '',
      data: true,
    });
  },

  /** 获取 Dashboard 统计数据 */
  'POST /api/admin/enterprise/dashboardStats': async (req: any, res: any) => {
    await sleep(300);
    res.json({
      code: 0,
      message: '',
      data: {
        reportTypeCount: 24,
        clientCount: 1245,
        regionCount: 34,
        industryCount: 18,
      },
    });
  },

  /** 获取行业分布数据 */
  'POST /api/admin/enterprise/industryDistribution': async (
    req: any,
    res: any,
  ) => {
    await sleep(300);
    res.json({
      code: 0,
      message: '',
      data: [
        { name: '互联网', value: 120 },
        { name: '制造业', value: 85 },
        { name: '金融', value: 60 },
        { name: '医疗', value: 45 },
        { name: '教育', value: 30 },
        { name: '零售', value: 70 },
      ],
    });
  },
};
