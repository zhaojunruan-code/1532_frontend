import React, { useState } from "react"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Textarea } from "@/src/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/ui/table"
import { Modal } from "@/src/components/ui/modal"
import { Plus, Edit, Trash2, FolderTree } from "lucide-react"

interface ReportType {
  id: string
  name: string
  directoryCount: number
  updatedAt: string
}

const mockData: ReportType[] = [
  { id: "1", name: "行业研究报告", directoryCount: 12, updatedAt: "2023-10-25" },
  { id: "2", name: "企业尽调报告", directoryCount: 8, updatedAt: "2023-10-26" },
  { id: "3", name: "市场分析报告", directoryCount: 15, updatedAt: "2023-10-27" },
]

export default function ReportTypes() {
  const [types, setTypes] = useState<ReportType[]>(mockData)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isManageModalOpen, setIsManageModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [managingId, setManagingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({ name: "", directoryContent: "" })

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const lines = formData.directoryContent.split('\n').filter(line => line.trim() !== '')
    const newType: ReportType = {
      id: Date.now().toString(),
      name: formData.name,
      directoryCount: lines.length > 0 ? lines.length : (formData.directoryContent ? 1 : 0),
      updatedAt: new Date().toISOString().split('T')[0]
    }
    setTypes([newType, ...types])
    setIsAddModalOpen(false)
    setFormData({ name: "", directoryContent: "" })
  }

  const openEditModal = (type: ReportType) => {
    setFormData({ name: type.name, directoryContent: "" })
    setEditingId(type.id)
    setIsEditModalOpen(true)
  }

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setTypes(types.map(t => t.id === editingId ? { ...t, name: formData.name } : t))
    setIsEditModalOpen(false)
    setEditingId(null)
    setFormData({ name: "", directoryContent: "" })
  }

  const openManageModal = (type: ReportType) => {
    setFormData({ name: type.name, directoryContent: "" })
    setManagingId(type.id)
    setIsManageModalOpen(true)
  }

  const handleManageSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const lines = formData.directoryContent.split('\n').filter(line => line.trim() !== '')
    setTypes(types.map(t => t.id === managingId ? { 
      ...t, 
      directoryCount: lines.length > 0 ? lines.length : t.directoryCount,
      updatedAt: new Date().toISOString().split('T')[0]
    } : t))
    setIsManageModalOpen(false)
    setManagingId(null)
    setFormData({ name: "", directoryContent: "" })
  }

  const handleDelete = (id: string) => {
    if (confirm("确定要删除该报告类型吗？")) {
      setTypes(types.filter(t => t.id !== id))
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">报告类型管理</h1>
        <Button onClick={() => setIsAddModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> 新增类型
        </Button>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>报告名称</TableHead>
              <TableHead>目录资料数量</TableHead>
              <TableHead>最后更新时间</TableHead>
              <TableHead className="text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {types.map((type) => (
              <TableRow key={type.id}>
                <TableCell className="font-medium text-gray-900">{type.name}</TableCell>
                <TableCell>{type.directoryCount} 个章节</TableCell>
                <TableCell>{type.updatedAt}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm" onClick={() => openManageModal(type)}>
                      <FolderTree className="mr-1 h-4 w-4" /> 管理目录
                    </Button>
                    <Button variant="ghost" size="icon" className="text-blue-600" onClick={() => openEditModal(type)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-red-600" onClick={() => handleDelete(type.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {types.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center text-gray-500">
                  暂无数据
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="新增报告类型">
        <form onSubmit={handleAddSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">报告名称 <span className="text-red-500">*</span></label>
            <Input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="请输入报告类型名称" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">目录内容输入</label>
            <Textarea 
              value={formData.directoryContent} 
              onChange={e => setFormData({...formData, directoryContent: e.target.value})} 
              placeholder="请输入目录内容，每行一个章节..." 
              className="min-h-[120px]"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">或上传目录文件</label>
            <Input type="file" accept=".txt,.doc,.docx,.pdf" className="cursor-pointer" onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                setFormData({...formData, directoryContent: `已选择文件: ${e.target.files[0].name}\n(模拟解析内容...)`})
              }
            }} />
          </div>
          <div className="pt-4 flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)}>取消</Button>
            <Button type="submit">保存</Button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="编辑报告类型">
        <form onSubmit={handleEditSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">报告名称 <span className="text-red-500">*</span></label>
            <Input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="请输入报告类型名称" />
          </div>
          <div className="pt-4 flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setIsEditModalOpen(false)}>取消</Button>
            <Button type="submit">保存</Button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={isManageModalOpen} onClose={() => setIsManageModalOpen(false)} title="管理目录">
        <form onSubmit={handleManageSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">目录内容</label>
            <Textarea 
              value={formData.directoryContent} 
              onChange={e => setFormData({...formData, directoryContent: e.target.value})} 
              placeholder="请输入目录内容，每行一个章节..." 
              className="min-h-[200px]"
            />
          </div>
          <div className="pt-4 flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setIsManageModalOpen(false)}>取消</Button>
            <Button type="submit">保存</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
