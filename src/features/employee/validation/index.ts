import z from "zod";

export const employeeSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(5, "Phone number must be at least 5 characters"),
  department: z.string().min(1, "Department is required"),
  position: z.string().min(1, "Position is required"),
  joiningDate: z.string().min(1, "Joining date is required"),
  basicSalary: z.number().min(1, "Salary must be a positive number"),
});

export type EmployeeFormValues = z.infer<typeof employeeSchema>;
