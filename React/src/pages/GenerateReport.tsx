import React, { useState } from "react"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Button } from "@/src/components/ui/button"
import { ArrowLeft, FileText, Loader2, UploadCloud, X, CheckCircle } from "lucide-react"
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from "docx"

export default function GenerateReport() {
  const { id } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const enterprise = location.state?.enterprise

  const [reportVersion, setReportVersion] = useState<"basic" | "standard">("basic")
  const [isGenerating, setIsGenerating] = useState(false)
  const [additionalFiles, setAdditionalFiles] = useState<File[]>([])
  const [isSuccess, setIsSuccess] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAdditionalFiles((prev) => [...prev, ...Array.from(e.target.files!)])
    }
  }

  const removeFile = (index: number) => {
    setAdditionalFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const handleGenerate = async () => {
    setIsGenerating(true)
    setIsSuccess(false)

    // Simulate AI generation delay
    await new Promise((resolve) => setTimeout(resolve, 3000))

    // Generate Word Document
    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [
            new Paragraph({
              text: `${enterprise?.name} - ${enterprise?.reportType}`,
              heading: HeadingLevel.HEADING_1,
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: `生成时间: ${new Date().toLocaleDateString()}`,
                  color: "888888",
                }),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: `报告版本: ${reportVersion === "basic" ? "基础版 (15000-25000字)" : "标准版 (＞30000字)"}`,
                  color: "888888",
                }),
              ],
            }),
            new Paragraph({ text: "" }), // Empty line
            new Paragraph({
              text: "1. 企业概况",
              heading: HeadingLevel.HEADING_2,
            }),
            new Paragraph({
              text: `${enterprise?.name} 位于 ${enterprise?.region}，主要在 ${enterprise?.industry} 行业开展业务。核心业务包括：${enterprise?.coreBusiness}。`,
            }),
            new Paragraph({ text: "" }), // Empty line
            new Paragraph({
              text: "2. 行业分析",
              heading: HeadingLevel.HEADING_2,
            }),
            new Paragraph({
              text: `（此处为AI生成的深度行业分析内容...）\n当前 ${enterprise?.industry} 行业正处于快速发展期，市场规模持续扩大。随着技术的不断进步和政策的扶持，该行业的未来前景十分广阔。`,
            }),
            new Paragraph({ text: "" }), // Empty line
            new Paragraph({
              text: "3. 核心竞争力评估",
              heading: HeadingLevel.HEADING_2,
            }),
            new Paragraph({
              text: `（此处为AI生成的企业核心竞争力评估...）\n企业在 ${enterprise?.coreBusiness} 领域具有显著的技术优势和市场份额。通过多年的积累，企业已经建立起了较高的行业壁垒。`,
            }),
            new Paragraph({ text: "" }), // Empty line
            new Paragraph({
              text: "4. 风险提示与建议",
              heading: HeadingLevel.HEADING_2,
            }),
            new Paragraph({
              text: `（此处为AI生成的风险评估及战略建议...）\n建议企业进一步加大研发投入，拓展下沉市场。同时，需警惕宏观经济波动带来的潜在系统性风险。`,
            }),
            ...(reportVersion === "standard"
              ? [
                  new Paragraph({ text: "" }), // Empty line
                  new Paragraph({
                    text: "5. 财务模型预测",
                    heading: HeadingLevel.HEADING_2,
                  }),
                  new Paragraph({
                    text: `（此处为标准版专属的深度财务预测模型...）\n预计未来三年营收复合增长率将达到25%。建议优化资产负债结构，提高资金周转效率。`,
                  }),
                ]
              : []),
          ],
        },
      ],
    })

    // Download the document
    Packer.toBlob(doc).then((blob) => {
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `${enterprise?.name}-${enterprise?.reportType}.docx`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
      
      setIsGenerating(false)
      setIsSuccess(true)
      
      // Reset success state after a few seconds
      setTimeout(() => setIsSuccess(false), 5000)
    })
  }

  if (!enterprise) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-500 mb-4">未找到企业信息</p>
        <Button onClick={() => navigate("/enterprises")}>返回企业列表</Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-[calc(100vh-8rem)] pb-12">
      <div className="flex items-center mb-6 max-w-3xl mx-auto w-full">
        <Button variant="ghost" size="icon" onClick={() => navigate("/enterprises")} className="mr-2">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold text-gray-900">生成AI报告</h1>
      </div>

      <div className="max-w-3xl mx-auto w-full space-y-6">
        {/* Enterprise Info */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">企业信息</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div>
              <span className="text-gray-500 block mb-1">企业名称</span>
              <div className="font-medium text-gray-900 text-base">{enterprise.name}</div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-gray-500 block mb-1">地区</span>
                <div className="font-medium text-gray-900">{enterprise.region}</div>
              </div>
              <div>
                <span className="text-gray-500 block mb-1">行业</span>
                <div className="font-medium text-gray-900">{enterprise.industry}</div>
              </div>
            </div>
            <div>
              <span className="text-gray-500 block mb-1">核心业务</span>
              <div className="font-medium text-gray-900">{enterprise.coreBusiness}</div>
            </div>
            <div>
              <span className="text-gray-500 block mb-1">目标报告类型</span>
              <div className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-600/20">
                {enterprise.reportType}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Report Configuration */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">报告配置与生成</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-700">选择报告版本</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div
                  className={`border rounded-lg p-4 cursor-pointer transition-all ${
                    reportVersion === "basic"
                      ? "border-blue-600 bg-blue-50/50 ring-1 ring-blue-600"
                      : "border-gray-200 hover:border-blue-300"
                  }`}
                  onClick={() => setReportVersion("basic")}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-gray-900">基础版</span>
                    {reportVersion === "basic" && (
                      <div className="h-4 w-4 rounded-full bg-blue-600 border-4 border-white shadow-sm" />
                    )}
                  </div>
                  <p className="text-xs text-gray-500">15,000 - 25,000 字</p>
                  <p className="text-xs text-gray-500 mt-2">包含行业概况、企业基本面分析、核心竞争力评估。</p>
                </div>

                <div
                  className={`border rounded-lg p-4 cursor-pointer transition-all ${
                    reportVersion === "standard"
                      ? "border-blue-600 bg-blue-50/50 ring-1 ring-blue-600"
                      : "border-gray-200 hover:border-blue-300"
                  }`}
                  onClick={() => setReportVersion("standard")}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-gray-900">标准版</span>
                    {reportVersion === "standard" && (
                      <div className="h-4 w-4 rounded-full bg-blue-600 border-4 border-white shadow-sm" />
                    )}
                  </div>
                  <p className="text-xs text-gray-500">＞ 30,000 字</p>
                  <p className="text-xs text-gray-500 mt-2">深度行业研究、财务模型预测、风险评估及战略建议。</p>
                </div>
              </div>
            </div>

            {/* Additional Files Upload */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-700">附加资料上传 (可选)</label>
              <div className="relative border-2 border-dashed border-gray-200 rounded-lg p-8 flex flex-col items-center justify-center text-gray-500 hover:bg-gray-50 hover:border-blue-300 transition-colors cursor-pointer">
                <input
                  type="file"
                  multiple
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={handleFileChange}
                />
                <UploadCloud className="h-10 w-10 mb-3 text-gray-400" />
                <p className="text-sm font-medium text-gray-700">点击或拖拽文件至此处上传</p>
                <p className="text-xs mt-1 text-gray-500">支持 PDF, Word, Excel, 图片等格式，用于辅助AI生成</p>
              </div>

              {additionalFiles.length > 0 && (
                <ul className="mt-4 space-y-2">
                  {additionalFiles.map((file, index) => (
                    <li
                      key={index}
                      className="text-sm flex items-center justify-between bg-gray-50 p-3 rounded-md border border-gray-100"
                    >
                      <div className="flex items-center truncate mr-4">
                        <FileText className="h-4 w-4 mr-2 text-blue-500 flex-shrink-0" />
                        <span className="truncate text-gray-700">{file.name}</span>
                        <span className="ml-2 text-xs text-gray-400 flex-shrink-0">
                          ({(file.size / 1024 / 1024).toFixed(2)} MB)
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-gray-400 hover:text-red-500 flex-shrink-0"
                        onClick={() => removeFile(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="pt-4 border-t border-gray-100">
              <Button
                className={`w-full h-14 text-lg transition-all ${isSuccess ? 'bg-green-600 hover:bg-green-700' : ''}`}
                size="lg"
                onClick={handleGenerate}
                disabled={isGenerating || isSuccess}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                    AI 正在生成并导出 Word 文档...
                  </>
                ) : isSuccess ? (
                  <>
                    <CheckCircle className="mr-2 h-6 w-6" />
                    生成成功！已开始下载
                  </>
                ) : (
                  <>
                    <FileText className="mr-2 h-6 w-6" />
                    一键生成并下载 Word 报告
                  </>
                )}
              </Button>
              <p className="text-center text-xs text-gray-500 mt-3">
                点击生成后，系统将结合企业信息及附加资料，自动生成 Word 格式的报告并下载到本地。
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
