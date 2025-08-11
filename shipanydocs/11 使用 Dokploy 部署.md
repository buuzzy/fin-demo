使用 Dokploy 部署
ShipAny 支持使用 Dokploy 部署。

在此之前，你需要按照 Dokploy 官方文档的说明，在你的服务器安装 Dokploy 服务。

你需要先按照 快速开始 的步骤，在本地拉取 shipany-template-one 模板代码，修改好后上传到你自己的 Github 仓库。

部署流程
在 Dokploy 管理后台创建项目


进入项目，绑定你的 Github 账号，选择基于 shipany-template-one 模板创建的仓库，保存配置


继续配置，填写构建信息，点击保存


把项目 文件中的内容，复制粘贴到 Environment，设置环境变量.env.production


点击部署按钮，等待部署完成


进入 Domains 页面，绑定自定义域名


DNS 解析域名到你的 Dokploy 服务器公网 ip，等到解析生效，打开域名即可访问你的网站
参考资料
Dokploy 官方文档
Last updated on 6月 11， 2025