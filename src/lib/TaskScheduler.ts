import ScheduledTask, { renderFunction } from './ScheduledTask';


export default class TaskScheduler {
	private lastFrameTime: number = performance.now();
	private nextFrame?: number;
	private tasks: ScheduledTask[] = [];
	private preTasks: ScheduledTask[] = [];
	private postTasks: ScheduledTask[] = [];


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


	public unschedule( task: ScheduledTask ) {
		this.preTasks.splice( this.preTasks.findIndex( t => t === task ), 1 );
		this.tasks.splice( this.tasks.findIndex( t => t === task ), 1 );
		this.postTasks.splice( this.postTasks.findIndex( t => t === task ), 1 );
	}


	public sort() {
		this.preTasks.sort( ( a, b ) => a.priority - b.priority );
		this.tasks.sort( ( a, b ) => a.priority - b.priority );
		this.postTasks.sort( ( a, b ) => a.priority - b.priority );
	}


	public render() {
		const time = performance.now();
		const delta = ( time - this.lastFrameTime ) / 16.667;

		this.lastFrameTime = time;

		[
			...this.preTasks,
			...this.tasks,
			...this.postTasks,
		].forEach( t => t.render( delta, time ) );
	}


	private loop() {
		this.render();

		this.nextFrame = requestAnimationFrame( () => this.loop() );
	}


	public start() {
		this.stop();

		this.nextFrame = requestAnimationFrame( () => this.loop() );
	}


	public stop() {
		if ( this.nextFrame ) cancelAnimationFrame( this.nextFrame );
	}
}
