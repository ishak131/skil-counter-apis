import List from "../core/List";


test('create a new list', () => {
    expect(() => List.buildList("", "121")).toThrow("invalid name");
    const list = List.buildList("abc", "121");
    expect(list).toBeInstanceOf(List);
});

test('add a skill to list', () => {
    const list = List.buildList("abc", "121");

    list.addSkill("sample skill");

    expect(list.getSkillsMap()).toBeInstanceOf(Object);
    expect(list.getSkillsValuesInArray().find((skill) => skill.getName() === "sample skill")).toBeDefined();
});

test('change score for a skill', () => {
    const list = List.buildList("abc", "121");
    const newSkill = list.addSkill("sample skill");
    list.getSkill(newSkill.getId()).setScore(3);
    expect(list.getSkill(newSkill.getId()).getScore()).toEqual(3)
});

test('Delete Skill', () => {
    const list = List.buildList("abc", "121");
    const newSkill = list.addSkill("sample skill");
    list.deleteSkill(newSkill.getId());
    expect(list.getSkill(newSkill.getId())).toBeUndefined();
    expect(list.getSkillsValuesInArray().length).toEqual(0);
});