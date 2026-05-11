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

## DOM Refs

Create a reference to access DOM elements directly.

### useElementRef()

```jsx
const ref = useElementRef(tag?);
```

### Features

`useElementRef()` is mainly used for:

- direct DOM access
- element measurements
- focus management
- scrolling
- manual DOM manipulation

Unlike state, refs do not trigger re-renders.

They are meant for storing element references, not reactive UI values.

Values stored inside refs persist across renders without causing updates.

### Basic Example

```jsx
function App() {
  const divRef = useElementRef("div");

  setEffect(() => {
    divRef.el.style.backgroundColor = "navy";
  });

  return <div ref={divRef}>...</div>;
}
```

### Returned Object

```jsx
{
  (el, _tag);
}
```

`el`: The attached DOM element.

`_tag`: The expected element tag type.

Example:

```jsx
const divRef = useElementRef("div");
```

returns:

```jsx
{
  el: HTMLDivElement,
  _tag: "div"
}
```

**Providing a tag enables proper element _type suggestions_** such as:

```jsx
divRef.el.style;
divRef.el.scrollTop;
divRef.el.focus();
```

### Generic Usage

If no tag is provided, the ref can attach to any element.

```jsx
const ref = useElementRef();
```

### Restrictions

::: warning Ref limitations

A ref instance can only be attached to a single element.

```jsx
<div ref={myRef} />
<button ref={myRef} /> // invalid
```

Typed refs can only be attached to matching elements.

```jsx
const divRef = useElementRef("div");

<div ref={divRef} />      // valid
<button ref={divRef} />   // invalid
```

:::

## Lazy-load and Await

Lazy-load components using dynamic imports.

### load()

```jsx
const Component = load(
  importFunction,
  exportKey?
);
```

### Features

`load()` creates an async component that loads only when needed.

This helps reduce initial bundle size and improves loading performance.

The returned component can only be rendered inside `<Await />`.

### Parameters

### `importFunction`

Function returning a dynamic import.

```jsx
() => import("./Component");
```

### `exportKey`

Name of the exported component to load.

```jsx
load(() => import("./Comp"), "Navbar");
```

If omitted, `"default"` is used automatically.

### Default Export Example

```jsx
const Navbar = load(
  () => import("../components/Navbar"),
  // take "default" as default argument automatically
);
```

Used for:

```jsx
export default Navbar;
```

### Named Export Example

```jsx
const Navbar = load(() => import("../components/Navbar"), "Navbar");
```

Used for:

```jsx
export { Navbar };
```

---

### Await

Render fallback UI while async components are loading.

```jsx
<Await loader={LoaderComponent}>
  <AsyncComponent />
</Await>
```

### Features

`<Await />` handles rendering async components created using `load()`.

The `loader` prop renders temporary UI until all async imports resolve.

### Basic Example

```jsx
const Navbar = load(() => import("../components/Navbar"));

function App() {
  return (
    <Await loader={() => <h1>loading...</h1>}>
      <Navbar />
    </Await>
  );
}
```

### Multiple Async Components

`<Await />` can handle multiple async components together.

```jsx
<Await loader={() => "loading..."}>
  <Navbar />
  <Footer />
</Await>
```

The loader remains visible until all async components finish loading.

::: warning Async component restriction

Components created using `load()` must be rendered inside `<Await />`.

```jsx
<Navbar /> // invalid

// valid
<Await loader={() => "loading..."}>
  <Navbar />
</Await>
```

:::

## Portal

Render UI outside the main DOM tree while keeping it connected to the component hierarchy.

### Syntax

```jsx
<Portal target={element?}>
  content
</Portal>
```

### Features

Content inside `<Portal />` renders outside the normal parent DOM structure but still behaves as part of the same application tree.

This is useful for:

- modals
- dialogs
- tooltips
- dropdowns
- overlays

Portals help avoid:

- z-index conflicts
- overflow clipping
- positioning issues

### Basic Example

```jsx
function App() {
  return (
    <Portal>
      <div className="modal">Modal Content</div>
    </Portal>
  );
}
```

By default, portal content is rendered into:

```jsx
document.body;
```

### Custom Target

Use the `target` prop to render into a specific element.

### Behavior

Even though the DOM is rendered outside the main tree:

- state still works
- events still work
- context remains connected
- reactivity is preserved

The portal behaves like a normal part of the component tree.

::: tip Common usage

`<Portal />` is primarily designed for overlays and floating UI where normal DOM nesting causes layout or stacking issues.

:::

## Route Effect

Run logic whenever the current route changes.

### useRouteEffect()

```jsx
useRouteEffect((path) => {
  // route changed
});
```

### Features

`useRouteEffect()` is mainly useful inside layout components or persistent wrappers that do not re-render during navigation.

It allows you to react to route changes even when the component itself stays mounted.

### Example

```jsx
function DocsLayout({ Child }) {
  useRouteEffect((path) => {
    console.log(
      "Route changed:",
      path(), // returns the current active route.
    );
  });

  return (
    <div>
      <Navbar />
      <Child />
    </div>
  );
}
```

### Why use `useRouteEffect()`?

::: tip Best place to use

Layout components usually remain mounted between route transitions.

Because of that, normal lifecycle logic may not run again during navigation.

`useRouteEffect()` solves this by running whenever the route changes.

`useRouteEffect()` is most useful inside shared layouts and persistent components that survive route transitions.

:::
