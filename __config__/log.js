const color = require('cli-color');

module.exports = function log(text, theme = 'green') {
    console.log(color[theme](text));
};
