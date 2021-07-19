---
date: 2021-07-19 22:55:00
title: "Analyzing GitLab's Subscription Pricing"
description: "GitLab's buyer-based subscription pricing is either a masterstroke of genius, or a sieve for uncaught enterprise revenue."
tags:
  - strategy
  - product
---

**tl;dr GitLab may be taking some risks with flat pricing the enterprise, but the benefits of simplicity for customers and revenue reliability probably win out in the end.**

GitLab has an amazingly simple and seemingly generous subscription model. Despite having a multifunctional product, GitLab has reduced itself to three plans, clearly targeted to three buyer personas:

**Free** -> Individual users. Covers version control (VCS) needs, and even gives a "taster" of their CI/CD task runners for 400 minutes.

**Premium ($19/month/user)** -> For teams. Introduces more project management features, controls on running releases, and a health offering of 10,000 CI/CD minutes. Adds priority support.

**Ultimate ($100/month/user)** -> For enterprise teams. Primarily adds security and compliance functionality. 50,000 CI/CD minutes.

What's striking is how little GitLab has in the way of explicit "add-ons". Yes, [extra CI/CD minutes will cost you](https://customers.gitlab.com/plans), as will storage for those with extremely large repositories. But with very few exceptions (a notable one being some [specialized professional services](https://about.gitlab.com/services/catalog/) like trainings), GitLab tries to put everyone from individuals trying out the service to enterprises looking to self-host for high-compliance needs on the same pricing schedule.

## How Do True Ups Impact Revenue and Account Relations?

One oddity of GitLab's subscription policy is the concept of "true ups". GitLab enforces annual subscriptions. At the beginning of your subscription, you buy a certain number of seats. If, at the end of your subscription, you have exceeded that number of seats, you're charged for the additional seats both for the previous year and the coming year.

I was surprised when I first read this; surely they must just pro-rate additional licenses, only charging you from the date the extra seat was added? However, reviewing their subscription agreement confirmed the seemingly draconian policy: "Add-On Users shall be priced at the then-current list price of the Software and shall not include any pro-ration, set-off and/or deduction to account for term of use, or otherwise."

I'm curious how GitLab account managers handle this. Are there some big surprises and ruffled feathers when the annual term ends? Even with how clearly GitLab messages the policy, there must be an uncomfortable percentage of people who are very unhappy when looking at their new bill.

GitLab seems to want to reconstruct the pricing relationship with customers to think of GitLab less as a "take what you want" SaaS service, and more as a capital investment in infrastructure. This matches their philosophy around self-hosting: GitLab doesn't change pricing whether you self-host or run on their servers (with the exception of task runner minutes, which only cost money on their infrastructure). When you buy GitLab, you're buying an entire package of software. Team size is a mere proxy for the amount of resources that supporting your organization will take; fluctuations in your dev team size should be immaterial to that base calculation.

It's safe to assume that this pricing model leads to greater stability in GitLab's revenue. GitLab can treat all of its subscriptions as "lower bound" revenue estimates. Additionally, they can spend less time selling and negotiating finicky add-ons. But does the lack in granularity in plan construction limit their revenue potential, particularly in the enterprise?

## Is GitLab Missing Out on More Enterprise Revenue?

There are two potential risks I see with GitLab's flat pricing model for enterprise revenue collection:

1.  Could GitLab be turning away organizations with large amounts of developers?

2.  Could GitLab be undercharging some orgs who might pay more for specific features if they were atomized?

There's reason to believe that GitLab may be misstepping here. For example, GitHub, which has adopted a similar (although noticeably less expensive and pro-rated) [pricing model](https://github.com/pricing), reserves certain enterprise features like automated security scanning and premium support SLAs as add-ons. It's safe to assume that these features are probably quite costly, especially the support SLA. Atlassian Bitbucket, another direct competitor, has [a pricing model](https://www.atlassian.com/software/bitbucket/pricing) similar to GitHub's.

Again, GitLab is making a bet on simplicity and long-term contracts. It's worth noting that, on G2 Crowd, both GitHub and GitLab have similar percentages of large, medium, and small companies reviewing their products. This may indicate that GitLab isn't driving away the enterprise through pricing, although it could be that its enterprise-friendly self-hosting functionality is the "honey" that keeps big companies coming back despite whatever "sting" they could feel.

## Conclusion


GitLab has innovated a unique open-core business model centered around transparency and simplicity. Its pricing model supports those core values well. While I'm concerned that maintaining a flat enterprise pricing structure may not be sustainable long-term, I'm hopeful that GitLab is paving the way for other dev tool companies. Buyer-based pricing delivers simplicity for customers and reliability for companies, a win-win in my book.