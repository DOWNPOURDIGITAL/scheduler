import TaskScheduler from './TaskScheduler';


export type renderFunction = ( delta: number, time: number ) => void;


export interface TaskConfig {
	func: renderFunction;
	priority: number;
	scheduler: TaskScheduler;
}


export default class ScheduledTask {
	private func: renderFunction;
	public priority: number;
	public shouldRender: boolean = true;
	private scheduler: TaskScheduler;


	constructor( config: TaskConfig ) {
		this.func = config.func;
		this.priority = config.priority;
		this.scheduler = config.scheduler;
	}


	render( delta: number, time: number ) {
		if ( this.shouldRender ) this.func( delta, time );
	}


	setPriority( priority: number ) {
		this.priority = priority;
		this.scheduler.sort();
	}


	unschedule() {
		this.scheduler.unschedule( this );
	}
}
