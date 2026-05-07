# Getting Started

## Installation

```bash
npx vebel create my-app
cd my-app
npm start
```

## Your first app

```jsx
import { renderApp, defineRoutes, state } from "@vebeljs/vebel";

function App() {
  const count = state(0);

  return (
    <button onClick={() => count.set((c) => c + 1)}>Counter: {count()}</button>
  );
}

defineRoutes({
  "/": App,
});

renderApp();
```

## Why Vebel?

It became hectic to manage code when the entire component tree re-renders on every state change.  
Vebel tracks exactly where each state value is used in the DOM and **updates only that part — no virtual DOM, no diffing, no unnecessary work.**
Components won't re-run/render again even if state changes.
