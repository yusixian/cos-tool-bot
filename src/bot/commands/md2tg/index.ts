import { WrapperContext } from '@/bot/wrappers/command-wrapper';
import { CommandMiddleware } from 'grammy';
import convertMarkdownToTelegramMarkdown from 'telegramify-markdown';

export type UnsupportedTagsStrategy = 'escape' | 'remove' | 'keep';

export const md2tgCommand: CommandMiddleware<WrapperContext> = async (ctx) => {
  const args = ctx.command?.args ?? [];
  const validStrategies = ['escape', 'remove', 'keep'] as const;
  const hasOpt = args.length && args[0] && validStrategies.includes(args[0] as UnsupportedTagsStrategy);
  const opt: UnsupportedTagsStrategy = hasOpt ? (args[0] as UnsupportedTagsStrategy) : 'escape';

  const text = hasOpt ? ctx.command.original_msg.slice(args[0]?.length ?? 0) : ctx.command.original_msg;

  if (!text) {
    return ctx.reply(
      '请在命令后面附上要转换的 Markdown 文本，例如：\n' +
        '第二个可选参数为 escape / remove / keep 表示当遇到不合法的标签时的行为，' +
        'escape 表示将不合法的标签转换为 HTML 实体，remove 表示将不合法的标签删除，keep 表示保留不合法的标签\n' +
        '默认不传的话是 `escape`，例如：/md2tg keep > balabala\n' +
        '/md2tg 目前支持的格式如下：**粗体**\n' +
        '- 无序列表\n' +
        '[链接](https://example.com)\n' +
        '`code`\n',
    );
  }
  try {
    return ctx.reply(convertMarkdownToTelegramMarkdown(text, opt) ?? '转换失败', { parse_mode: 'MarkdownV2' });
  } catch (error) {
    return ctx.reply('转换失败，请检查输入的 Markdown 格式是否正确');
  }
};

export default md2tgCommand;
