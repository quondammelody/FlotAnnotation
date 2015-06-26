# FlotAnnotation
Annotate your plot with vertical lines 

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

    Removes a new note at the given position. Either the last note from the graph,
    or removes the note of a given index.
