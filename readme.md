# cosine-pic-bot

从 [SomeACG/cosine-pic-bot](https://github.com/SomeACG/cosine-pic-bot) 抽离而来的 template 保留了一些开发 bot 需要的通用配置和依赖，可以按需去掉

- 使用 [grammy](https://grammy.dev/) 调用 telegram api
- 使用 pino 进行日志记录
- 使用 prisma + SQLite 进行数据库操作
- 使用 [@aws-sdk/client-s3](https://github.com/aws-sdk-js-v3/aws-sdk-js-v3/tree/main/packages/client-s3) 进行 SQLite 数据库 S3 备份（可选）

## 开发步骤

启动

```bash
pnpm i
pnpm db:init # 如果是全新启动，第一次启动前使用，初始化数据库， 见 [prisma](https://www.prisma.io/docs/orm/prisma-migrate/workflows/development-and-production#create-and-apply-migrations)

pnpm pm2 # pm2 启动守护进程，配置文件见 ecosystem.config.js
#or
pnpm start # 直接终端起方便调试，可以 Ctrl+C 中断
```

其他命令（问就是个人习惯）：

```bash
pnpm pm2:stop # pm2 stop ecosystem.config.js
pnpm pm2:restart # pm2 restart ecosystem.config.js
pnpm pm2:log # pm2 log ecosystem.config.js
```

.env.example 复制一份重命名为 .env
填入自己 bot 的环境变量

```bash
BOT_TOKEN=                  # TG 机器人token
ADMIN_CHAT_ID=[]              # 管理员的 Chat ID 数组，可添加多个管理员，管理员可执行post操作
ADMIN_USERNAME=@YourUsername    # admin username 别人投稿的时候艾特
DATABASE_URL="file:./data.db" # 不用改 ｜ 目前是使用 SQLite 的话就是 "file:./data.db" 在 prisma/data.db 下 用别的数据库的话就得改改 provider 之类的了日后再说了

ENABLE_S3_BACKUP=false      # 是否启用 S3 备份数据库 否则下面这些都忽略
AWS_ACCESS_KEY_ID=          # S3 access key
AWS_SECRET_ACCESS_KEY=      # S3 secret key
S3_BUCKET_NAME=             # S3 bucket name
S3_ENDPOINT=                # S3 endpoint
S3_PUBLIC_URL=                 # S3 Public URL
# 备份文件前缀路径 s3Path = `${S3_PUBLIC_URL}/${BACKUP_FILE_PREFIX || ''}data.db`
BACKUP_FILE_PREFIX="backup/tg-bot-backup/cos-tg-bot-"      # 备份文件前缀
```
