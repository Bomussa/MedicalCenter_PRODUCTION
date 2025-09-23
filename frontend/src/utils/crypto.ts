// مبسط لأغراض التخزين المحلي (ليس بديلاً لمعايير خوادم الإنتاج)
export function xorCipher(input: string, key: string) {
  const out: string[] = [];
  for (let i = 0; i < input.length; i++) {
    out.push(String.fromCharCode(input.charCodeAt(i) ^ key.charCodeAt(i % key.length)));
  }
  return out.join("");
}
export const encrypt = (s: string, k: string) => btoa(unescape(encodeURIComponent(xorCipher(s, k))));
export const decrypt = (s: string, k: string) => xorCipher(decodeURIComponent(escape(atob(s))), k);