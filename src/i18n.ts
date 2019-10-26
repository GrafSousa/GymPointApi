import i18n from 'i18n';

i18n.configure({
  locales: ['en', 'pt'],
  directory: `${__dirname}/app/locales`,
});

export default i18n;
