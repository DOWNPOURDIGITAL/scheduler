import Scheduler, { Task } from './lib/Scheduler';


const consume = ( task: Task, list: Task[]): () => void => {
	list.push( task );
	return (): void => {
		if ( list.includes( task ) ) {
			list.splice( list.findIndex( t => t === task ), 1 );
		}
	};
};


const scheduler = new Scheduler();


export const loop = ( task: Task ): () => void => (
	consume( task, scheduler.tasks.loop )
);

export const read = ( task: Task ): () => void => (
	consume( task, scheduler.tasks.read )
);

export const update = ( task: Task ): () => void => (
	consume( task, scheduler.tasks.update )
);

export const render = ( task: Task ): () => void => (
	consume( task, scheduler.tasks.render )
);

export const postRender = ( task: Task ): () => void => (
	consume( task, scheduler.tasks.postRender )
);


	consume( task, scheduler.tasks.defer )
);
export const defer = ( task: Task, priority = 0 ): () => void => {
	const list = scheduler.deferredTasks;
	const deferredTask = {
		task,
		priority,
	};
	list.push( deferredTask );
	list.sort( ( a, b ) => b.priority - a.priority );
	return (): void => {
		if ( list.includes( deferredTask ) ) {
			list.splice( list.findIndex( t => t === deferredTask ), 1 );
		}
	};
};


export default scheduler;
