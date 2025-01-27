import { WrapperContext } from '@/bot/wrappers/command-wrapper';
import { exec as execCallback } from 'child_process';
import { CommandMiddleware } from 'grammy';
import { promisify } from 'util';

const exec = promisify(execCallback);

const restartCommand: CommandMiddleware<WrapperContext> = async (ctx) => {
  await ctx.wait('正在重启服务...执行重启命令: npm run pm2:restart');
  try {
    setTimeout(() => {
      exec('npm run pm2:restart');
    }, 2000);
    // 发送消息后立即退出进程
    return ctx.resolveWait('重启命令已执行，bot 将在 2s 后重启');
  } catch (error: any) {
    return ctx.resolveWait(`执行出错: ${error.message}`);
  }
};

export default restartCommand;
