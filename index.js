var htmlparser = require("htmlparser2");

module.exports = function(html, callback) {
    var blocks = [];
    var currentBlock = null;

    var parser = new htmlparser.Parser({
        onopentag: function(name, attrs) {
            var tag = {
                type: 'tag',
                name: name,
                attrs: attrs,
                parent: currentBlock,
                children: []
            };

            if (currentBlock) {
                currentBlock.children.push(tag);
            } else {
                blocks.push(tag);
            }

            currentBlock = tag;
        },
        ontext: function(text) {
            var tag = {
                type: 'text',
                parent: currentBlock
            };

            if (currentBlock) {
                currentBlock.children.push(tag);
            } else {
                blocks.push(tag);
            }
        },
        onclosetag: function(name) {
            if (currentBlock) {
                currentBlock = currentBlock.parent;
            }
        },
        onprocessinginstruction: function(name, data) {
            var tag = {
                type: 'directive',
                name: name,
                data: data,
                parent: currentBlock
            };

            if (currentBlock) {
                currentBlock.children.push(tag);
            } else {
                blocks.push(tag);
            }
        },
        oncomment: function(data) {
            var tag = {
                type: 'comment',
                data: data,
                parent: currentBlock
            };

            if (currentBlock) {
                currentBlock.children.push(tag);
            } else {
                blocks.push(tag);
            }
        },
        onerror: function(error) {
            callback(error);
        },
        onend: function() {
            callback(null, blocks);
        }
    });

    parser.write(html);
    parser.end();
}
