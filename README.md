# daiquiri-psd

Takes an pds file as input and outputs the needed JSON to generate the gallery using [daiquiri](https://github.com/pwaldhauer/daiquiri)

## Installation

`sudo npm install -g daiquiri-psd`

(Or clone this repo)

## Usage

- Create your gallery layout in Photoshop, it should look like this. See the available block types below.

![Screenshot](https://s3-eu-west-1.amazonaws.com/knusperfiles/daiquiri-psd-screen_2.png)

- You don't need to order the layers/groups. Ordering will be done automatically by the y value of layers from top to bottom.

- Run `daiquiri-psd -o gallery.json gallery.psd`
- Done!

(Please take care, this script replaces the whole `sections` block of your json)

## Block types

| Name       | Description                                                              |
|------------|--------------------------------------------------------------------------|
| `header`   | Section containing headline, subtitle and header image                   |
| `headline` | Should contain exactly one text layer, used for the headline             |
| `subtitle` | Should contain exactly one text layer, used for the subtitle             |
| `image`    | Should contain exactly one image layer, used for the background image    |
| `section`  | A default section                                                        |
| `title`    | Should contain exactly one text layer, used for the title of the section |
| `text`     | Can contain multiple text layers, which translate to paragraphs          |
| `grid`     | Can contain one or more images that will be layed out in a grid          |
| `full`     | Should contain exactly one image, that will be layed out in full size    |

## License

MIT
