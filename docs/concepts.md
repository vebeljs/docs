# Fundamentals

## JSX {#jsx}

JSX lets you write HTML-like syntax inside JavaScript.

It gets converted into function calls that create UI elements.

### Dynamic Values in JSX

JSX allows you to insert JavaScript values directly inside your UI using `{ }` braces.

Anything inside these braces is treated as JavaScript, not plain text.  
This lets you display variables, run expressions, and update UI dynamically.

In the example below, the `count` variable is inserted into the button text.  
Similarly, attribute values can also be written inside braces.

When the value changes, the UI updates automatically.

### Example

```jsx
function App() {
  const count = 28;

  const handleClick = () => {
    console.log("Button clicked!!");
  };

  return (
    <div className="p-3">
      <button onClick={handleClick}>You Clicked {count} times!</button>
    </div>
  );
}
```

::: warning Editor Suggestions ≠ Framework Rules

When writing JSX, your editor (like VS Code) may show suggestions based on React. These include attributes, events, and component patterns.

These suggestions come from React typings, not this framework. Most of the time it works fine, but some behaviors may differ.

For example, both `onclick` and `onClick` work here. Similarly, `class` and `className` are supported (prefer `className`).

If you want accurate suggestions for this framework, you can use the `Dom` helper.

```jsx
import { Dom as E } from "@vebeljs/vebel";

function App() {
  return (
    <E.div className="container">
      <E.button onclick={() => console.log("clicked")}>Click Me</E.button>
    </E.div>
  );
}
```

:::

## Components {#components}

A component is a function that returns UI.  
It helps you split your interface into reusable pieces.

Instead of writing everything in one place, you create small components and use them like custom HTML tags.

Components can accept inputs (`props`) and render different UI based on them.

### Example

```jsx
// Reusable component
function Button({ text }) {
  return <button>{text}</button>;
}

// Root component
function App() {
  return (
    <div>
      <Button text="Click Me" />
      <Button text="Submit" />
    </div>
  );
}
```

## Event Handling {#event-handling}

You can respond to user interactions like clicks, input changes, and more using event handlers.

Events are passed as attributes such as `onClick`, `onInput`, etc.

You can pass a function to handle the event.  
This function runs when the event occurs.

Both camelCase (`onClick`) and lowercase (`onclick`) event names are supported.

### Example

```jsx
function App() {
  const count = state(0);

  const handleChange = (e) => {
    count.set(e.target.value?.length);
  };

  return (
    <div>
      <input oninput={handleChange} />

      <p>Typed text has {count()} letters.</p>

      <button onClick={() => count.set((p) => p + 1)}>
        {/* inline event handler */}
        Increment counter: {count()}
      </button>
    </div>
  );
}
```

## Conditional Rendering {#conditional-rendering}

You can show or hide parts of the UI based on conditions using JavaScript expressions inside `{}`.

The most common pattern is using `&&` to render something only when a condition is true.  
If the condition is false, nothing is rendered.

Another common pattern is using the ternary operator (`condition ? A : B`) to render different UI based on a condition.

### Example

```jsx
function App() {
  const count = state(0);

  return (
    <div>
      <button onClick={() => count.set((p) => p + 1)}>Count: {count()}</button>

      {count() > 0 ? <p>Positive value</p> : <p>Negative value</p>}

      {count() > 0 && count() % 2 === 0 && <p>Even value</p>}
    </div>
  );
}
```

## Rendering Lists {#render-lists}

To render lists, use the `<For />` component.

`<For />` is designed for reactive arrays created using `state()` or `state(list())`.

It takes a reactive array using the `each` prop and a function as its child that returns UI for each item.

For static or non-reactive arrays, you can use `.map()` directly.

Using `<For />` with reactive data ensures efficient, predictable updates and better performance.

### Example

```jsx
const productCategory = ["electronics", "clothing", "furniture"];

function App() {
  const users = state(list([{ name: "John" }, { name: "Jane" }]));

  return (
    <div>
      <button onClick={() => users.push({ name: "New User" })}>Add User</button>

      {/* Reactive lists */}
      <ul>
        <For each={users()}>
          {(user, index) => (
            <li>
              {index}: {user.name}
            </li>
          )}
        </For>
      </ul>

      {/* Static lists */}
      <ul>
        {productCategory.map((ct) => (
          <li>{ct}</li>
        ))}
      </ul>
    </div>
  );
}
```

## Props {#props}

### Static Props

Props are used to pass data from a parent component to a child component.

You can pass values as attributes and access them inside the component.

Props are meant for normal data.  
Reactive values (`state`) should not be passed directly as props.

### Example

```jsx
// Child component
function Button({ text, handleClick }) {
  return <button onclick={handleClick}>{text}</button>;
}

// Parent component
function App() {
  return (
    <div>
      <Button text="Click Me" handleClick={() => console.log("click")} />

      <Button text="Submit" handleClick={() => console.log("submit")} />
    </div>
  );
}
```

### Passing reactive props

If you pass `state` directly as props, the child cannot determine whether it is reactive or not.
Reactive parent values should be accessed using [`fromParent()`](/guide/quick-reference#reactive-props).
