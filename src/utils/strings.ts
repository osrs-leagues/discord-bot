export function encodeURL(url: string) {
  return encodeURI(url.replace(/ /g, '_'));
}

export const capitalize = (s: string) => {
  return s.charAt(0).toUpperCase() + s.slice(1);
};
