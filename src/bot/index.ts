import { ADMIN_CHAT_IDS, BOT_TOKEN } from '@/constants';
import { prisma } from '@/utils/db';
import logger from '@/utils/logger';
import { Bot, GrammyError, HttpError } from 'grammy';
import backupCommand from './commands/backup';
import md2tgCommand from './commands/md2tg';
import restartCommand from './commands/restart';
import authGuard from './guards/authGuard';
import { WrapperContext } from './wrappers/command-wrapper';

const bot = new Bot(BOT_TOKEN, {
  ContextConstructor: WrapperContext,
});

const commands = [
  { command: 'start', description: '显示欢迎信息～' },
  { command: 'help', description: '显示帮助～' },
  {
    command: 'md2tg',
    description: '将 Markdown 转换为 Telegram 格式，第二个可选参数为 `escape` | `remove` | `keep`, 默认为 escape',
  },
  { command: 'restart', description: '(admin) 重启服务' },
  { command: 'backup', description: '(admin) 备份数据库至 S3' },
];

bot.command('start', (ctx) => ctx.reply('欢迎，请尽情的享受咱吧～\n输入 /help 查看帮助哦'));
bot.command('help', (ctx) => {
  const contents = commands.reduce((acc, command) => {
    return acc + `/${command.command} - ${command.description}\n`;
  }, '');
  return ctx.reply('命令列表：\n' + contents);
});
bot.command('md2tg', md2tgCommand);
bot.command('restart', authGuard, restartCommand);
bot.command('backup', authGuard, backupCommand);

// 设置命令
bot.api.setMyCommands(commands);

bot.catch((err) => {
  const ctx = err.ctx;
  let errorMsg = '处理消息 ' + ctx.update.update_id + ' 时出错:\n```\n';

  const e = err.error;
  if (e instanceof GrammyError) {
    errorMsg += 'Error in request:' + e.description;
  } else if (e instanceof HttpError) {
    errorMsg += 'Could not contact Telegram:' + e;
  } else {
    errorMsg += 'Unknown error:' + ((e as Error)?.message ?? String(e));
  }
  errorMsg += '\n```';
  console.error(errorMsg);
  err.ctx.resolveWait(errorMsg, 'Markdown');
});

// Enable graceful stop
process.once('SIGINT', async () => {
  logger.info('[SIGINT] 呜呜呜人家要被杀掉惹...');
  ADMIN_CHAT_IDS?.length &&
    ADMIN_CHAT_IDS.forEach((adminId) => {
      bot.api.sendMessage(adminId, '[SIGINT] 呜呜呜人家要被杀掉惹...');
    });
  bot.stop();
  await prisma.$disconnect();
  process.exit(0); // 正常退出进程
});
process.once('SIGTERM', async () => {
  logger.info('[SIGTERM] 呜呜呜人家要被杀掉惹...');
  ADMIN_CHAT_IDS?.length &&
    ADMIN_CHAT_IDS.forEach((adminId) => {
      bot.api.sendMessage(adminId, '[SIGTERM] 呜呜呜人家要被杀掉惹...');
    });
  bot.stop();
  await prisma.$disconnect();
  process.exit(0); // 正常退出进程
});

export default bot;
