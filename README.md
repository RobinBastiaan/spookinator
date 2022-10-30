# spookinator

This small web page plugin, that is heavily integrated to work on the PBworks platform, provides a convenient search for
a haunted trail. This makes it especially useful to use as a brainstorming technique.

Even though entries include the year in which they were done, the entries in this tool are not intended to be a
historical record. Specific details are altered to make them more generic in order to make them more suitable for
general reuse.

## Installation & Inner workings

This project is build to be used on the PBworks platform. This platform does come with its quirks and limitations that
had to be built around with.

- For the CSS and the JS to work, it has to be added as a plugin-widget on a PBworks page. You need to have admin
  privileges to be able to do that.
- Since the platform does not allow large file-size within a plugins-widget, the script of the Spookinator has to be
  placed in multiple smaller plugins-widgets. This makes large classes and functions not possible.
- When editing a PBworks page, all plugins-widgets are not executed. This allows the source table to be only hidden when
  not editing for a clean and easy way for users to edit it by using CSS within a plugin-widget.
- To make this project work on both the platform and the localhost, I added <div id="wikipage-inner"> to the file. Since
  this div is already present on a PBworks page, it is not needed to copy this element over. Only the source table needs
  to be added to the page as plain HTML.
- Changing the colors of this project in order to be used in other (PBworks) color themes should be fairly easy via the
  use of CSS custom properties. Edit the top of the css-file to enable the other predefined colors.

## General tips during the design of a haunted trail

- As much as possible, try to use the theme of the camp in each post. Consider recurring themed characters, as well as
  using the setting of the theme itself.
- Provide lots of variety in the types of posts, such as: themed content, crawling/climbing elements, doing elements and
  use of different senses.
- Place posts that need electricity near each other, so they can get power through the cable reels.
- Build posts that are not portable near a road that is passable by car with trailer so that materials from these posts
  can be easily dropped and picked up.

## Preview

![spookinator](https://user-images.githubusercontent.com/38226878/198897319-40be6c10-a0bd-4e80-9df2-cb83cf8d83ad.PNG)

<p align="center" width="100%">
    <img width="10%" src="favicon.png?raw=true"> 
</p>
