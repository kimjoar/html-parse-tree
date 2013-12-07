var expect = require('chai').expect;
var parseTree = require('./index.js');

describe('html-parse-parse', function() {

    it('handles single element', function(done) {
        parseTree("<input>", function(err, tree) {
            expect(tree).to.have.length(1);
            expect(tree[0]).to.have.property('type', 'tag');
            expect(tree[0]).to.have.property('name', 'input');
            expect(tree[0].attrs).to.eql({});
            done();
        });
    });

    it('handles single element with closing tag', function(done) {
        parseTree("<html></html>", function(err, tree) {
            expect(tree).to.have.length(1);
            expect(tree[0]).to.have.property('type', 'tag');
            expect(tree[0]).to.have.property('name', 'html');
            expect(tree[0].attrs).to.eql({});
            done();
        });
    });

    it('handles non-existing single element', function(done) {
        parseTree("<my-element></my-element>", function(err, tree) {
            expect(tree).to.have.length(1);
            expect(tree[0]).to.have.property('type', 'tag');
            expect(tree[0]).to.have.property('name', 'my-element');
            expect(tree[0].attrs).to.eql({});
            done();
        });
    });

    it('handles single element with attributes', function(done) {
        parseTree('<input type="text" required>', function(err, tree) {
            expect(tree).to.have.length(1);
            expect(tree[0]).to.have.property('type', 'tag');
            expect(tree[0]).to.have.property('name', 'input');
            expect(tree[0].attrs).to.eql({ type: 'text', required: '' });
            done();
        });
    });

    it('handles element which contain a child element', function() {
        parseTree('<html><head></head></html>', function(err, tree) {
            expect(tree).to.have.length(1);
            expect(tree[0]).to.have.property('children');
            expect(tree[0].children).to.have.length(1);
        });
    });

    it('handles element content', function() {
        parseTree('<body><h2>Heading</h2></body>', function(err, tree) {
            var h2 = tree[0].children[0];
            expect(h2).to.have.property('children');
            expect(h2.children).to.have.length(1);
            expect(h2.children[0]).to.have.property('data', 'Heading');
        });
    });

    it('handles children of children', function() {
        parseTree('<html><head><title>test</title></head></html>', function(err, tree) {
            expect(tree).to.have.length(1);
            expect(tree[0]).to.have.property('children');
            expect(tree[0].children).to.have.length(1);
            expect(tree[0].children[0]).to.have.property('children');
            expect(tree[0].children[0].children).to.have.length(1);
        });
    });

    it('handles several on same layer', function() {
        parseTree('<html><head></head><body></body></html>', function(err, tree) {
            expect(tree).to.have.length(1);
            expect(tree[0]).to.have.property('children');
            expect(tree[0].children).to.have.length(2);
        });
    });

    it('handles several on root', function() {
        parseTree('<li></li><li></li>', function(err, tree) {
            expect(tree).to.have.length(2);
        });
    });

    it('handles comments', function() {
        parseTree('<html><!-- testing --></html>', function(err, tree) {
            var htmlChildren = tree[0].children;
            expect(htmlChildren).to.have.length(1);
            expect(htmlChildren[0]).to.have.property('type', 'comment');
            expect(htmlChildren[0]).to.have.property('data', ' testing ');
        });
    });

    it('handles several comments', function() {
        parseTree('<html><!-- testing --><!--test 2--></html>', function(err, tree) {
            var htmlChildren = tree[0].children;
            expect(htmlChildren).to.have.length(2);
            expect(htmlChildren[0]).to.have.property('type', 'comment');
            expect(htmlChildren[0]).to.have.property('data', ' testing ');
            expect(htmlChildren[1]).to.have.property('type', 'comment');
            expect(htmlChildren[1]).to.have.property('data', 'test 2');
        });
    });

    it('handles doctype', function() {
        parseTree('<!DOCTYPE html>', function(err, tree) {
            expect(tree).to.have.length(1);
            expect(tree[0]).to.have.property('type', 'directive');
            expect(tree[0]).to.have.property('name', '!doctype');
            expect(tree[0]).to.have.property('data', '!DOCTYPE html');
        });
    });

});
