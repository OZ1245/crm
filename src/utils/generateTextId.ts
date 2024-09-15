export function generateTextId(text: string) {
  const upperCaseText = text.toLocaleUpperCase();

  const regexp = new RegExp(/[aeiouyаеёиоуъыьэюя]/gi);
  return upperCaseText.replace(regexp, '');
}
