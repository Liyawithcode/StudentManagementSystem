let sections = [
  { id: "1", name: "Section A", room: "Room 101" },
  { id: "2", name: "Section B", room: "Room 102" }
];

export const getSectionsList = async () => {
  return sections;
};

export const addSection = async (name, room) => {
  const newSection = { id: String(sections.length + 1), name, room: room || "N/A" };
  sections.push(newSection);
  return newSection;
};

export const removeSection = async (id) => {
  const index = sections.findIndex(s => s.id === id);
  if (index !== -1) {
    sections.splice(index, 1);
    return true;
  }
  return false;
};
