# Navigation and Routing

## Routing

Map URLs to components and control what gets rendered for each path.

### defineRoutes()

Routes are created using:

```jsx
defineRoutes(routes, globalConfig?);
```

Each route path is linked to a component.

Routes can also be nested and share layouts for consistent page structure.

### Basic Example

```jsx
defineRoutes({
  "/": LandingPage,
  "/docs": {
    layout: DocsLayout,
    children: {
      "/": QuickStart,
      "/installation": {
        component: Installation,
        config: {
          documentTitle: "Installation and setup",
        },
      },
    },
  },
  "*": NotFoundPage,
});

renderApp();
```

### Route Features

- nested routes
- shared layouts
- route config
- middleware
- async route guards
- loaders

Use the wildcard route `'*'` to handle routes that do not exist.

```js
{
  '*': NotFoundPage
}
```

If a user tries to access a route that is not registered, the `NotFoundPage` component will render automatically.

```jsx
function NotFoundPage() {
  return <h1>404. Page not found.</h1>;
}
```

By default, `renderApp()` starts at `/`.

A custom initial route can also be provided `renderApp(initialPath?)`.

### Middleware

Middleware lets you run logic between route transitions.

Middleware can be:

- synchronous
- asynchronous

When using async middleware, you can provide a `loader` to render fallback UI while it resolves.

Global configuration can also be passed as the second argument to `defineRoutes()`.

### Middleware Example

```jsx
defineRoutes(
  {
    "/": LandingPage,
    "/login": {
      component: Login,
      middleware: ({ redirect }) => {
        // override global middleware
        if (isLoggedIn()) {
          redirect("/");
        }
      },
    },
  },
  // global configuration
  {
    layout: DocsLayout,
    middleware: async () => {
      // async middleware
      await checkAuth();
    },
    loader: () => <p>Loading...</p>,
  },
);
```

## Navigation

Navigate between routes without reloading the page.

### navigate()

```jsx
navigate(path?)
```

### Features

`navigate()` performs client-side route transitions in SPA mode.

Navigation happens without a full page reload, keeping the application fast and reactive.

### Example

```jsx
function WelcomeButton() {
  return <button onClick={() => navigate("/welcome")}>Go to Welcome</button>;
}
```

---

### Link

Declarative navigation component.

```jsx
<Link to="/path">content</Link>
```

### Props

| Prop        | Description                     |
| ----------- | ------------------------------- |
| `to`        | Target route path               |
| `className` | Applied to the underlying `<a>` |
| `...props`  | Other native `<a>` props        |

### Example

```jsx
<Link to="/Home" className="nav-link">
  Home
</Link>
```

`<Link />` performs SPA navigation without reloading the page.

---

### getQueryParams()

Access query parameters from the current route.

### Example Usage

```txt
/home?section=Footer
```

```jsx
const { section } = getQueryParams();
```

---

### getRouterParams()

Access dynamic route parameters.

```jsx
defineRoutes({
  "/post/:id": Post,
});
```

### Usage

```jsx
function Post() {
  const { id } = getRouterParams();
}
```

---

### getPathName()

Get the current active pathname.

```jsx
const pathname = getPathName(); // get current/active path name

console.log(pathName); // "/post/163"
```
