import { Link, Outlet, useLocation } from "react-router-dom"
import { LayoutDashboard, Database, FileText, Settings, LogOut } from "lucide-react"
import { cn } from "@/src/lib/utils"

export function Layout() {
  const location = useLocation()

  const navItems = [
    { name: "首页", path: "/", icon: LayoutDashboard },
    { name: "企业资料库", path: "/enterprises", icon: Database },
    { name: "报告类型管理", path: "/report-types", icon: FileText },
    { name: "权限管理", path: "/permissions", icon: Settings },
  ]

  return (
    <div className="flex h-screen w-full bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 border-r border-gray-200 bg-white flex flex-col">
        <div className="flex h-16 items-center px-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-blue-600">报告生成系统</h1>
        </div>
        <nav className="flex-1 space-y-1 p-4 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path || (location.pathname.startsWith(item.path) && item.path !== "/")
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                )}
              >
                <Icon className={cn("h-5 w-5", isActive ? "text-blue-700" : "text-gray-400")} />
                {item.name}
              </Link>
            )
          })}
        </nav>
        <div className="p-4 border-t border-gray-200">
          <button className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors">
            <LogOut className="h-5 w-5 text-gray-400" />
            退出登录
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6">
          <h2 className="text-lg font-medium text-gray-800">
            {navItems.find(i => location.pathname === i.path || (location.pathname.startsWith(i.path) && i.path !== "/"))?.name || "系统"}
          </h2>
          <div className="flex items-center gap-4">
            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-semibold">
              A
            </div>
            <span className="text-sm font-medium text-gray-700">总管理员</span>
          </div>
        </header>
        <div className="flex-1 overflow-auto p-6">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
