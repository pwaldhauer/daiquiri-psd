#!/usr/bin/env node

var _ = require('underscore');
var async = require('async');
var fs = require('fs');

var argv = require('yargs')
    .usage('Usage: $0 -o [path-to-json] [path-to-psd]')
    .demand(1)
    .demand(['o'])
    .alias('o', 'output')
    .describe('o', 'Path to output json file')
    .argv;

var PSD = require('psd');
var path = require('path');
var psd = PSD.fromFile(path.resolve(argv._[0]));

var group_types = ['full', 'grid'];
var sections = [];

psd.parse();

var all_sections = _.sortBy(psd.tree().children(), function(section) {
    return section.top;
});

_.each(all_sections, function(section) {

    if(section.type != 'group' || section.name != 'section' || section.children().length == 0) {
        console.log('Skipping non-group: ' + section.name);
        return;
    }

    var all_boxes =  _.sortBy(section.children(), function(box) {
        return box.top;
    });

    var boxes = [];

    _.each(all_boxes, function(box) {
        if(box.type != 'group' || !_.contains(group_types, box.name) || box.children().length === 0) {
            console.log('Ignoring group: ' + box.name + '(' + box.type + ')');

            return;
        }

        var all_children = _.sortBy(box.children(), function(layer) {
            return layer.left
        });

        var files = [];
        _.each(all_children, function(child) {

            if(child.type != 'layer') {
                console.log('Skipping nested group: ' + child.name);
                return;
            }

            files.push(child.name);
        })

        boxes.push({
            type: box.name,
            media: files
        });
    })

    sections.push({
        'title': 'Section',
        'boxes': boxes
    });

});


var output = require(path.resolve(argv.o));
output.sections = sections;

fs.writeFileSync(argv.o, JSON.stringify(output, null, '\t'));

console.log('Done, exported ' + sections.length + ' sections to ' + argv.o);
