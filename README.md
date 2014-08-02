# daiquiri-psd

Takes an pds file as input and outputs the needed JSON to generate the gallery using [daiquiri](https://github.com/pwaldhauer/daiquiri)

## Usage

- Create your gallery layout in Photoshop. Wrap images that should be shown fullscreen in a group named "full" and images that should be displayed in a grid in a "grid" group.
- `daiquiri-psd -o gallery.json gallery.psd`
- Done!

(Please take care, this script replaces the whole `sections` block of your json)

## Todo

- Support for text blocks
