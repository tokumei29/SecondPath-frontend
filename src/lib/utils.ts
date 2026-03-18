// YYYY-MM-DD 形式を確実に生成するヘルパー
export const formatDateForInput = (dateString: string | undefined) => {
  if (!dateString) return '';
  // もし 2026-03-18T... という形式なら、最初の10文字だけ抜く
  return dateString.split('T')[0];
};
