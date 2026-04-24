import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateEmployeeMutation } from "@/api/employee-api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldError,
} from "@/components/ui/field";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import { ROUTE_LINKS } from "@/constants/route.links";
import { employeeSchema, type EmployeeFormValues } from "../validation";

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
      navigate(ROUTE_LINKS.EMPLOYEE);
    } catch (error) {
      toast.error("Failed to create employee");
    }
  };

  return (
    <div className="w-full">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Employee Information</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <FieldGroup className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:gap-x-8 2xl:gap-y-6">
          <Field className="gap-1">
            <FieldLabel htmlFor="fullName" className="font-medium text-muted-foreground">
              Full Name
            </FieldLabel>
            <Input
              id="fullName"
              placeholder="Full Name"
              className="border"
              {...register("fullName")}
            />
            <FieldError errors={[errors.fullName]} />
          </Field>

          <Field className="gap-1">
            <FieldLabel htmlFor="email" className="font-medium text-muted-foreground">
              Email Address
            </FieldLabel>
            <Input
              id="email"
              type="email"
              placeholder="Email Address"
              className="border"
              {...register("email")}
            />
            <FieldError errors={[errors.email]} />
          </Field>

          <Field className="gap-1">
            <FieldLabel htmlFor="phone" className="font-medium text-muted-foreground">
              Phone Number
            </FieldLabel>
            <Input
              id="phone"
              placeholder="Phone Number"
              className="border"
              {...register("phone")}
            />
            <FieldError errors={[errors.phone]} />
          </Field>

          <Field className="gap-1">
            <FieldLabel htmlFor="department" className="font-medium text-muted-foreground">
              Department
            </FieldLabel>
            <Input
              id="department"
              placeholder="Department"
              className="border"
              {...register("department")}
            />
            <FieldError errors={[errors.department]} />
          </Field>

          <Field className="gap-1">
            <FieldLabel htmlFor="position" className="font-medium text-muted-foreground">
              Position
            </FieldLabel>
            <Input
              id="position"
              placeholder="Position"
              className="border"
              {...register("position")}
            />
            <FieldError errors={[errors.position]} />
          </Field>

          <Field className="gap-1">
            <FieldLabel
              htmlFor="joiningDate"
              className="font-medium text-muted-foreground"
            >
              Joining Date
            </FieldLabel>
            <Input
              id="joiningDate"
              type="date"
              className="border"
              {...register("joiningDate")}
            />
            <FieldError errors={[errors.joiningDate]} />
          </Field>

          <Field className="gap-1">
            <FieldLabel
              htmlFor="basicSalary"
              className="font-medium text-muted-foreground"
            >
              Basic Salary
            </FieldLabel>
            <Input
              id="basicSalary"
              type="number"
              placeholder="Basic Salary"
              className="border"
              {...register("basicSalary", { valueAsNumber: true })}
              min={0}
            />
            <FieldError errors={[errors.basicSalary]} />
          </Field>
        </FieldGroup>

        <div className="flex justify-start gap-4 pt-4">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Employee"}
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={() => navigate(ROUTE_LINKS.EMPLOYEE)}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
