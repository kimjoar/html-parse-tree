var htmlparser = require("htmlparser2");

module.exports = function(html, callback) {
    var root = [];
    var tagstack = [];

    function addElement(element) {
        var parent = tagstack[tagstack.length - 1]
        var siblings = parent ? parent.children : root;

        element.parent = parent;
        siblings.push(element);
    }

    var parser = new htmlparser.Parser({
        onopentag: function(name, attrs) {
            var tag = {
                type: 'tag',
                name: name,
                attrs: attrs,
                children: []
            };

            addElement(tag);
            tagstack.push(tag);
        },
        ontext: function(text) {
            var tag = {
                type: 'text',
                data: text
            };

            addElement(tag);
        },
        onclosetag: function(name) {
            tagstack.pop();
        },
        onprocessinginstruction: function(name, data) {
            var tag = {
                type: 'directive',
                name: name,
                data: data
            };

            addElement(tag);
        },
        oncomment: function(data) {
            var tag = {
                type: 'comment',
                data: data
            };

            addElement(tag);
        },
        onerror: function(error) {
            callback(error);
        },
        onend: function() {
            callback(null, root);
        }
    });

    parser.write(html);
    parser.end();
}
