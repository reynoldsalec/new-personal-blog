---
date: 2021-02-12 22:55:00
title: "Bulk Exporting Expensify Receipt Images"
description: "This seems like an easy task, I should write a script! It hasn't been *that* long since I coded. Right?"
tags:
  - programming
---

**tl;dr The simplest solution is the best solution.**


## Problem: Download Image Links From a Spreadsheet

Ack, I don't want to go through 100+ individual links in this spreadsheet from Expensify and download them individually. That'd take forever!

Guess I could just install this Chrome plugin to do it, but where's the fun in that. I'm a PROGRAMMER. I've written code that DOES STUFF. Probably good to dust off those skills and flex some muscles! Otherwise my teammates will start thinking my membrane is getting inane.

`npm install -g npm@latest`

Ok, first I'd better update Node and NPM...been a while since I did that. Ick, the command breaks. And apparently [deletes my symlink to npm](https://github.com/npm/cli/issues/611)! Fun, now I guess I have to reinstall NPM using brew...wonder when I last updated brew?!

`brew update && brew upgrade`

Looks like I have to download Command Line Developer Tools...you'd think I'd have done that in the nearly four years I've owned this laptop...

Ok, now I'll reinstall node and download the latest npm.

`brew reinstall node`

`npm install -g --force npm`

God, is this what my teammates spend all their time on everyday? When do I get back to the FUN stuff, like making something that actually does work? Say, didn't I have some work to do...?

Hmm, while I'm waiting for things to install maybe I should try to use some of these Chrome extensions to download these images...

[PILES OF SUCK THAT FAIL TO DETECT PDF LINKS IN GOOGLE SHEETS]

Wow, guess that doesn't solve my problem AT ALL.

Hey, this is just a list of URLs. What if I just used cURL or wget to fetch them?

## A QUICK GOOGLE LATER...

`xargs -n 1 curl -b 'authToken=MYTOKEN' -LO < urls.txt`

Ah yeah, that's right, you should always use the SIMPLEST WAY to do a task. I'll come back to refreshing my Node scripting skills some other day. Lesson re-learned.

[https://community.expensify.com/discussion/comment/20008/#Comment_20008](https://community.expensify.com/discussion/comment/20008/#Comment_20008)
