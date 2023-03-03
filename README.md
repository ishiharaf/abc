# ABC Tools

An extension to preview and play music written in ABC notation inside Visual Studio Code. It's powered by the [abcjs](https://www.abcjs.net/) library.

You can learn more about ABC on its [official website](https://abcnotation.com/).

## Usage

Open the command palette and type `ABC` and search for the `ABC: Show Preview` command. It'll open a new panel with a preview of the ABC file. Clicking on the `⏵` icon will play the file.

![Screenshot](https://raw.githubusercontent.com/ishiharaf/abc/main/media/ss.png)

Snippets are available to aid with the creation of new files. Type `ABC` and select one of the snippets. For example, this is the `ABC: Headers (Minimal)`:

```
X:1
T:Title
K:C
z4
```

It's the bare minimum an ABC file must have to be valid.

## Changelog

See the [changelog](CHANGELOG.md) file.