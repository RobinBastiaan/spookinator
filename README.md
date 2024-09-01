<p align="center" width="100%"><a href="https://spookpad.nl" target="_blank"><img src="/src/banner.png?raw=true"></a></p>

# spookinator

A haunted trail is an adventurous and exciting trail in the dark, where participants walk past various spooky scenes and
posts that scare or challenge them. The goal is to create an unforgettable and scary experience for young and old. This
tool helps you to easily and efficiently put together such a ghost trail, by providing ideas, themes and supplies for
each part of the trail. This makes building a ghost trail more fun and easier, so you can focus on creating the ultimate
scary experience!

This project can be found on https://www.spookpad.nl. The main feature of this tool is the search & filter functionality
to find specific posts. A complete trail can also be generated and exported automatically to plan and organize your
spookpad efficiently. In addition, one can make use of the API endpoint https://spookpad.nl/api/random/ to select a
random post.

## Installation & Inner workings

This project is build to be compatible for use on the PBworks platform. This platform does come with its quirks and
limitations however, that had to be built around with.

- For the CSS and the JS to work, it has to be added as a plugin-widget on a PBworks page. You need to have admin
  privileges to be able to do that.
- Since the platform does not allow large file-size within a plugins-widget, the script of the Spookinator has to be
  placed in multiple smaller plugins-widgets. This makes large classes and functions not possible.
- When editing a PBworks page, all plugins-widgets are not executed. This allows the source table to be only visible
  when editing the page for a clean and easy way for users to edit it by using CSS within a plugin-widget.
- To make this project work on both the platform and the localhost, the element `<div id="wikipage-inner">` has been
  added to the file. Since this div is already present on a PBworks page, it is not needed to copy this element over.
  Only the source table needs to be added to the page as plain HTML.
- Changing the colors of this project in order to be used in other (PBworks) color themes should be fairly easy via the
  use of CSS custom properties. Edit the top of the css-file to enable the other predefined colors.

## General tips during the design of a haunted trail

- As much as possible, try to use the theme of the camp in each post. Consider recurring themed characters, as well as
  using the setting of the theme itself. So adjust the posts in the tool to your specific situation.
- Provide lots of variety in the types of posts, such as: crawling/climbing elements, themed content, doing elements and
  the use of different senses. That way it is always a surprise what will literally end up on their path.
- Place posts that need electricity by means of a power point or generator near each other, so they can get power
  through the cable reels.
- Build posts that are not portable near a road that is passable by car with trailer so that materials from these posts
  can be easily dropped and picked up.
- Do not place speakers with a sound fragment too far into the forest. Not only will it be difficult to find during the
  preparation and invisible, but the sound will also be less audible. Also consider the rainproofness of the equipment.
- Ensure that all activities are performed safely and with common sense. Take into account the environment,
  participants, and any risks. You are always personally liable for any accidents or damage that may occur while using
  this tool. Safety always comes first!

## Feedback and Support

This is a tool that was created out of passion to help everyone build their own haunted trail and will always be
publicly available for free and open source.

Please take a few minutes to let me know what you think so it can be even better. Thanks in advance for your valuable
input! https://docs.google.com/forms/d/e/1FAIpQLSfSsq-tg4dUw5j_vDUUaEuCe2OKJS43YPojyOj3pN91L-3M3w/viewform

Although the server costs are low, it took a lot of time to put this tool together. If the tool helped you and if you
can spare something, consider a small thank you via https://buymeacoffee.com/spookpad.

## Preview

![spookinator](/src/preview.png)

<p align="center" width="100%">
    <img width="10%" src="favicon.png?raw=true"> 
</p>
