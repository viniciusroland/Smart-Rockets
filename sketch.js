var rockets;
var target;
var population;
var forca;
var popsize = 100;
var lifespan = 150;
var count = 0;

class Rocket {
	constructor(dna) {
		if(dna) {
			this.dna = dna;
		} else {
			this.dna = new DNA()
		}
		this.x = width/2;
		this.y = height - 50;
		this.pos = createVector(width/2, height - 50)
		this.vel = createVector()
		this.acc = createVector()
		this.fitness = 1;
	}
	show() {
		fill(255, 150)
		// this.aplicarForca(this.dna.genes[count])
		this.aplicarForca(this.dna.genes[count])
		this.acc.mult(0.3)
		this.vel.add(this.acc)
		this.pos.add(this.vel)

		rect(this.pos.x, this.pos.y, 15, 15);
		this.acc.mult(0)

		
	}
	aplicarForca(force) {
		this.acc.add(force)
	}
}

class Target {
	constructor() {
		this.x = width/2
		this.y = 30
		this.size = 25;
		this.matingpool = []
	}
	show() {
		fill(255)
		ellipse(this.x, this.y, this.size)
	}
}

class Population {
	constructor() {
		this.rockets = []
		for (var i = 0; i < popsize; i++) {
			this.rockets[i] = new Rocket();
		}
	}
	run() {
		for(var i = 0; i < popsize; i++) {
			this.rockets[i].show()

		}
	}

	avaliar() {
		for(var i = 0; i < popsize; i++) {
			let d = dist(this.rockets[i].pos.x, this.rockets[i].pos.y, target.x, target.y)
			this.rockets[i].fitness = map(d, 0, width, width, 0)
		}
		for(var i = 0; i < popsize; i++) {
			let d = dist(this.rockets[i].pos.x, this.rockets[i].pos.y, target.x, target.y)
			if(d < 50) {
				this.rockets[i].pos.x = target.x
				this.rockets[i].pos.y = target.y
				this.rockets[i].fitness *= 10
			}
		}
		var maxfit = this.rockets[0].fitness;
		for(var i = 1; i < popsize; i++) {
			if(this.rockets[i].fitness > maxfit) {
				maxfit = this.rockets[i].fitness
			}
		}
		// for(var i = 0; i < popsize; i++) {
		// 	this.rockets[i].fitness /= maxfit;
		// }
		console.error(maxfit)
	}

	selecao() {
		this.matingpool = []
		for(var i = 0; i < popsize; i++) {
			let n = Math.floor(this.rockets[i].fitness * 10)
			for(var j = 0; j < n; j++) {
				this.matingpool.push(this.rockets[i])
			}
		}
		var newrockets = []
		for(var i = 0; i < this.rockets.length; i++){
			let indexA = Math.floor(random(0, this.matingpool.length))
			let indexB = Math.floor(random(0, this.matingpool.length))
			let parentA = this.matingpool[indexA].dna
			let parentB = this.matingpool[indexB].dna
			let child = parentB.crossover(parentA)
			newrockets[i] = new Rocket(child)
		}
		this.rockets = newrockets
		
	}
}

class DNA {
	constructor(genes) {
		if(genes) {
			this.genes = genes;
		} else {
			this.genes = []
			for(var i = 0; i < lifespan; i++) {
				this.genes[i] = p5.Vector.random2D()
			}
		}
	}

	crossover(parent) {
		let newgenes = []
		let mid = Math.floor(random(0, lifespan))
		for(var i = 0; i < popsize; i++) {
			if(i < mid) {
				newgenes[i] = this.genes[i]
			} else {
				newgenes[i] = parent.genes[i]
			}
		}


		return new DNA(newgenes)
	}
}


function setup(){
	createCanvas(700, 500)
	target = new Target();
	// rockets = new Rockets(width/2, height - 50);
	// forca = createVector(0, -1)
	population = new Population();

}
function draw(){
	if(count == lifespan) {
		population.avaliar();
		population.selecao();
		count = 0;
	}
	count++
	background(51)
	target.show()
	population.run();

}