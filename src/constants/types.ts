export type CommandEntity = {
  name: string; // 命令名称 如/post
  args: string[];
  original_msg: string; // 命令名称后的url+全部参数
};
