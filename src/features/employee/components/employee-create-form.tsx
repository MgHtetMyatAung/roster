import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useCreateEmployeeMutation } from "@/api/employee-api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldError,
} from "@/components/ui/field";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { useNavigate } from "react-router";

const employeeSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(5, "Phone number must be at least 5 characters"),
  department: z.string().min(1, "Department is required"),
  position: z.string().min(1, "Position is required"),
  joiningDate: z.string().min(1, "Joining date is required"),
  basicSalary: z.number().min(0, "Salary must be a positive number"),
});

type EmployeeFormValues = z.infer<typeof employeeSchema>;

export default function EmployeeCreateForm() {
  const [createEmployee, { isLoading }] = useCreateEmployeeMutation();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      department: "",
      position: "",
      joiningDate: new Date().toISOString().split("T")[0],
      basicSalary: 0,
    },
  });

  const onSubmit = async (data: EmployeeFormValues) => {
    try {
      await createEmployee({
        ...data,
        status: "Active",
      }).unwrap();
      toast.success("Employee created successfully");
      navigate("/employee");
    } catch (error) {
      toast.error("Failed to create employee");
    }
  };

  return (
    <div className="w-full ">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Employee Information</h1>
        <div className="flex items-center gap-2 text-primary text-sm font-medium">
          Your Current Ubication <span className="text-lg">🇩🇴</span>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <FieldGroup className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6">
          <Field>
            <FieldLabel htmlFor="fullName" className=" font-semibold">
              Full Name <span className="text-destructive font-bold text-lg">*</span>
            </FieldLabel>
            <Input
              id="fullName"
              placeholder="Full Name"
              className=" border h-12 focus-visible:ring-primary"
              {...register("fullName")}
            />
            <FieldError errors={[errors.fullName]} />
          </Field>

          <Field>
            <FieldLabel htmlFor="email" className=" font-semibold">
              Email Address <span className="text-destructive font-bold text-lg">*</span>
            </FieldLabel>
            <Input
              id="email"
              type="email"
              placeholder="Email Address"
              className=" border h-12 focus-visible:ring-primary"
              {...register("email")}
            />
            <FieldError errors={[errors.email]} />
          </Field>

          <Field>
            <FieldLabel htmlFor="phone" className=" font-semibold">
              Phone Number <span className="text-destructive font-bold text-lg">*</span>
            </FieldLabel>
            <Input
              id="phone"
              placeholder="Phone Number"
              className=" border h-12 focus-visible:ring-primary"
              {...register("phone")}
            />
            <FieldError errors={[errors.phone]} />
          </Field>

          <Field>
            <FieldLabel htmlFor="department" className=" font-semibold">
              Department <span className="text-destructive font-bold text-lg">*</span>
            </FieldLabel>
            <Input
              id="department"
              placeholder="Department"
              className=" border h-12 focus-visible:ring-primary"
              {...register("department")}
            />
            <FieldError errors={[errors.department]} />
          </Field>

          <Field>
            <FieldLabel htmlFor="position" className=" font-semibold">
              Position <span className="text-destructive font-bold text-lg">*</span>
            </FieldLabel>
            <Input
              id="position"
              placeholder="Position"
              className=" border h-12 focus-visible:ring-primary"
              {...register("position")}
            />
            <FieldError errors={[errors.position]} />
          </Field>

          <Field>
            <FieldLabel htmlFor="joiningDate" className=" font-semibold">
              Joining Date <span className="text-destructive font-bold text-lg">*</span>
            </FieldLabel>
            <Input
              id="joiningDate"
              type="date"
              className=" border h-12 focus-visible:ring-primary"
              {...register("joiningDate")}
            />
            <FieldError errors={[errors.joiningDate]} />
          </Field>

          <Field>
            <FieldLabel htmlFor="basicSalary" className=" font-semibold">
              Basic Salary <span className="text-destructive font-bold text-lg">*</span>
            </FieldLabel>
            <Input
              id="basicSalary"
              type="number"
              placeholder="Basic Salary"
              className=" border h-12 focus-visible:ring-primary"
              {...register("basicSalary", { valueAsNumber: true })}
            />
            <FieldError errors={[errors.basicSalary]} />
          </Field>
        </FieldGroup>

        <p className="text-sm text-slate-500 italic">
          In order to process registration provide the following information. All fields marked with an asterisk (*) are required.
        </p>

        <div className="flex justify-start gap-4 pt-4">
          <Button 
            type="submit" 
            disabled={isLoading}
            className="bg-primary hover:bg-primary/90 text-white font-semibold h-12 px-8 rounded-none"
          >
            {isLoading ? "Saving..." : "Save Employee"}
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={() => navigate("/employee")}
            className="h-12"
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
