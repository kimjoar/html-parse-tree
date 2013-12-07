var htmlparser = require("htmlparser2");

module.exports = function(html, callback) {
    var root = [];
    var tagstack = [];

    var parser = new htmlparser.Parser({
        onopentag: function(name, attrs) {
            var parent = tagstack[tagstack.length - 1]

            var tag = {
                type: 'tag',
                name: name,
                attrs: attrs,
                parent: parent,
                children: []
            };

            if (!parent) root.push(tag);
            else parent.children.push(tag);

            tagstack.push(tag);
        },
        ontext: function(text) {
            var parent = tagstack[tagstack.length - 1]

            var tag = {
                type: 'text',
                parent: parent
            };

            if (parent) parent.children.push(tag);
            else root.push(tag);
        },
        onclosetag: function(name) {
            tagstack.pop();
        },
        onprocessinginstruction: function(name, data) {
            var parent = tagstack[tagstack.length - 1]

            var tag = {
                type: 'directive',
                name: name,
                data: data,
                parent: parent
            };

            if (parent) parent.children.push(tag);
            else root.push(tag);
        },
        oncomment: function(data) {
            var parent = tagstack[tagstack.length - 1]

            var tag = {
                type: 'comment',
                data: data,
                parent: tagstack[tagstack.length - 1]
            };

            if (parent) parent.children.push(tag);
            else root.push(tag);
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
