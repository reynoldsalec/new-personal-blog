---
date: 2021-12-10 22:55:00
title: "Overriding default theme components in Vuepress 2"
description: "If you're trying to override some of the components provided by the theme-default in Vuepress 2.x, here's your guide."
tags:
  - dev tools
---

## DEPRECATED!!!
Shortly after I wrote this post, one of the Vuepress 2.x maintianers [decided to implement `alias`](https://github.com/vuepress/vuepress-next/issues/104#issuecomment-1009903266) on all the default theme components. Use [that method](https://v2.vuepress.vuejs.org/reference/default-theme/extending.html#components-replacement) to override theme components!

I've included the "legacy" post below, but know that it is outdated information and shouldn't be used in your project when using `alias` works great.

## Legacy Post

**tl;dr Because `theme-default` in Vuepress 2.x doesn't implement `alias`, you'll need to use the slots provided by `theme-default`'s Layout.vue.**

Vuepress is a great way to get sites going quickly and it comes with a default theme that doesn't look half-bad, particularly if you're making a documentation site for a code project. However, there's always some assumption that the default theme ([`theme-default`](https://github.com/vuepress/vuepress-next/tree/main/packages/%40vuepress/theme-default)) makes that isn't going to jive with your plans for documentation domination. Typically this means you're going to want to edit one of the Vue components provided by `theme-default`.

In Vuepress 1.x, the fix was easy: simply creating a new component in your theme's `/components` directory worked as long as you correctly extended the theme.

However, Vuepress 2.x made a few changes that breaks this ability:

1. It [dropped finding components by convention](https://v2.vuepress.vuejs.org/guide/migration.html#conventional-files-change); you'll have to either explicitly load components OR use `@vuepress/plugin-register-components`.
2. [`theme-default` doesn't use the "alias" functionality](https://github.com/vuepress/vuepress-next/issues/104), which is the recommended method for allowing theme authors to extend your theme's components: https://v2.vuepress.vuejs.org/reference/default-theme/extending.html#components-replacement

## The Almighty Slot

Fortunately, if you like `theme-default` and want to hack around with it, there's an easy and clean way to extend _most_ of the major components, like the navbar, sidebar, and footer: using slots.

Slots are areas defined in a Vuepress layout where content can be swapped in by people overriding your theme. For example, in `theme-default` you'll see the following:

```vue
    <slot name="navbar">
      <Navbar v-if="shouldShowNavbar" @toggle-sidebar="toggleSidebar">
        <template #before>
          <slot name="navbar-before" />
        </template>
        <template #after>
          <slot name="navbar-after" />
        </template>
      </Navbar>
    </slot>
```

By creating our own Layout.vue, we can implement the `navbar` slot and insert our own Navbar component within it.


## 1. Create Your Own Navbar component

Create the new file:
```bash
mkdir theme/components
touch theme/components/Navbar.vue
```

Create a new Vue component for your Navbar. You can start by copying the Navbar from `theme-default`:
```bash
cp project-root/node_modules/@vuepress/theme-default/lib/client/components/Navbar.vue
```

If you do that, you'll need to edit the `import` statements to respect the path change:

```js
import { useDarkMode, useThemeLocaleData } from '@vuepress/theme-default/lib/client/composables'
import NavbarLinks from '@vuepress/theme-default/lib/client/components/NavbarLinks.vue'
import ToggleDarkModeButton from '@vuepress/theme-default/lib/client/components/ToggleDarkModeButton.vue'
import ToggleSidebarButton from '@vuepress/theme-default/lib/client/components/ToggleSidebarButton.vue'
```

## 2. Load The Component

As earlier mentioned, you have two choices for loading the component. I'll show you how to manually load it using clientAppEnhance.js.

Create a file named `clientAppEnhance.js` at the root of your .vuepress file, and insert the following:

```js
import { defineClientAppEnhance } from "@vuepress/client";
import Navbar from "./theme/components/Navbar.vue";

export default defineClientAppEnhance(({ app, router, siteData }) => {
  app.component("Navbar", Navbar);
});
```

## 2. Configure Your Theme to Extend `theme-default`

Your theme's `index.js` should look something like this:

```js
const { path } = require('@vuepress/utils')

module.exports = {
  theme: path.resolve(__dirname, '.'),
  extends: '@vuepress/theme-default',
  layouts: {
    Layout: path.resolve(__dirname, 'layouts/Layout.vue'),
  },
}
```

## 3. Create your Layout.vue and Insert Your Navbar.vue into The Slot

Create `Layout.vue` in your theme directory's "layouts" folder, then override the `theme-default`'s "navbar" slot to insert your own Navbar component:

```vue
<template>
  <Layout>
    <template #navbar>
      <Navbar />
    </template>
  </Layout>
</template>

<script>
import Layout from '@vuepress/theme-default/lib/client/layouts/Layout.vue'

export default {
  components: {
    Layout,
  },
}
</script>
```

With that, you should see the content of your Navbar.vue displayed instead of `theme-default`'s normal navbar!