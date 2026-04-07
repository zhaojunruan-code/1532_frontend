import React, { useState, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Select } from "@/src/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/ui/table"
import { Modal } from "@/src/components/ui/modal"
import { Card, CardContent } from "@/src/components/ui/card"
import { Plus, Search, Edit, Trash2, FileText, CheckCircle, Download, Building2, FileCheck2, Globe, Filter } from "lucide-react"

interface Enterprise {
  id: string
  name: string
  region: string
  industry: string
  coreBusiness: string
  reportType: string
  licenseUploaded: boolean
  reportGenerated: boolean
  published: boolean
}

const mockData: Enterprise[] = [
  { id: "1", name: "北京科技创新有限公司", region: "北京", industry: "互联网", coreBusiness: "人工智能研发", reportType: "行业研究报告", licenseUploaded: true, reportGenerated: true, published: true },
  { id: "2", name: "上海制造集团", region: "上海", industry: "制造业", coreBusiness: "汽车零部件生产", reportType: "企业尽调报告", licenseUploaded: true, reportGenerated: false, published: false },
  { id: "3", name: "深圳金融服务公司", region: "深圳", industry: "金融", coreBusiness: "供应链金融", reportType: "市场分析报告", licenseUploaded: true, reportGenerated: true, published: false },
  { id: "4", name: "杭州电商科技有限公司", region: "杭州", industry: "互联网", coreBusiness: "跨境电商平台", reportType: "市场分析报告", licenseUploaded: true, reportGenerated: false, published: false },
  { id: "5", name: "广州医疗器械厂", region: "广州", industry: "医疗", coreBusiness: "高端医疗设备制造", reportType: "行业研究报告", licenseUploaded: false, reportGenerated: false, published: false },
]

export default function Enterprises() {
  const navigate = useNavigate()
  const [enterprises, setEnterprises] = useState<Enterprise[]>(mockData)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  
  // Filters
  const [searchTerm, setSearchTerm] = useState("")
  const [filterIndustry, setFilterIndustry] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    region: "",
    industry: "",
    coreBusiness: "",
    reportType: "",
  })

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newEnterprise: Enterprise = {
      id: Date.now().toString(),
      ...formData,
      licenseUploaded: true, // Mocking upload
      reportGenerated: false,
      published: false,
    }
    setEnterprises([newEnterprise, ...enterprises])
    setIsAddModalOpen(false)
    setFormData({ name: "", region: "", industry: "", coreBusiness: "", reportType: "" })
  }

  const openEditModal = (enterprise: Enterprise) => {
    setFormData({
      name: enterprise.name,
      region: enterprise.region,
      industry: enterprise.industry,
      coreBusiness: enterprise.coreBusiness,
      reportType: enterprise.reportType,
    })
    setEditingId(enterprise.id)
    setIsEditModalOpen(true)
  }

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setEnterprises(enterprises.map(emp => 
      emp.id === editingId ? { ...emp, ...formData } : emp
    ))
    setIsEditModalOpen(false)
    setEditingId(null)
    setFormData({ name: "", region: "", industry: "", coreBusiness: "", reportType: "" })
  }

  const handleDownload = (enterprise: Enterprise) => {
    const content = `企业名称: ${enterprise.name}\n地区: ${enterprise.region}\n行业: ${enterprise.industry}\n核心业务: ${enterprise.coreBusiness}\n报告类型: ${enterprise.reportType}\n\n报告内容...\n（此为系统自动生成的报告文件）`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${enterprise.name}-${enterprise.reportType}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  const handleDelete = (id: string) => {
    if (confirm("确定要删除该企业吗？")) {
      setEnterprises(enterprises.filter(e => e.id !== id))
    }
  }

  const handlePublish = (id: string) => {
    setEnterprises(enterprises.map(e => e.id === id ? { ...e, published: true } : e))
  }

  // Derived data
  const filteredEnterprises = useMemo(() => {
    return enterprises.filter(e => {
      const matchSearch = e.name.toLowerCase().includes(searchTerm.toLowerCase()) || e.coreBusiness.toLowerCase().includes(searchTerm.toLowerCase())
      const matchIndustry = filterIndustry === "all" || e.industry === filterIndustry
      const matchStatus = 
        filterStatus === "all" ? true :
        filterStatus === "published" ? e.published :
        filterStatus === "generated" ? (e.reportGenerated && !e.published) :
        filterStatus === "pending" ? !e.reportGenerated : true

      return matchSearch && matchIndustry && matchStatus
    })
  }, [enterprises, searchTerm, filterIndustry, filterStatus])

  const stats = {
    total: enterprises.length,
    generated: enterprises.filter(e => e.reportGenerated).length,
    published: enterprises.filter(e => e.published).length
  }

  const uniqueIndustries = Array.from(new Set(enterprises.map(e => e.industry)))

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">企业资料库</h1>
          <p className="text-sm text-gray-500 mt-1">管理所有企业客户信息、生成报告及公示状态</p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)} className="shrink-0 shadow-sm">
          <Plus className="mr-2 h-4 w-4" /> 新增企业
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-white border-gray-200 shadow-sm">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
              <Building2 className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">总企业数</p>
              <h3 className="text-2xl font-bold text-gray-900">{stats.total}</h3>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white border-gray-200 shadow-sm">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-green-50 flex items-center justify-center text-green-600">
              <FileCheck2 className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">已生成报告</p>
              <h3 className="text-2xl font-bold text-gray-900">{stats.generated}</h3>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white border-gray-200 shadow-sm">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-purple-50 flex items-center justify-center text-purple-600">
              <Globe className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">已公示企业</p>
              <h3 className="text-2xl font-bold text-gray-900">{stats.published}</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Data Card */}
      <Card className="shadow-sm border-gray-200 overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-gray-200 bg-gray-50/50 flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="relative w-full sm:max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="搜索企业名称或核心业务..." 
              className="pl-9 bg-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Filter className="h-4 w-4 text-gray-400 hidden sm:block" />
              <Select value={filterIndustry} onChange={(e) => setFilterIndustry(e.target.value)} className="w-full sm:w-[140px] bg-white">
                <option value="all">所有行业</option>
                {uniqueIndustries.map(ind => (
                  <option key={ind} value={ind}>{ind}</option>
                ))}
              </Select>
            </div>
            <Select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="w-full sm:w-[140px] bg-white">
              <option value="all">所有状态</option>
              <option value="pending">待生成</option>
              <option value="generated">已生成(未公示)</option>
              <option value="published">已公示</option>
            </Select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-gray-50/80">
              <TableRow>
                <TableHead className="w-[220px]">企业信息</TableHead>
                <TableHead>行业与业务</TableHead>
                <TableHead>报告配置</TableHead>
                <TableHead>当前状态</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEnterprises.map((enterprise) => (
                <TableRow key={enterprise.id} className="hover:bg-gray-50/50 transition-colors">
                  <TableCell>
                    <div className="font-medium text-gray-900">{enterprise.name}</div>
                    <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-gray-300"></span>
                      {enterprise.region}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-gray-900">{enterprise.industry}</div>
                    <div className="text-xs text-gray-500 mt-1 max-w-[180px] truncate" title={enterprise.coreBusiness}>
                      {enterprise.coreBusiness}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-gray-900">{enterprise.reportType}</div>
                    <div className="mt-1">
                      {enterprise.licenseUploaded ? (
                        <span className="inline-flex items-center text-[11px] font-medium text-green-600">
                          <CheckCircle className="mr-1 h-3 w-3" /> 资料已齐
                        </span>
                      ) : (
                        <span className="inline-flex items-center text-[11px] font-medium text-amber-600">
                          资料缺失
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1.5 items-start">
                      {enterprise.published ? (
                        <span className="inline-flex items-center rounded-full bg-purple-50 px-2 py-1 text-xs font-medium text-purple-700 ring-1 ring-inset ring-purple-600/20">
                          已公示
                        </span>
                      ) : enterprise.reportGenerated ? (
                        <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                          报告已生成
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
                          待生成
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      {!enterprise.reportGenerated ? (
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="text-blue-600 border-blue-200 hover:bg-blue-50 h-8"
                          onClick={() => navigate(`/enterprises/generate/${enterprise.id}`, { state: { enterprise } })}
                        >
                          <FileText className="mr-1 h-3.5 w-3.5" /> 生成报告
                        </Button>
                      ) : (
                        <>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="text-green-600 border-green-200 hover:bg-green-50 h-8"
                            onClick={() => handleDownload(enterprise)}
                          >
                            <Download className="mr-1 h-3.5 w-3.5" /> 下载
                          </Button>
                          {!enterprise.published && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="h-8"
                              onClick={() => handlePublish(enterprise.id)}
                            >
                              公示
                            </Button>
                          )}
                        </>
                      )}
                      <div className="h-4 w-px bg-gray-200 mx-1"></div>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-blue-600" onClick={() => openEditModal(enterprise)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-red-600" onClick={() => handleDelete(enterprise.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filteredEnterprises.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="h-32 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-500">
                      <Search className="h-8 w-8 text-gray-300 mb-2" />
                      <p>未找到匹配的企业数据</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        
        {/* Pagination / Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50/50 flex items-center justify-between text-sm text-gray-500">
          <div>
            共 <span className="font-medium text-gray-900">{filteredEnterprises.length}</span> 条记录
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled className="h-8">上一页</Button>
            <Button variant="outline" size="sm" disabled className="h-8">下一页</Button>
          </div>
        </div>
      </Card>

      {/* Modals */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="新增企业">
        <form onSubmit={handleAddSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">企业名称 <span className="text-red-500">*</span></label>
            <Input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="请输入企业名称" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">地区 <span className="text-red-500">*</span></label>
              <Input required value={formData.region} onChange={e => setFormData({...formData, region: e.target.value})} placeholder="如：北京" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">所在行业 <span className="text-red-500">*</span></label>
              <Input required value={formData.industry} onChange={e => setFormData({...formData, industry: e.target.value})} placeholder="如：互联网" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">核心业务 <span className="text-red-500">*</span></label>
            <Input required value={formData.coreBusiness} onChange={e => setFormData({...formData, coreBusiness: e.target.value})} placeholder="请输入核心业务" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">报告类型 <span className="text-red-500">*</span></label>
            <Select required value={formData.reportType} onChange={e => setFormData({...formData, reportType: e.target.value})}>
              <option value="">请选择报告类型</option>
              <option value="行业研究报告">行业研究报告</option>
              <option value="企业尽调报告">企业尽调报告</option>
              <option value="市场分析报告">市场分析报告</option>
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">营业执照上传 <span className="text-red-500">*</span></label>
            <Input type="file" required accept="image/*,.pdf" className="cursor-pointer" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">其他资料上传</label>
            <Input type="file" multiple className="cursor-pointer" />
          </div>
          <div className="pt-4 flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)}>取消</Button>
            <Button type="submit">保存</Button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="编辑企业">
        <form onSubmit={handleEditSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">企业名称 <span className="text-red-500">*</span></label>
            <Input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="请输入企业名称" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">地区 <span className="text-red-500">*</span></label>
              <Input required value={formData.region} onChange={e => setFormData({...formData, region: e.target.value})} placeholder="如：北京" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">所在行业 <span className="text-red-500">*</span></label>
              <Input required value={formData.industry} onChange={e => setFormData({...formData, industry: e.target.value})} placeholder="如：互联网" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">核心业务 <span className="text-red-500">*</span></label>
            <Input required value={formData.coreBusiness} onChange={e => setFormData({...formData, coreBusiness: e.target.value})} placeholder="请输入核心业务" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">报告类型 <span className="text-red-500">*</span></label>
            <Select required value={formData.reportType} onChange={e => setFormData({...formData, reportType: e.target.value})}>
              <option value="">请选择报告类型</option>
              <option value="行业研究报告">行业研究报告</option>
              <option value="企业尽调报告">企业尽调报告</option>
              <option value="市场分析报告">市场分析报告</option>
            </Select>
          </div>
          <div className="pt-4 flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setIsEditModalOpen(false)}>取消</Button>
            <Button type="submit">保存</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
