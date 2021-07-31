const {uuid} = require('uuidv4');

export default class Skill {
    private id: string = "";
    private name: string = "";
    private score = 0;

    getId(): string {
        return this.id
    }

    getName(): string {
        return this.name
    }

    setScore(newScore: number) {
        this.score = newScore
    }

    getScore() {
        return this.score
    }

    public static buildSkill(name: string): Skill {
        const newSkill = new Skill();
        newSkill.id = uuid()
        newSkill.name = name;

        return newSkill
    }
}