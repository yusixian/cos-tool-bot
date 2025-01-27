import { CommandEntity } from '@/constants/types';

// const urlPattern = /^(((ht|f)tps?):\/\/)?([^!@#$%^&*?.\s-]([^!@#$%^&*?.\s]{0,63}[^!@#$%^&*?.\s])?\.)+[a-z]{2,6}\/?/g;

export function parseParams(command: string): CommandEntity {
  if (!command)
    return {
      name: '',
      args: [],
      original_msg: '',
    };
  const cmd = command.trim();
  // 使用正则表达式匹配空格或换行符
  if (!cmd.match(/[\s\n]/))
    return {
      name: cmd.slice(1),
      args: [],
      original_msg: '',
    };

  // 使用正则表达式分割字符串
  const parts = cmd.split(/[\s\n]+/);
  const firstPart = parts[0] || '';
  const name = firstPart.slice(1);

  // 找到第一个命令后的位置，保留原始格式
  const commandEndIndex = cmd.indexOf(firstPart) + firstPart.length;
  const original_msg = cmd.slice(commandEndIndex).trim();
  // console.log(original_msg);
  const validArgsArr = parts.filter((v) => Boolean(v));
  if (!validArgsArr?.length || validArgsArr?.length === 1) return { name: command, args: [], original_msg };
  return {
    name,
    args: validArgsArr.slice(1),
    original_msg,
  };
}
