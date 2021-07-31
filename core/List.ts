import Skill from "./Skill";

export default class List {

    private _name: string = "";
    private userId: string = "";
    private skills: { [k: string]: Skill } = {};

    setName(name: string) {
        if (name.length < 1) throw new Error("invalid name");
        this._name = name;
    }

    get name(): string {
        return this._name;
    }

    addSkill(name: string) {
        const newSkill = Skill.buildSkill(name)

        this.skills[newSkill.getId()] = newSkill;
        return newSkill;
    }

    getSkillsMap() {
        return this.skills;
    }

    getUserId(): string {
        return this.userId;
    }

    getSkillsValuesInArray(): Skill[] {
        return Object.values(this.skills);
    }

    getSkill(id: string): Skill {
        return this.getSkillsMap()[id]
    }

    deleteSkill(id: string): void {
        delete this.getSkillsMap()[id]
    }

    static buildList(name: string, userId: string): List {
        const newList = new List();
        newList.setName(name);
        newList.userId = userId;

        return newList;
    }
}