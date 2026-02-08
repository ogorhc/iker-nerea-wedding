/**
 * "We're getting married" / "Nos casamos" in 50+ languages.
 * Euskera and Castellano are placed in the center for prominence.
 */
const BEFORE_CENTER = [
  'We\'re getting married', // English
  'Nous nous marions', // French
  'Wir heiraten', // German
  'Ci sposiamo', // Italian
  'Vamos casar-nos', // Portuguese
  'We are getting married', // English
  'Vi gifter oss', // Swedish
  'Vi gifter os', // Danish
  'We trouwen', // Dutch
  'Pobierzemy się', // Polish
  'Vamos nos casar', // Portuguese (BR)
  'Мы женимся', // Russian
  'Παντρευόμαστε', // Greek
  'Házasodunk', // Hungarian
  'Vom căsători', // Romanian
  'Budeme sa brať', // Slovak
  'Vjenčavamo se', // Croatian
  'Vzameva se', // Slovenian
  'Mi se ženimo', // Serbian
  'Casaremos', // Spanish (formal)
  'Nos vamos a casar', // Spanish
  'Me casaré', // Spanish (variant)
  'S\'ha de casar', // Catalan
  'Ens casem', // Catalan
  'Casar-nos-hemos', // Galician
  'Casarémonos', // Spanish
  'We get married', // English
  'We are to be married', // English
];

const CENTER = [
  'Ezkonduko gara', // Euskera
  'Nos casamos', // Castellano
  'Ezkonduko gara', // Euskera (repeated)
  'Nos casamos', // Castellano (repeated)
];

const AFTER_CENTER = [
  'نحن نتزوج', // Arabic
  '我们结婚了', // Chinese Simplified
  '私たちは結婚します', // Japanese
  '우리 결혼해요', // Korean
  'เราแต่งงานกัน', // Thai
  'Chúng tôi kết hôn', // Vietnamese
  'Kami ay ikakasal', // Filipino
  'Kami menikah', // Indonesian
  'אנחנו מתחתנים', // Hebrew
  'हम शादी कर रहे हैं', // Hindi
  'আমরা বিয়ে করছি', // Bengali
  'Biz evleniyoruz', // Turkish
  'Vi skal gifte oss', // Norwegian
  'Vi gifter oss', // Swedish
  'Meillä on häät', // Finnish
  'Vi erum að gifta okkur', // Icelandic
  'Táimid ag pósadh', // Irish
  'Rydyn ni\'n priodi', // Welsh
  'Siamo per sposarci', // Italian
  'Nous allons nous marier', // French
  'Wir werden heiraten', // German
  'We\'re getting married', // English
  'Nos casamos', // Spanish
  'Ezkonduko gara', // Euskera
  'We\'re getting married',
  'Nos casamos',
  'Ezkonduko gara',
];

export const weGetMarriedPhrases: string[] = [
  ...BEFORE_CENTER,
  ...CENTER,
  ...AFTER_CENTER,
];
