var expect = require('chai').expect;
var tree = require('./index.js');

describe('tree', function() {

    it('handles single element', function(done) {
        tree("<input>", function(err, t) {
            expect(t).to.have.length(1);
            expect(t[0]).to.have.property('type', 'tag');
            expect(t[0]).to.have.property('name', 'input');
            expect(t[0].attrs).to.eql({});
            done();
        });
    });

    it('handles single element with closing tag', function(done) {
        tree("<html></html>", function(err, t) {
            expect(t).to.have.length(1);
            expect(t[0]).to.have.property('type', 'tag');
            expect(t[0]).to.have.property('name', 'html');
            expect(t[0].attrs).to.eql({});
            done();
        });
    });

    it('handles non-existing single element', function(done) {
        tree("<my-element></my-element>", function(err, t) {
            expect(t).to.have.length(1);
            expect(t[0]).to.have.property('type', 'tag');
            expect(t[0]).to.have.property('name', 'my-element');
            expect(t[0].attrs).to.eql({});
            done();
        });
    });

    it('handles single element with attributes', function(done) {
        tree('<input type="text" required>', function(err, t) {
            expect(t).to.have.length(1);
            expect(t[0]).to.have.property('type', 'tag');
            expect(t[0]).to.have.property('name', 'input');
            expect(t[0].attrs).to.eql({ type: 'text', required: '' });
            done();
        });
    });

    it('handles element which contain a child element', function() {
        tree('<html><head></head></html>', function(err, t) {
            expect(t).to.have.length(1);
            expect(t[0]).to.have.property('children');
            expect(t[0].children).to.have.length(1);
        });
    });

    it('handles element content', function() {
        tree('<body><h2>Heading</h2></body>', function(err, t) {
            var h2 = t[0].children[0];
            expect(h2).to.have.property('children');
            expect(h2.children).to.have.length(1);
        });
    });

    it('handles children of children', function() {
        tree('<html><head><title>test</title></head></html>', function(err, t) {
            expect(t).to.have.length(1);
            expect(t[0]).to.have.property('children');
            expect(t[0].children).to.have.length(1);
            expect(t[0].children[0]).to.have.property('children');
            expect(t[0].children[0].children).to.have.length(1);
        });
    });

    it('handles several on same layer', function() {
        tree('<html><head></head><body></body></html>', function(err, t) {
            expect(t).to.have.length(1);
            expect(t[0]).to.have.property('children');
            expect(t[0].children).to.have.length(2);
        });
    });

    it('handles several on root', function() {
        tree('<li></li><li></li>', function(err, t) {
            expect(t).to.have.length(2);
        });
    });

    it('handles comments', function() {
        tree('<html><!-- testing --></html>', function(err, t) {
            var htmlChildren = t[0].children;
            expect(htmlChildren).to.have.length(1);
            expect(htmlChildren[0]).to.have.property('type', 'comment');
            expect(htmlChildren[0]).to.have.property('data', ' testing ');
        });
    });

    it('handles several comments', function() {
        tree('<html><!-- testing --><!--test 2--></html>', function(err, t) {
            var htmlChildren = t[0].children;
            expect(htmlChildren).to.have.length(2);
            expect(htmlChildren[0]).to.have.property('type', 'comment');
            expect(htmlChildren[0]).to.have.property('data', ' testing ');
            expect(htmlChildren[1]).to.have.property('type', 'comment');
            expect(htmlChildren[1]).to.have.property('data', 'test 2');
        });
    });

    it('handles doctype', function() {
        tree('<!DOCTYPE html>', function(err, t) {
            expect(t).to.have.length(1);
            expect(t[0]).to.have.property('type', 'directive');
            expect(t[0]).to.have.property('name', '!doctype');
            expect(t[0]).to.have.property('data', '!DOCTYPE html');
        });
    });

});
