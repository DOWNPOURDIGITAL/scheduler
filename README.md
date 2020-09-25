# @downpourdigital/scheduler

![npm bundle size](https://img.shields.io/bundlephobia/minzip/@downpourdigital/scheduler?color=green&style=for-the-badge) ![npm dependencies](https://img.shields.io/david/DOWNPOURDIGITAL/scheduler?color=green&style=for-the-badge)

A simple render task scheduler.

## Installation

```
yarn add @downpourdigital/scheduler
```
```
npm i --save @downpourdigital/scheduler
```

## Usage
```typescript
import scheduler, {
	read,
	update,
	render,
	postRender,
	loop,
	defer,
} from "@downpourdigital/scheduler";
```

Each frame is divided intro several phases:

1. `read`
2. `update`
3. `render`
4. `postRender`

They should be self-descriptive. Each phase is executed after the other.

`read()`, `update()`, `render()` and `postRender()` cause the supplied function to be executed at the next possible opportunity.

Additionally, `defer()` allows you to postpone an expensive action. A maximum of one action is executed per frame. The deferred queue can be paused and resumed with `scheduler.pauseDeferred()` and `scheduler.resumeDeferred()` respectively.
The execution order can be altered by giving the task a priority. (The higher, the earlier the task will be executed.) The default priority is `0`.

`loop()` lets you schedule a function for execution on every frame.

All helpers return a function, that, when executed, cancels the task.


## Start

To start the scheduler, call `scheduler.start()` once your application is ready. It can be paused again with `scheduler.pause()`. Execution will be automatically paused if the tab/window is out of view.

Similarly, `scheduler.resumeDeferred()` needs to be called to start executing deferred tasks. Ideally this should happen inside a call to `window.requestIdleCallback`.



## Example

```typescript
import scheduler, {
	read,
	update,
	render,
	postRender,
	loop,
	defer,
} from '@downpourdigital/scheduler';


scheduler.start();
window.requestIdleCallback( () => scheduler.resumeDeferred() );


// update something once
update( ( delta, time ) => someDomNode.style.opacity = 1 );

const cancel = loop( ( delta, time ) => ([
	update( () => {
		someDomNode.style.opacity = Math.sin( time ) * .5 + .5;
	}),
	postRender( () => {
		// calculate something for next frame
		// e.g. advance a physics sim
	}),
]) );

// calling cancel() will cancel the loop as well as all
// associated tasks that have not yet been executed

setTimeout( () => {
	// cancel the loop after 1 second
	cancel();
}, 1000 );

defer( () => {
	// something expensive
	// like uploading a texture to the GPU
}, 1 ); // optional priority
```

## To do

- better docs
- testing



## License
© 2020 [DOWNPOUR DIGITAL](https://downpour.digital), licensed under BSD-4-Clause