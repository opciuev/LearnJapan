# 管理功能设置指南

这个项目现在支持通过网页界面管理语法和表达式内容，无需手动编辑YAML文件。

## 功能特性

- ✅ 在线添加、编辑、删除语法项目
- ✅ 在线添加、编辑、删除表达式
- ✅ 支持多个例句管理
- ✅ 搜索和分页功能
- ✅ 响应式设计，支持手机访问
- ✅ 直接修改GitHub仓库，自动触发重新部署

## 设置步骤

### 1. 创建GitHub Personal Access Token

1. 访问 https://github.com/settings/tokens
2. 点击 "Generate new token (classic)"
3. 设置Token名称，如："LearnJapan Admin"
4. 选择过期时间（建议选择较长时间或无过期）
5. 选择权限：
   - 如果仓库是**公开的**：只勾选 `public_repo`
   - 如果仓库是**私有的**：勾选 `repo`
6. 点击 "Generate token"
7. **重要**：复制生成的token（格式：`ghp_xxxxxxxxxx`），这是唯一一次显示

### 2. 在Vercel中设置环境变量

1. 登录 [Vercel Dashboard](https://vercel.com/dashboard)
2. 找到你的LearnJapan项目
3. 进入项目设置 → "Environment Variables"
4. 添加以下环境变量：

| 变量名 | 值 | 说明 |
|--------|-----|------|
| `GITHUB_TOKEN` | `ghp_你的token` | GitHub访问令牌 |
| `GITHUB_OWNER` | `你的GitHub用户名` | 仓库所有者 |
| `GITHUB_REPO` | `LearnJapan` | 仓库名称 |

### 3. 重新部署

设置环境变量后，在Vercel中手动触发一次重新部署，或者推送新代码到GitHub。

## 使用方法

### 访问管理界面

部署完成后，访问：`https://你的域名/admin.html`

### 管理语法

1. 点击"语法管理"标签
2. 可以搜索现有语法项目
3. 点击"添加语法"创建新项目
4. 点击"编辑"修改现有项目
5. 点击"删除"删除项目

### 管理表达式

1. 点击"表达式管理"标签
2. 操作方式与语法管理相同

### 添加例句

在编辑界面中：
1. 点击"添加例句"按钮
2. 填写日语例句和中文翻译
3. 选择例句类型（句子/对话/问答）
4. 可以添加多个例句

## 工作原理

1. **编辑内容** → 管理界面
2. **保存修改** → 调用Vercel API
3. **更新文件** → 通过GitHub API直接修改YAML文件
4. **自动部署** → GitHub通知Vercel重新构建
5. **内容生效** → 2-3分钟后网站更新

## 安全说明

- GitHub Token只存储在Vercel环境变量中，不会暴露给用户
- 所有修改都会在GitHub中留下提交记录
- 可以随时在GitHub设置中撤销Token
- 建议定期更换Token

## 故障排除

### 无法加载数据
- 检查环境变量是否正确设置
- 确认GitHub Token有效且权限正确
- 查看Vercel部署日志

### 保存失败
- 检查网络连接
- 确认GitHub Token未过期
- 查看浏览器控制台错误信息

### 修改未生效
- 等待2-3分钟让Vercel重新部署
- 检查GitHub仓库是否有新的提交记录
- 清除浏览器缓存

## 注意事项

1. **备份数据**：虽然GitHub有版本控制，但建议定期备份重要数据
2. **权限管理**：Token具有写入权限，请妥善保管
3. **并发编辑**：避免多人同时编辑同一文件
4. **文件格式**：系统会自动维护YAML格式，无需手动调整

## 技术细节

- 使用Vercel Serverless Functions处理API请求
- 通过GitHub API直接操作仓库文件
- 保持Jekyll静态网站的性能优势
- 支持搜索、分页等高级功能
