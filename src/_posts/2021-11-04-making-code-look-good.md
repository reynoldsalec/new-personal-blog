---
date: 2022-01-04 22:55:00
title: "Displaying Code in Marketing Material: Why and How"
description: "If you're marketing an open source project or commercial dev tool to developers, you'll want attractive ways to highlight code. Just make sure you're showing the right things for the right reasons."
tags:
  - strategy
  - product
  - dev tools
---

**tl;dr Align code samples with specific value propositions of your product. If you can't show value in < 3 seconds, don't bother. Only show what you need to and make sure it looks good using a tool like Carbon, Asciinema, or GifCap.**

Marketing dev tools is difficult for many reasons. Often you're marketing to multiple audiences with dramatically different needs, from different types of developers to the businesses that actually pay for the tools. Most marketing advice is targeted at dissimilar industries. And to top it off, your "product" may be nothing more than a CLI tool.

Even a simple object like an apple has a thousand more aesthetic possibilities for photos, designs, and emotional appeals than code does. Hungry for terminal?

Side note: if you're the OSS maintainer that thinks "marketing" is for commercial froods and sellouts, then you're either blessed with a tool so useful that you're showered with cash by grateful developers, or you're a saint. Just remember that most saints didn't meet happy ends.

## Why to Include Code in Dev Tool Marketing

Code is complex. Why even bother including it in your marketing material for a dev tool?

Many marketers rely on amalgamated graphics or conceptual diagrams to make enterprise software and other "boring" tools seem exciting. This may work well for the suits (particularly those who assigned budget to make said shiny graphics), but a polished veneer without substance can alienate developers.

  > The best marketing tries to focus on the true value props - the things you've tested and proven with customer research - and communicates them in the most succinct way possible.

For developers, your value propositions should be clear answers to questions like...

- "How does this make my job easier?"
- "Does this solve a problem I experience now?"
- "Will this tool enable me to do something cool/profitable/impressive to my boss?"

Code can be a great way of answering this questions _when it's used correctly._ And if you can effectively combine meaty code samples with emotional appeals that strike to the core of the developer experience, you can easily elevate your dev tool marketing into the 99th percentile.

## How to Include Code in Dev Tool Marketing

Broadly speaking, there are two types of "code" samples: static code samples and dynamic demos.

A "static code sample" is a snippet of code. It's a great way to show developers how clear and easy your syntax is. It should be brief, concicse, and self-explanatory.

A "dynamic demo" is typically a command line or IDE screengrab, showing short example of a developer using the tool in realtime. It should show the developer how quick it is to go from 0 to "ah ha, cool!" What's ultimate payoff screenshot at the end? Can I get there in less than 3 seconds while making sense to a casual (ie distracted) viewer?

### Making Static Code Look Great

Carbon:

Code Markup (styled HTML):


### Showing the Action

ASCIInema: Good for short clips of terminal-only examples where you want people to be able to copy paste commands. High fidelity.

GifCap: Good for short clips beyond the terminal (live IDE example, browser showoffs). Decent fidelity. Not for interactive samples.

Dynamic JS-powered: 