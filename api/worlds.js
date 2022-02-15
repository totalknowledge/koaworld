const Router = require('koa-router');

// Prefix all routes with: /api/worlds
const router = new Router({
	prefix: '/api/worlds'
});

let worlds = [
	{ id: 101, name: 'Earth', desc:""},
	{ id: 102, name: 'Mars', desc:""},
	{ id: 103, name: 'Venus', desc:""},
	{ id: 104, name: 'Jupiter', desc:""}
];

// Helper functions
const create = async (ctx, next) => {
	// Check if any of the data field not empty
	if (
		!ctx.request.body.name
	) {
		ctx.response.status = 400;
		ctx.body = 'Bad Request!';
	} else {
		let newWorld = {
			id: Math.max(...worlds.map(world=>world.id))+1,
			name: ctx.request.body.name,
			desc: ctx.request.body.desc || ""
		};
		worlds.push(newWorld);
		ctx.response.status = 201;
		ctx.body = newWorld;
	}
	next();
}

const update = async (ctx, next) => {
	// Check if any of the data field not empty
	const indexOfWorld = worlds.findIndex(
		(world)=> {
			if(world.id == ctx.params.id){
				return true;
			} else {
				return false;
			}
		}
	);
	if(indexOfWorld) {
		worlds[indexOfWorld] = {
			...worlds[indexOfWorld],
			...ctx.request.body
		};
		ctx.response.status = 201;
		ctx.body = worlds[indexOfWorld];
	} else {
		ctx.response.status = 404;
		ctx.body = 'World Not Found';
	}
	next();
}

// Routes
router.get('/', (ctx, next) => {
	ctx.body = worlds;
	next();
});

router.post('/', (ctx, next)=>create(ctx, next));

router.put('/', (ctx, next)=>create(ctx, next));

router.get('/:id', (ctx, next) => {
	let getCurrentWorld = worlds.filter(function(world) {
		if (world.id == ctx.params.id) {
			return true;
		}
	});

	if (getCurrentWorld.length) {
		ctx.body = getCurrentWorld[0];
	} else {
		ctx.response.status = 404;
		ctx.body = 'World Not Found';
	}
	next();
});

router.patch('/:id', (ctx, next)=>update(ctx, next));

router.put('/:id', (ctx, next)=>{
	if (
		!ctx.request.body.name
	) {
		ctx.response.status = 400;
		ctx.body = 'Bad Request!';
	} else {
		update(ctx, next)
	}
});

router.delete('/:id', (ctx, next) => {
	let getRemainingWorlds = worlds.filter(function(world) {
		if (world.id != ctx.params.id) {
			return true;
		}
	});
	ctx.body = getRemainingWorlds;
	worlds = getRemainingWorlds;
	next();
});

module.exports = router;