import ScheduledTask, { renderFunction } from './ScheduledTask';


export default class TaskScheduler {
	private lastFrameTime: number = performance.now();
	private nextFrame?: number;
	private tasks: ScheduledTask[] = [];
	private preTasks: ScheduledTask[] = [];
	private postTasks: ScheduledTask[] = [];
	private deferredTasks: ScheduledTask[] = [];


	constructor() {
		document.addEventListener( 'visibilitychange', () => {
			if ( this.nextFrame ) {
				if ( document.hidden ) {
					this.stop();
				} else {
					this.start();
				}
			}
		});
	}


	private consume( func: renderFunction, priority: number, list: ScheduledTask[]): ScheduledTask {
		const task = new ScheduledTask({
			func,
			priority,
			scheduler: this,
		});

		list.push( task );
		this.sort();


		return task;
	}


	public schedule( func: renderFunction, priority?: number ): ScheduledTask {
		return this.consume( func, priority || 1000, this.tasks );
	}


	public schedulePre( func: renderFunction, priority?: number ): ScheduledTask {
		return this.consume( func, priority || 1000, this.preTasks );
	}


	public schedulePost( func: renderFunction, priority?: number ): ScheduledTask {
		return this.consume( func, priority || 1000, this.postTasks );
	}


	public scheduleDeferred( func: renderFunction, priority?: number ): ScheduledTask {
		return this.consume( func, priority || 1000, this.deferredTasks );
	}


	public unschedule( task: ScheduledTask ) {
		[
			this.preTasks,
			this.tasks,
			this.postTasks,
			this.deferredTasks,
		].forEach( ( taskList ) => {
			if ( taskList.includes( task ) ) {
				taskList.splice( taskList.findIndex( t => t === task ), 1 );
			}
		});
	}


	public sort() {
		[
			this.preTasks,
			this.tasks,
			this.postTasks,
			this.deferredTasks,
		].forEach( ( taskList ) => {
			taskList.sort( ( a, b ) => a.priority - b.priority );
		});
	}


	public render() {
		const time = performance.now();
		const delta = Math.min( 8, ( time - this.lastFrameTime ) / 16.667 );

		this.lastFrameTime = time;

		[
			...this.preTasks,
			...this.tasks,
			...this.postTasks,
		].forEach( t => t.render( delta, time ) );


		const deferredTask = this.deferredTasks.shift();
		if ( deferredTask ) {
			deferredTask.render( delta, time );
		}
	}


	private loop() {
		this.render();

		this.nextFrame = requestAnimationFrame( () => this.loop() );
	}


	public start() {
		this.stop();

		this.lastFrameTime = performance.now();
		this.nextFrame = requestAnimationFrame( () => this.loop() );
	}


	public stop() {
		if ( this.nextFrame ) cancelAnimationFrame( this.nextFrame );
	}
}
