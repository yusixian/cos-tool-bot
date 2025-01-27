import dotenv from 'dotenv';

dotenv.config();

export const BOT_TOKEN = process.env.BOT_TOKEN ?? '';
export const ADMIN_CHAT_IDS = (process.env.ADMIN_CHAT_IDS ? JSON.parse(process.env.ADMIN_CHAT_IDS) : []) as number[];
export const ADMIN_USERNAME = process.env.ADMIN_USERNAME ?? '';

// S3 相关
export const ENABLE_S3_BACKUP = process.env.ENABLE_S3_BACKUP || false;
export const S3_BUCKET_NAME = process.env.S3_BUCKET_NAME || '';
export const S3_ENDPOINT = process.env.S3_ENDPOINT || '';
export const S3_REGION = process.env.S3_REGION || '';
export const S3_PUBLIC_URL = process.env.S3_PUBLIC_URL || '';
export const BACKUP_FILE_PREFIX = process.env.BACKUP_FILE_PREFIX || '';
