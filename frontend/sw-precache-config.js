module.exports = {
    navigateFallback: '/',
    staticFileGlobs: [
        'build/static/**/*.{js,html,css}',
        'build/manifest.json',
        'build/index.html'
    ],
    stripPrefix: 'build/',
    runtimeCaching: [
        {
            urlPattern: /^https:\/\/schedule\.darksecrets\.ru/,
            handler: 'networkFirst'
        }
    ]
};