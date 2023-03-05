const database = {
    ['index.html']: '<html>Hello</html>'
}

module.exports.get = (key, callback) => {
    setTimeout(() => {
        callback(database[key])
    }, 3000);
}