export function encodeURL(url: string) {
  return encodeURI(url.replace(/ /g, '_'));
}
