require.config({
    baseUrl: './modules',
    paths: {
        'logger': '../../logger'
    },
    waitSeconds: 10
});
require(['logger', 'setup']);
