部署到 Vercel
部署流程
先在本地开发好你自己的项目，代码提交到 Github 私有仓库。

在 Vercel 控制台创建新项目，导入代码仓库，一键部署

vercel-new-项目

等构建完成，即可在 Vercel 控制台看到你的项目
vercel-console

打开域名，即可访问你的项目
你也可以在 Vercel 控制台，添加自定义域名

vercel-preview

修改环境变量
先在本地编辑好 的内容，填写生产环境配置，再复制粘贴到 Vercel 的环境变量中。.env.production

下一次推送代码，自动重新部署，应用新的环境变量

vercel-env

参考资料
Deploy to Vercel
Last updated on 