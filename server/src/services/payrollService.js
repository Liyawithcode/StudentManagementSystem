import { Faculty } from "../model/faculty.model.js";

/**
 * Fetch total payroll summary (monthly outlay of all faculty/staff salaries).
 */
export const getPayrollSummary = async () => {
  const faculties = await Faculty.find();
  const totalSalaries = faculties.reduce((acc, f) => acc + (f.salary || 0), 0);

  return {
    totalEmployees: faculties.length,
    monthlyPayrollOutflow: totalSalaries,
    currency: "USD"
  };
};
