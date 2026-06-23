let scholarships = [
  { id: "1", name: "Merit Scholarship", amount: 1500, eligibility: "GPA > 3.8", status: "Active" },
  { id: "2", name: "Financial Aid Assistance", amount: 1000, eligibility: "Need-based", status: "Active" }
];

export const getScholarshipsList = async () => {
  return scholarships;
};

export const addScholarship = async (scholarshipData) => {
  const newScholarship = {
    id: String(scholarships.length + 1),
    name: scholarshipData.name,
    amount: scholarshipData.amount || 0,
    eligibility: scholarshipData.eligibility || "Any",
    status: scholarshipData.status || "Active"
  };
  scholarships.push(newScholarship);
  return newScholarship;
};
