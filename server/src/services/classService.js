let classes = [
  { id: "1", name: "Class 10", advisor: "Mr. John Doe" },
  { id: "2", name: "Class 11", advisor: "Ms. Sarah Smith" }
];

export const getClassesList = async () => {
  return classes;
};

export const addClass = async (name, advisor) => {
  const newClass = { id: String(classes.length + 1), name, advisor: advisor || "None" };
  classes.push(newClass);
  return newClass;
};

export const removeClass = async (id) => {
  const index = classes.findIndex(c => c.id === id);
  if (index !== -1) {
    classes.splice(index, 1);
    return true;
  }
  return false;
};
