// グループIDを生成する関数
export function generateGroupId(): string {
  const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
  const length = 8;
  let result = '';
  
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  
  return result;
}