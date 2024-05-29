---
date: 2023-05-11 22:55:00
title: "Algolia DocSearch w/Netlify"
description: "Algolia offers its DocSearch service free to index your open source project's documentation; here's a guide on how to set things up if you're using Netlify."
tags:
  - dev tools
---

tl;dr: Algolia DocSearch is a great search solution that's free for open source documentation. You should use it!

Lando has great docs, thanks largely to my co-maintainer and key Lando brain trust Mike Pirog. Since 2019 we've used Algolia DocSearch to index the docs and provide a convenient search interface.

HOWEVER, with shifting of maintainers, we lost access to the Algolia application dashboard. In the meantime, the structure of the Lando docs changed and our Algolia application (namely the crawler actually indexing our documentation) ceased to index the new documentation. Thanks to good redirects, our search was still largely accurate/helpful, but was quickly falling out of repair, serving more 404s and failing to update new information.

So in my copious free time I decided to untangle the ball of strings and re-boot our Algolia DocSearch integration.

## 1. Apply for the Program

Fill out the form: https://docsearch.algolia.com/apply

Algolia should get back to you with a search API key, index name, and an invite link so you can get access to your Algolia application dashboard. MAKE SURE YOU ACCEPT this invite link, it's easy to miss!

If your index looks properly populated, you may be able to skip directly to step #4 and install the frontend search code.

However, in our case we needed to setup the Crawler from scratch, since our index was out-of-date  

## 2. Link the Crawler to Your Netlify Project

On your Algolia dashboard's "Overview" page, you should see a link to "Install on your platform". Click that link and select the "Netlify" option.

This will lead you through an authentication prompt, followed by a search interface to select one of your Netlify projects.

When you select a Netlify project, Algolia will setup a crawler integration and add two environmental variables to your Netlify project to link it with the crawler.

In your Algolia dashboard, you should see a new application created. Create an index in that application.

## 3. Redeploy Your Netlify Project to Start Indexing

To fill the index, go to your Netlify deploys, find the latest production deployment, and select the "Retry with latest branch commit" action under the "Options" dropdown button. 

Redeploying your Netlify project will start Algolia indexing; go to your index to see it fill up with records.

## 4. Install Front End Search Code

Finally, install the correct front end code; likely you'll be using something like this: https://www.algolia.com/doc/tools/crawler/netlify-plugin/quick-start/#install-the-frontend-bundle

Happy searching!

## Resources

- [Official DocSearch Docs](https://docsearch.algolia.com/docs/what-is-docsearch)
- [Algolia Crawler Dashboard](https://crawler.algolia.com/)
- [Netlify Crawler Quickstart](https://www.algolia.com/doc/tools/crawler/netlify-plugin/quick-start/)
