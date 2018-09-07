# @downpourdigital/scheduler
### **THIS PACKAGE IS WORK IN PROGRESS!**

Quick'n'dirty render task scheduler.

# Installation
```
yarn add --dev @downpourdigital/scheduler
```
```
npm i -D @downpourdigital/scheduler
```
# Usage
```javascript
import Scheduler from '@downpourdigital/scheduler';


Scheduler.schedulePre( ( delta, time ) => {
	// groundbreaking physics and animation calculations here
});
Scheduler.schedule( ( delta, time ) => {
	// shiny rendering here
});
Scheduler.schedulePost( ( delta, time ) => {
	// calculations for next frame here
});

Scheduler.render(); // render frame manually
```
