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

var section_types = ['header', 'section'];
var group_types = ['title', 'text', 'full', 'grid', 'headline', 'subtitle', 'image'];
var title = {
    "headline": null,
    "subtitle": null,
    "media": null
};
var sections = [];

psd.parse();

var all_sections = _.sortBy(psd.tree().children(), function(section) {
    return section.top;
});

_.each(all_sections, function(section) {
    var current_section_title = 'Section title';

    if(section.type != 'group' || !_.contains(section_types, section.name) || section.children().length == 0) {
        console.log('Skipping non-group: ' + section.name);
        return;
    }

    // Parse header
    if(section.name == 'header') {
         var all_boxes =  _.sortBy(section.children(), function(box) {
             return box.top;
         });

         _.each(all_boxes, function(box) {
             if(box.type != 'group' || !_.contains(group_types, box.name) || box.children().length === 0) {
                 console.log('Ignoring group: ' + box.name + '(' + box.type + ')');

                 return;
             }

             if(box.name == 'headline') {
                 if(_.isUndefined(box.children()[0].get('typeTool'))) {
                         return;
                 }

                 title.headline = box.children()[0].get('typeTool').textData['Txt '];
                 return;
             }

             if(box.name == 'subtitle') {
                 if(_.isUndefined(box.children()[0].get('typeTool'))) {
                         return;
                 }

                 title.subtitle = box.children()[0].get('typeTool').textData['Txt '];
                 return;
             }

             if(box.name == 'image') {
                title.media = [box.children()[0].name];
             }
         });

        return;
    }

    // Parse other boxes
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

        // Section title
        if(box.name == 'title') {
            if(_.isUndefined(all_children[0].get('typeTool'))) {
                    return;
            }

            current_section_title = all_children[0].get('typeTool').textData['Txt '];
            return;
        }

        // Text boxes
        if(box.name == 'text') {
            var paragraphs = [];
            _.each(all_children, function(child) {
                if(_.isUndefined(child.get('typeTool'))) {
                    return;
                }

                // Yes, there needs to be a space 8-)
                paragraphs.push(child.get('typeTool').textData['Txt ']);
            })

            boxes.push({
                type: 'text',
                paragraphs: paragraphs
            });

            return;
        }

        // Image boxes
        var files = [];
        _.each(all_children, function(child) {
            if(child.type != 'layer') {
                console.log('Skipping nested group: ' + child.name);
                return;
            }

            files.push(child.name);
        })

        boxes.push({
            type: 'image',
            size: box.name,
            media: files
        });
    })

    sections.push({
        'title': current_section_title,
        'boxes': boxes
    });

});


var output = require(path.resolve(argv.o));
output.sections = sections;

if(title.headline != null) {
    output.meta.title.headline = title.headline;
}

if(title.subtitle != null) {
    output.meta.title.subtitle = title.subtitle;
}

if(title.media != null) {
    output.meta.title.media = title.media;
}

fs.writeFileSync(argv.o, JSON.stringify(output, null, '\t'));

console.log('Done, exported ' + sections.length + ' sections to ' + argv.o);
