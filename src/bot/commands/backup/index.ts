import { WrapperContext } from '@/bot/wrappers/command-wrapper';
import { backupDBToS3IfEnabled } from '@/utils/s3';
import { CommandMiddleware } from 'grammy';

const backupCommand: CommandMiddleware<WrapperContext> = async (ctx) => {
  await ctx.wait('正在备份数据库至 S3...');
  try {
    await backupDBToS3IfEnabled(ctx);
    return ctx.resolveWait('备份命令已执行');
  } catch (error: any) {
    return ctx.resolveWait(`执行出错: ${error.message}`);
  }
};

export default backupCommand;
