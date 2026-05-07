# Quick Reference

## State

Reactive state used to store values that can change over time and automatically update the UI.

### Syntax

```jsx
const value = state(initialValue);
```

### Returns

`state()` returns a function used to read the current value.

It also includes a:

```jsx
.set(newValue | (prev) => newValue)
```

method used to update the state.

### Example

```jsx
function App() {
  const count = state(0);

  const handleClick = () => {
    count.set(18); // direct value

    count.set((p) => p + 1); // update from previous value
  };

  return <button onClick={handleClick}>You Clicked {count()} times!</button>;
}
```

::: tip Reactive Access

Calling `count()` inside JSX always returns the latest value.

When the state changes, the UI updates automatically.

:::

## List state

Reactive array state with built-in mutation helpers for predictable UI updates.

### Syntax

```jsx
const items = state(list(initialValue));
```

### Features

`list()` provides helper methods to modify arrays while keeping the UI in sync.

Instead of replacing the whole array manually, you can directly:

- add items
- update items
- remove items
- reset the list

Unlike regular arrays, reactive list rendering should use `<For />` instead of `.map()` for better control, predictable updates, and performance.

### Example

```jsx
function App() {
  const users = state(list([]));

  return (
    <div>
      <button onClick={() => users.push({ name: "John" })}>Add User</button>

      <button
        onClick={() =>
          users.update(0, {
            name: "Updated User",
          })
        }
      >
        Update First
      </button>

      <button onClick={() => users.remove(1)}>Remove Second</button>

      <button onClick={() => users.set([])}>Reset</button>

      {/* ...other helper methods */}

      <ul>
        <For each={users()}>{(user, i) => <li>{user.name}</li>}</For>
      </ul>
    </div>
  );
}
```

::: info Why use `list()`?

Regular arrays are not reactive.  
Calling methods like `.push()` or `.splice()` directly will not reliably update the UI.

`list()` provides controlled mutations such as:

- `push()`
- `update()`
- `remove()`
- `set()`
- and more...

These methods keep rendering predictable and synchronized.

**Internally, list methods apply direct updates instead of diffing the entire array. This avoids unnecessary re-renders and does not rely on keys for normal operations.**

For predictable updates (add, update, remove), prefer list methods.

For complex transformations like filtering or remapping, use:

```jsx
users.set(newArray);
```

**`set()` operations with reordered items may require keys.**

:::

## Global store/states

Create reactive global state shared across the entire application.

### createStore()

```jsx
const store = createStore({
  key: value,
});
```

### Features

Global stores can contain:

- normal reactive state
- list state using `list()`
- shared application data

Store values can be accessed from any component using `useGlobal()`.

### Creating a Store

```jsx
import { createStore, list } from "@vebeljs/vebel";

export const store = createStore({
  user: {
    name: "Kevin",
    username: "kevi73",
  },
  posts: list([]),
});
```

### Using Global State

```jsx
function Profile() {
  const { posts, user } = useGlobal(store);

  return (
    <div>
      <h2>{user().name}</h2>
      <p>Username: {user().username}</p>
      <p>Total posts: {posts.size}</p>
    </div>
  );
}
```

### Notes

- Global state is reactive.
- Components update automatically when used store values change.
- `list()` works the same way as local list state.

::: warning Unique store keys

Store keys must be globally unique across all stores.

This will throw an error:

```jsx
const store1 = createStore({
  user: {},
});

const store2 = createStore({
  user: {},
});
```

Because the `user` key already exists in another store.

:::

## Preserved state

Create reactive state that persists across page reloads.

### preservedState()

```jsx
const value = preservedState(key, initialValue);
```

### Features

`preservedState()` behaves like normal `state()`.

```jsx
value();
value.set(newValue);
```

The difference is that its value is preserved even after a hard page reload.

This is useful for restoring temporary UI state such as:

- scroll position
- active tabs
- form progress
- sidebar state
- filters

### Example

```jsx
const scrollPos = preservedState("scroll-pos", 0);

window.addEventListener("scroll", () => {
  scrollPos.set(window.scrollY);
});

window.scrollTo(0, scrollPos());
```

In this example:

- user scrolls to `700`
- page reloads
- value remains preserved
- scroll can be restored manually

`preservedState()` only stores the value.

The restore logic must be handled by the user.

::: warning Avoid overusing preserved state

Persisted values may affect performance if overused.

Avoid storing:

- very large arrays
- deeply nested objects
- heavy application data

Although supported, preserve large data only when truly necessary.

:::

## Reactive props

Access reactive parent state inside child components.

### fromParent()

```jsx
fromParent(componentName?)
```

### Access Types

`fromParent()` provides access to reactive values exposed by parent components.

Available groups:

```jsx
fromParent().state;
fromParent().list;
```

You can access values from:

- immediate parent
- specific ancestor component

### Example

```jsx
function Child() {
  // normal state
  const { count } = fromParent().state;
  // list state
  const { users } = fromParent().list;
  // access from specific ancestor
  const { product } = fromParent("Product").state;

  const increaseQuantity = () => {
    product.set((p) => ({
      ...p,
      quantity: p.quantity + 1,
    }));
  };

  return (
    <div>
      <p>Total users: {users.size}</p>
      <p>Count: {count()}</p>
      <button onclick={increaseQuantity}>Increase product quantity</button>
    </div>
  );
}

function App() {
  const num = state(0, "count");

  return (
    <>
      <p>{num()}</p>
      <Child />
    </>
  );
}
```

::: info Named state access

Reactive values must be created with a name to be accessible through `fromParent()`.

```jsx
const count = state(0, "count");
```

Without a name, the state cannot be accessed by child components.

:::

::: tip Component updates

Child components are not affected by normal parent re-renders.

They only update when the reactive values they use actually change.

:::

## Effects

Runs side effects after the component renders.

### Syntax

```jsx
setEffect(callback, dependencies?, options?);
```

### Behavior

`setEffect()` is commonly used for:

- logging
- API calls
- subscriptions
- timers
- DOM interactions

By default, the effect runs once after the first render.

If dependencies are provided, the effect re-runs whenever those values change.

### Basic Example

```jsx
function App() {
  setEffect(() => {
    console.log("Component mounted");
  });

  return <p>Hello</p>;
}
```

### Cleanup Function

You can return a cleanup function from the effect.

The cleanup runs before unmounting or before the effect re-runs.

```jsx
function App() {
  setEffect(() => {
    console.log("Component mounted");

    return () => {
      console.log("Cleanup | Component Unmounted");
    };
  });

  return <p>Hello</p>;
}
```

### Dependency Example

Effects re-run whenever one of their dependencies changes.

```jsx
function App() {
  const count = state(0);

  setEffect(() => {
    console.log("Count changed:", count());
  }, [count]);

  return (
    <button onClick={() => count.set((p) => p + 1)}>Count: {count()}</button>
  );
}
```

### Async Example

```jsx
function App() {
  setEffect(async () => {
    const data = await fetch("/api");

    console.log(data);
  });

  return <p>Loading..</p>;
}
```

::: warning Async inside `setEffect()`

**If you use `async` directly inside `setEffect()`, do not return a cleanup function.**

**Async functions always return a Promise, which conflicts with cleanup behavior.**

If you need both async logic and cleanup, wrap async code inside a normal function.

```jsx
function App() {
  setEffect(() => {
    async function load() {
      await fetch("/api");
    }

    load();

    return () => {
      console.log("Cleanup");
    };
  });

  return <p>Hello</p>;
}
```

:::

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
