# 部署指南

这个Jekyll项目可以通过多种方式部署到Vercel。

## 方案1: 直接通过Vercel CLI部署（最简单）

1. 安装Vercel CLI：
```bash
npm i -g vercel
```

2. 在项目根目录运行：
```bash
vercel --prod
```

## 方案2: 通过Vercel网站导入

1. 访问 [vercel.com](https://vercel.com)
2. 点击"New Project"
3. 导入你的GitHub仓库
4. Vercel会自动检测到这是Jekyll项目并进行配置

## 方案3: 使用GitHub Actions自动部署

如果使用GitHub Actions方案，需要在GitHub仓库设置中添加以下Secrets：
- `VERCEL_TOKEN`: 从Vercel账户设置中获取
- `ORG_ID`: 从Vercel项目设置中获取
- `PROJECT_ID`: 从Vercel项目设置中获取

## 本地测试

在部署前，可以本地测试：

```bash
# 安装Ruby依赖
bundle install

# 启动本地服务器
bundle exec jekyll serve

# 或使用npm脚本
npm run dev
```

## 注意事项

1. 确保Ruby版本兼容（推荐3.0+）
2. 如果遇到gem相关问题，可能需要更新Gemfile中的版本
3. Vercel的免费版本有构建时间限制，复杂的Jekyll站点可能需要优化

## 常见问题

- 如果构建失败，检查Jekyll版本兼容性
- 如果样式不显示，检查baseurl配置
- 如果404错误，检查permalink设置 