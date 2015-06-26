/* Flot plugin for annotating plots with vertical lines.

Copyright (c) 2014 SSL and Joshua Hoskins
Licensed under the MIT license

Version 0.4

The plugin supports these options:

    annotation: {
        color: [color1, color2, color3...]
        lineWidth: number
    }

"color" is an array of colors for the annotations to cycle through, 
"lineWidth" is the width of the drawn lines (default is 2).

The plugin also adds two public methods:

  - addNote( pos )

    Set a new note at the given position. This note will show a vertical line
    at the given position, allowing an easy way to compare specific points
    across many graphs. It's locked to the x coordinate, so resizing the graph
    will move the note to the proper location. You can make the note a specific
    color by defining pos.col as a hex color pattern.

  - delNote( idx )

    Removes a new note. If idx is given, it removes the note at the given array 
	index. If not, it removes the last note from the graph.

*/
(function ($) {
    var options = {
        annotation: {
            colors: ["#edc240", "#afd8f8", "#000000", "#4da74d", "#9440ed"],
            lineWidth: 2
        }
    };
    
    function init(plot) {
        // position of annotation in pixels
        var notes = [];

        plot.addNote = function addNote(pos) {
            if (!pos){
                if (notes.length > 0){
                    notes.pop();
                }
            } else {
                notes.push(pos);
            }
            
            plot.triggerRedrawOverlay();
        };
        
        plot.delNote = function delNote(idx) {
            if (typeof idx === 'undefined'){
                if (notes.length > 0){
                    notes.pop();
                }
            } else {
                notes.splice(idx, 1);
            }
            
            plot.triggerRedrawOverlay();
        };
                
        plot.hooks.drawOverlay.push(function (plot, ctx) {
            var n = plot.getOptions().annotation;

            var plotOffset = plot.getPlotOffset();
            
            ctx.save();
            ctx.translate(plotOffset.left, plotOffset.top);
            for ( var j = 0; j < notes.length; j++){
                if (notes[j].x !== -1) {
                    var adj = n.lineWidth % 2 ? 0.5 : 0;

                    //select the next color in the array if one wasn't provided
                    if(typeof notes[j].col === 'undefined'){
                        ctx.strokeStyle = n.colors[j % n.colors.length];
                    }else{
                        ctx.strokeStyle = notes[j].col;
                    }
                    ctx.lineWidth = n.lineWidth;
                    ctx.lineJoin = "round";

                    ctx.beginPath();
                    //convert position on plot into canvas position for drawing
                    var o = plot.p2c(notes[j]);
                    var newX = Math.max(0, Math.min(o.left, plot.width()));
                    var newY = Math.max(0, Math.min(o.top, plot.height()));
                    var drawX = Math.floor(newX) + adj;
                    ctx.moveTo(drawX, 0);
                    ctx.lineTo(drawX, plot.height());
                    ctx.stroke();
                }
            }
            ctx.restore();
        });
    }
    
    $.plot.plugins.push({
        init: init,
        options: options,
        name: 'annotations',
        version: '0.4'
    });
})(jQuery);
