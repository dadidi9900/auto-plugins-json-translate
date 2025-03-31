# JSON i18n 翻译工具

**🌐 专门适配 auto-i18n-translation-plugins 的 AI 驱动翻译工具**

**🔗 项目地址**  
专门用于处理 [auto-i18n-translation-plugins](https://github.com/wenps/auto-i18n-translation-plugins/) 生成的 JSON 文件的翻译工具

**🎯 使用 Cursor AI 辅助开发**  
本项目全程使用 [Cursor](https://cursor.sh/) 进行开发，充分利用 AI 能力提升开发效率

## ✨ 特性

* 🤖 基于 DeepSeek AI 的智能翻译
* 🔄 完美保持 JSON 结构完整性
* 🌍 支持多语言翻译
* ⚡️ 实时翻译预览
* 🛡️ API 密钥本地使用，注重安全
* 📦 支持批量导出翻译结果
* 💻 完全开源，代码透明
* 🔄 支持断点续传
* 📝 支持本地缓存

## 🚀 快速开始

### 环境要求

* Node.js >= 16.0.0
* npm 或 yarn 或 pnpm
* DeepSeek API 密钥

### 安装

```bash
git clone [项目地址]
cd [项目目录]
npm install
```

### 开发

```bash
npm run dev
```

访问 `http://localhost:5173` 查看开发环境。

## 📖 使用指南

1. **准备工作**
   * 使用 [auto-i18n-translation-plugins](https://github.com/wenps/auto-i18n-translation-plugins/) 生成需要翻译的 JSON 文件
   * 获取 DeepSeek API 密钥

2. **开始使用**
   * 访问网站
   * 上传 auto-i18n-translation-plugins 生成的 JSON 文件
   * 选择目标语言
   * 输入 API 密钥
   * 点击开始翻译

3. **功能说明**
   * 支持单个 JSON 文件翻译
   * 实时预览翻译结果
   * 支持导出 JSON 格式
   * 自动拆分 JSON 文件大小适配API 8K token 输出限制 (未测试)

## 🛠 技术栈

* **开发工具**: 
  * [Cursor](https://cursor.sh/) (AI 辅助开发)
* **框架**: Vue 3
* **UI**: Element Plus
* **语言**: TypeScript
* **API**: DeepSeek API
* **工具库**:
  * Vue Router
  * Pinia
  * Element Plus
  * Axios

## 🤝 贡献指南

欢迎所有形式的贡献，无论是新功能、bug 修复还是文档改进。


## 📝 开源协议

本项目采用 MIT 协议

## 🙋 常见问题

**Q: API 密钥安全吗？**  
A: 是的。API 密钥仅在浏览器中临时使用，不会保存或传输到服务器。

**Q: 支持哪些语言？**  
A: 支持多种主流语言，包括但不限于：
* 中文(简体/繁体)
* 英语
* 日语
* 韩语
* 法语
* 德语
* 西班牙语
* 俄语等

