# daiquiri-psd

Takes an pds file as input and outputs the needed JSON to generate the gallery using [daiquiri](https://github.com/pwaldhauer/daiquiri)

## Usage

- Create your gallery layout in Photoshop:
 - Wrap your sections in groups named `section`
 - Wrap images that should be shown fullscreen in a group named `full` and images that should be displayed in a grid in a `grid` group.
 - You don't need to order the layers/groups. Ordering will be done automatically by the y value of layers from top to bottom.

![Screenshot](https://s3-eu-west-1.amazonaws.com/knusperfiles/daiquiri-psd-screen.png)

- Run `daiquiri-psd -o gallery.json gallery.psd`
- Done!

(Please take care, this script replaces the whole `sections` block of your json)

## Todo

- Support for text blocks
