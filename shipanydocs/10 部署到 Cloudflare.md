Cloudflare
ShipAny 使用 OpenNext 框架，支持一键部署到 Cloudflare。

使用 cloudflare 分支
使用 ShipAny 开发新项目时，如果希望部署到 Cloudflare Workers，建议拉取 分支，无需额外修改，支持一键部署。cloudflare

终端

git clone -b cloudflare git@github.com:shipanyai/shipany-template-one.git my-shipany-project
部署流程
在项目根目录创建生产环境配置文件 .env.production
终端

cp .env.example .env.production
按需修改 文件中的配置：项目域名、数据库、登录授权等配置。.env.production

在项目根目录创建 文件wrangler.toml
终端

cp wrangler.toml.example wrangler.toml
把上一步在 文件中配置好的生产环境变量，复制到 文件中的 [vars] 下面，并且修改 文件中的项目名称 .env.productionwrangler.tomlwrangler.tomlname

牧 马

Cloudflare
在项目根目录运行以下命令：

Terminal

npm run cf:deploy
按照提示，输入要部署的项目名称和分支名称(main)，连接上你的 Cloudflare 账号，然后等待部署完成。

cfdeploy

进入 Cloudflare 控制台，可以看到项目已经成功部署
cfconsole

访问项目
使用默认生成的域名可访问项目，绑定自定义域名可正式上线。

cf预览

参考资料
Open-Next 官方文档
NextJS 应用从 Vercel 迁移到 Cloudflare
Last updated on 6月 11， 2025