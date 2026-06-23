let subjects = [
  { id: "1", code: "MATH101", name: "Algebra I", credits: 4 },
  { id: "2", code: "SCI101", name: "Introductory Physics", credits: 4 }
];

export const getSubjectsList = async () => {
  return subjects;
};

export const addSubject = async (code, name, credits) => {
  const newSubject = { id: String(subjects.length + 1), code, name, credits: credits || 3 };
  subjects.push(newSubject);
  return newSubject;
};

export const removeSubject = async (id) => {
  const index = subjects.findIndex(s => s.id === id);
  if (index !== -1) {
    subjects.splice(index, 1);
    return true;
  }
  return false;
};
