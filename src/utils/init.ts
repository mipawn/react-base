export function getLang():string {
  let lang = localStorage.getItem('console_lang')
  if (!lang) {
    const newLang = window.navigator.language || 'zh-CN'
    localStorage.setItem('console_lang', newLang)
    lang = newLang
  }
  return lang
}
