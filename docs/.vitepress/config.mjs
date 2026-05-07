import { defineConfig } from "vitepress";

export default defineConfig({
  title: "Vebel",
  description: "Lightweight JSX framework with fine-grained reactivity",
  base: "/docs/",
  sitemap: {
    hostname: "https://vebeljs.github.io/docs/",
  },
  head: [
    [
      "meta",
      {
        name: "keywords",
        content:
          "vebel, vebeljs, jsx framework, fine-grained reactivity, javascript framework",
      },
    ],
    [
      "meta",
      { property: "og:title", content: "Vebel — Lightweight JSX Framework" },
    ],
    [
      "meta",
      {
        property: "og:description",
        content: "Lightweight JSX framework with fine-grained reactivity",
      },
    ],
  ],
  themeConfig: {
    logo: "/logo.svg",
    nav: [
      { text: "Home", link: "/" },
      { text: "Guide", link: "/guide/getting-started" },
      { text: "GitHub", link: "https://github.com/vebeljs/vebel" },
    ],

    outline: {
      level: [2, 3],
    },

    sidebar: [
      {
        text: "Introduction",
        items: [
          { text: "What is Vebel?", link: "/guide/what-is-vebel" },
          { text: "Getting Started", link: "/guide/getting-started" },
          { text: "Quick Reference", link: "/guide/quick-reference" },
        ],
      },
      {
        text: "Concepts",
        items: [
          { text: "JSX", link: "/concepts#jsx" },
          { text: "Components", link: "/concepts#components" },
          { text: "Event handling", link: "/concepts#event-handling" },
          {
            text: "Conditional Rendering",
            link: "/concepts#conditional-rendering",
          },
          { text: "Rendering Lists", link: "/concepts#render-lists" },
          { text: "Props", link: "/concepts#props" },
        ],
      },
      {
        text: "API Reference",
        items: [
          { text: "All APIs", link: "/api" }, // ← single page
        ],
      },
    ],

    socialLinks: [{ icon: "github", link: "https://github.com/vebeljs/vebel" }],

    footer: {
      message: "Released under the MIT License.",
      copyright: "Copyright © 2026 Vebel",
    },
  },
});
