import { computed, ref } from 'vue'

const storedLocale = typeof window !== 'undefined' ? window.localStorage.getItem('witcher_locale') : null
const locale = ref(storedLocale === 'en' ? 'en' : 'ru')

const dict = {
  ru: {
    home: 'Главная',
    allCharacters: 'Все персонажи',
    bestiary: 'Бестиарий',
    misc: 'Прочее',
    northernKingdoms: 'Северное королевство',
    velen: 'Велен и Новиград',
    skellige: 'Скеллиге',
    whiteOrchard: 'Белый сад',
    kaerMorhen: 'Каэр Морхен',
    toussaint: 'Туссент',
    gunterworld: "Мир Гюнтера О'Дима",
    heroSubtitle: 'Эпическое приключение в открытом мире, где каждое решение оставляет след в истории Континента.',
    aboutTitle: 'Об игре',
    aboutText: 'The Witcher 3: Wild Hunt - ролевая игра с открытым миром, в которой вы играете за Геральта из Ривии, профессионального охотника на чудовищ. Вас ждут масштабные регионы, политические интриги, нелинейные квесты и знаменитый мрачный фэнтези-стиль.',
    heroesTitle: 'Главные герои',
    galleryTitle: 'ГАЛЕРЕЯ',
    galleryVideo: 'Видео',
    galleryScreenshots: 'Скриншоты',
    galleryWallpapers: 'Обои',
    galleryArts: 'Арты',
    galleryMemes: 'Мемы',
    openVideo: 'Открыть видео',
    charactersTitle: 'Энциклопедия персонажей',
    charactersSubtitle: 'Главные и второстепенные герои The Witcher 3: Wild Hunt, которые формируют судьбу Континента.',
    monstersTitle: 'Бестиарий',
    monstersSubtitle: 'Полный список чудовищ The Witcher 3 с разбивкой по категориям.',
    searchCharacter: 'Поиск по имени персонажа...',
    searchMonster: 'Поиск по имени монстра...',
    allCategories: 'Все категории',
    noResults: 'Ничего не найдено. Попробуйте другой запрос.',
    findUs: 'Где нас найти',
    terms: 'Условия использования',
    privacy: 'Политика конфиденциальности',
    career: 'Карьера',
    footerCopy: '© 2026 Фан-сайт по The Witcher 3: Wild Hunt. Все права на игровые материалы, персонажей, логотипы и контент принадлежат CD PROJEKT RED.'
  },
  en: {
    home: 'Home',
    allCharacters: 'All Characters',
    bestiary: 'Bestiary',
    misc: 'Misc',
    northernKingdoms: 'Northern Kingdoms',
    velen: 'Velen and Novigrad',
    skellige: 'Skellige',
    whiteOrchard: 'White Orchard',
    kaerMorhen: 'Kaer Morhen',
    toussaint: 'Toussaint',
    gunterworld: 'Gunter world',
    heroSubtitle: 'An epic open-world adventure where every choice leaves its mark on the history of the Continent.',
    aboutTitle: 'About The Game',
    aboutText: 'The Witcher 3: Wild Hunt is an open-world RPG where you play as Geralt of Rivia, a professional monster hunter. Vast regions, political intrigue, nonlinear quests, and a signature dark fantasy tone await you.',
    heroesTitle: 'Main Heroes',
    galleryTitle: 'GALLERY',
    galleryVideo: 'Videos',
    galleryScreenshots: 'Screenshots',
    galleryWallpapers: 'Wallpapers',
    galleryArts: 'Art',
    galleryMemes: 'Memes',
    openVideo: 'Open video',
    charactersTitle: 'Character Encyclopedia',
    charactersSubtitle: 'Major and secondary heroes of The Witcher 3: Wild Hunt who shape the fate of the Continent.',
    monstersTitle: 'Bestiary',
    monstersSubtitle: 'A full list of The Witcher 3 monsters grouped by categories.',
    searchCharacter: 'Search by character name...',
    searchMonster: 'Search by monster name...',
    allCategories: 'All categories',
    noResults: 'No results found. Try a different query.',
    findUs: 'Find us',
    terms: 'Terms of use',
    privacy: 'Privacy policy',
    career: 'Career',
    footerCopy: '© 2026 Fan site for The Witcher 3: Wild Hunt. All rights to game materials, characters, logos, and content belong to CD PROJEKT RED.'
  }
}

const setLocale = (next) => {
  locale.value = next === 'en' ? 'en' : 'ru'
  if (typeof window !== 'undefined') {
    window.localStorage.setItem('witcher_locale', locale.value)
  }
  document.documentElement.lang = locale.value
}

if (typeof document !== 'undefined') {
  document.documentElement.lang = locale.value
}

export const useLocale = () => {
  const t = (key) => dict[locale.value]?.[key] || dict.ru[key] || key
  return {
    locale,
    isRu: computed(() => locale.value === 'ru'),
    t,
    setLocale
  }
}
