# @downpourdigital/scheduler
### **THIS PACKAGE IS WORK IN PROGRESS!**

Quick'n'dirty render task scheduler.

# Installation
```
yarn add @downpourdigital/scheduler
```
```
npm i @downpourdigital/scheduler
```
# Usage
```javascript
import Scheduler from '@downpourdigital/scheduler';


const priority = 42; // optional value to manipulate execution order, default is 1000

const taskA = Scheduler.schedulePre( ( delta, time ) => {
	// reoccurring, run once per frame
	// groundbreaking physics and animation calculations here
}, priority );
const taskB = Scheduler.schedule( ( delta, time ) => {
	// reoccurring, run once per frame
	// shiny rendering here
}, priority );
const taskC = Scheduler.schedulePost( ( delta, time ) => {
	// reoccurring, run once per frame
	// calculations for next frame
}, priority );
const taskD = Scheduler.scheduleDeferred( ( delta, time ) => {
	// run only once, may be delayed to improve performance.
	// heavy calculations here (such as texture uploads to gpu). Only one task is run per frame.
}, priority );


taskA.setPriority( 999 ); // priority can be set for an already scheduled task
taskD.unschedule(); // tasks can be cancelled like this –
Scheduler.unschedule( taskC ); // or like this.

Scheduler.render(); // render frame manually
Scheduler.start(); // start loop manually
Scheduler.stop(); // stop loop manually
```
