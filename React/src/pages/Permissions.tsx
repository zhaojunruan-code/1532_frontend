import React, { useState } from "react"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Select } from "@/src/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/ui/table"
import { Modal } from "@/src/components/ui/modal"
import { Plus, Edit, Trash2, Shield, UserCog } from "lucide-react"

interface User {
  id: string
  username: string
  role: "admin" | "sub-admin"
  status: "active" | "disabled"
  createdAt: string
}

const mockData: User[] = [
  { id: "1", username: "admin_super", role: "admin", status: "active", createdAt: "2023-01-01" },
  { id: "2", username: "sub_account_1", role: "sub-admin", status: "active", createdAt: "2023-10-15" },
  { id: "3", username: "sub_account_2", role: "sub-admin", status: "disabled", createdAt: "2023-10-20" },
]

export default function Permissions() {
  const [users, setUsers] = useState<User[]>(mockData)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({ username: "", password: "", role: "sub-admin" })

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newUser: User = {
      id: Date.now().toString(),
      username: formData.username,
      role: formData.role as "admin" | "sub-admin",
      status: "active",
      createdAt: new Date().toISOString().split('T')[0]
    }
    setUsers([...users, newUser])
    setIsAddModalOpen(false)
    setFormData({ username: "", password: "", role: "sub-admin" })
  }

  const openEditModal = (user: User) => {
    setFormData({ username: user.username, password: "", role: user.role })
    setEditingId(user.id)
    setIsEditModalOpen(true)
  }

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setUsers(users.map(u => 
      u.id === editingId ? { ...u, username: formData.username, role: formData.role as "admin" | "sub-admin" } : u
    ))
    setIsEditModalOpen(false)
    setEditingId(null)
    setFormData({ username: "", password: "", role: "sub-admin" })
  }

  const handleDelete = (id: string) => {
    if (confirm("确定要删除该账号吗？")) {
      setUsers(users.filter(u => u.id !== id))
    }
  }

  const toggleStatus = (id: string) => {
    setUsers(users.map(u => {
      if (u.id === id) {
        return { ...u, status: u.status === "active" ? "disabled" : "active" }
      }
      return u
    }))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">权限管理</h1>
        <Button onClick={() => setIsAddModalOpen(true)}>
          <UserCog className="mr-2 h-4 w-4" /> 添加子账号
        </Button>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>账号名称</TableHead>
              <TableHead>角色权限</TableHead>
              <TableHead>状态</TableHead>
              <TableHead>创建时间</TableHead>
              <TableHead className="text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium text-gray-900 flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                    <Shield className={`h-4 w-4 ${user.role === 'admin' ? 'text-blue-600' : 'text-gray-500'}`} />
                  </div>
                  {user.username}
                </TableCell>
                <TableCell>
                  {user.role === "admin" ? (
                    <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-600/20">
                      总管理员
                    </span>
                  ) : (
                    <span className="inline-flex items-center rounded-full bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
                      子账号
                    </span>
                  )}
                </TableCell>
                <TableCell>
                  {user.status === "active" ? (
                    <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                      正常
                    </span>
                  ) : (
                    <span className="inline-flex items-center rounded-full bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10">
                      已停用
                    </span>
                  )}
                </TableCell>
                <TableCell>{user.createdAt}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    {user.role !== "admin" && (
                      <>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => toggleStatus(user.id)}
                        >
                          {user.status === "active" ? "停用" : "启用"}
                        </Button>
                        <Button variant="ghost" size="icon" className="text-blue-600" onClick={() => openEditModal(user)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-red-600" onClick={() => handleDelete(user.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="添加子账号">
        <form onSubmit={handleAddSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">账号名称 <span className="text-red-500">*</span></label>
            <Input required value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} placeholder="请输入登录账号" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">初始密码 <span className="text-red-500">*</span></label>
            <Input type="password" required value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} placeholder="请输入初始密码" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">角色权限 <span className="text-red-500">*</span></label>
            <Select required value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})}>
              <option value="sub-admin">子账号 (受限访问)</option>
              <option value="admin">管理员 (完全访问)</option>
            </Select>
          </div>
          <div className="pt-4 flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)}>取消</Button>
            <Button type="submit">保存</Button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="编辑账号">
        <form onSubmit={handleEditSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">账号名称 <span className="text-red-500">*</span></label>
            <Input required value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} placeholder="请输入登录账号" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">重置密码 (可选)</label>
            <Input type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} placeholder="留空则不修改密码" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">角色权限 <span className="text-red-500">*</span></label>
            <Select required value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})}>
              <option value="sub-admin">子账号 (受限访问)</option>
              <option value="admin">管理员 (完全访问)</option>
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
