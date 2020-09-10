
export type Task = ( delta: number, time: number ) => void;


export default class Scheduler {
	private lastFrameTime = 0;
	private timeOffset = 0;
	private pauseStart = 0;
	private nextFrame: number;
	private runDeferred = false;
	public time = 0;
	public delta = 1;
	public tasks: {
		[id: string]: Task[];
	} = {
		read: [],
		update: [],
		render: [],
		postRender: [],
		defer: [],
		loop: [],
	};


	constructor() {
		if ( typeof document !== 'undefined' ) {
			document.addEventListener( 'visibilitychange', () => {
				if ( this.nextFrame ) {
					if ( document.hidden ) {
						this.pause();
					} else {
						this.start();
					}
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
		const time = performance.now() - this.timeOffset;
		const delta = Math.min( 8, ( time - this.lastFrameTime ) / 16.667 );

		this.time = time;
		this.delta = delta;

		this.tasks.loop.forEach( t => t( delta, time ) );

		this.flush( this.tasks.read );
		this.flush( this.tasks.update );
		this.flush( this.tasks.render );

		setTimeout( () => this.flush( this.tasks.postRender ), 0 );


		if ( this.runDeferred ) {
			const deferredTask = this.tasks.defer.shift();
			if ( deferredTask ) {
				setTimeout( () => deferredTask( delta, time ), 0 );
			}
		}

		this.lastFrameTime = time;
		this.nextFrame = requestAnimationFrame( () => this.step() );
	}


	public cancel( task: Task ): void {
		Object.keys( this.tasks ).forEach( ( key ) => {
			const list = this.tasks[key];
			if ( list.includes( task ) ) {
				list.splice( list.findIndex( t => t === task ), 1 );
			}
		});
	}


	public suspendDeferred(): void {
		this.runDeferred = false;
	}


	public resumeDeferred(): void {
		this.runDeferred = true;
	}


	public pause(): void {
		this.pauseStart = performance.now();
		if ( this.nextFrame ) {
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
