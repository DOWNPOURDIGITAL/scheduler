
type cancelFunc = () => void;
export type Task = ( delta: number, time: number ) => void;
export type LoopTask = ( delta: number, time: number ) => void | cancelFunc[];
export type DeferredTask = {
	priority: number;
	task: Task;
};


export default class Scheduler {
	private lastFrameTime = 0;
	private timeOffset = 0;
	private pauseStart = 0;
	private nextFrame: number;
	private runDeferred = false;
	private associatedTasks = new Map<LoopTask, cancelFunc[]>();
	private queuedPostRenderTasks: Task[] = [];
	private lastPostRenderFlush: number;
	public time = 0;
	public delta = 1;
	public tasks: {
		[id: string]: Task[] | LoopTask[];
	} = {
		read: [],
		update: [],
		render: [],
		postRender: [],
		loop: [],
	};

	public deferredTasks: DeferredTask[] = [];


	constructor() {
		if ( typeof document !== 'undefined' ) {
			document.addEventListener( 'visibilitychange', () => {
				if ( document.hidden ) {
					this.pause();
				} else {
					this.start();
				}
			});
		}
	}


	private flush( list: Task[]): void {
		list.forEach( t => t( this.delta, this.time ) );
		// eslint-disable-next-line no-param-reassign
		list.length = 0;
	}


	private step(): void {
		// check if post tasks failed to run
		if ( this.queuedPostRenderTasks.length !== 0 ) {
			window.clearTimeout( this.lastPostRenderFlush );
			this.flush( this.queuedPostRenderTasks );
		}

		const time = performance.now() - this.timeOffset;
		const delta = Math.min( 8, ( time - this.lastFrameTime ) / 16.667 );

		this.time = time;
		this.delta = delta;

		this.tasks.loop.forEach( ( t: LoopTask ) => {
			const cancelFuncs = t( delta, time );
			if ( cancelFuncs ) this.associatedTasks.set( t, cancelFuncs );
		});

		this.flush( this.tasks.read );
		this.flush( this.tasks.update );
		this.flush( this.tasks.render );

		this.queuedPostRenderTasks = this.tasks.postRender.slice( 0 );
		this.tasks.postRender.length = 0;
		this.lastPostRenderFlush = window.setTimeout(
			() => this.flush( this.queuedPostRenderTasks ),
			0,
		);


		if ( this.deferredTasks.length > 0 ) {
			window.setTimeout( () => {
				if ( this.runDeferred ) {
					const deferredTask = this.deferredTasks.shift();
					if ( deferredTask ) deferredTask.task( delta, time );
				}
			}, 1 );
		}

		this.lastFrameTime = time;
		cancelAnimationFrame( this.nextFrame );
		this.nextFrame = requestAnimationFrame( () => this.step() );
	}


	public cancel( task: Task | LoopTask ): void {
		Object.keys( this.tasks ).forEach( ( key ) => {
			const list = this.tasks[key];
			if ( list.includes( task ) ) {
				list.splice( list.findIndex( t => t === task ), 1 );
			}
		});

		if ( this.associatedTasks.has( task ) ) {
			this.associatedTasks.get( task ).forEach( c => c() );
			this.associatedTasks.delete( task );
		}

		if ( this.queuedPostRenderTasks.includes( task ) ) {
			this.queuedPostRenderTasks.splice(
				this.queuedPostRenderTasks.findIndex( t => t === task ),
				1,
			);
		}
	}


	public suspendDeferred(): void {
		this.runDeferred = false;
	}


	public resumeDeferred(): void {
		this.runDeferred = true;
	}


	public pause(): void {
		if ( this.nextFrame ) {
			this.pauseStart = performance.now();

			cancelAnimationFrame( this.nextFrame );
			this.nextFrame = null;
		}
	}


	public start(): void {
		if ( !this.nextFrame ) {
			this.timeOffset += performance.now() - this.pauseStart;

			this.nextFrame = requestAnimationFrame( () => this.step() );
		}
	}
}
