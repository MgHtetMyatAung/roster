import { ROUTE_LINKS } from "@/constants/route.links";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useNavigate } from "react-router";

type DepartmentFormValues = {
  name: string;
  lead: string;
  location: string;
  employees: number;
  openRoles: number;
  budget: string;
  description: string;
};

export default function DepartmentCreateForm() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<DepartmentFormValues>({
    defaultValues: {
      name: "",
      lead: "",
      location: "",
      employees: 0,
      openRoles: 0,
      budget: "",
      description: "",
    },
  });

  const onSubmit = async (_data: DepartmentFormValues) => {
    toast.success("Department created successfully");
    navigate(ROUTE_LINKS.DEPARTMENTS);
  };

  return (
    <div className="w-full">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Department Information</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <FieldGroup className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:gap-x-8 2xl:gap-y-6">
          <Field className="gap-1">
            <FieldLabel htmlFor="name" className="font-medium text-muted-foreground">
              Department Name
            </FieldLabel>
            <Input
              id="name"
              placeholder="Department Name"
              className="border"
              {...register("name", { required: "Department name is required" })}
            />
            <FieldError errors={[errors.name]} />
          </Field>

          <Field className="gap-1">
            <FieldLabel htmlFor="lead" className="font-medium text-muted-foreground">
              Department Lead
            </FieldLabel>
            <Input
              id="lead"
              placeholder="Department Lead"
              className="border"
              {...register("lead", { required: "Department lead is required" })}
            />
            <FieldError errors={[errors.lead]} />
          </Field>

          <Field className="gap-1">
            <FieldLabel
              htmlFor="location"
              className="font-medium text-muted-foreground"
            >
              Location
            </FieldLabel>
            <Input
              id="location"
              placeholder="Location"
              className="border"
              {...register("location", { required: "Location is required" })}
            />
            <FieldError errors={[errors.location]} />
          </Field>

          <Field className="gap-1">
            <FieldLabel
              htmlFor="employees"
              className="font-medium text-muted-foreground"
            >
              Headcount
            </FieldLabel>
            <Input
              id="employees"
              type="number"
              min={0}
              className="border"
              {...register("employees", { valueAsNumber: true })}
            />
            <FieldError errors={[errors.employees]} />
          </Field>

          <Field className="gap-1">
            <FieldLabel
              htmlFor="openRoles"
              className="font-medium text-muted-foreground"
            >
              Open Roles
            </FieldLabel>
            <Input
              id="openRoles"
              type="number"
              min={0}
              className="border"
              {...register("openRoles", { valueAsNumber: true })}
            />
            <FieldError errors={[errors.openRoles]} />
          </Field>

          <Field className="gap-1">
            <FieldLabel htmlFor="budget" className="font-medium text-muted-foreground">
              Budget
            </FieldLabel>
            <Input
              id="budget"
              placeholder="$120,000"
              className="border"
              {...register("budget", { required: "Budget is required" })}
            />
            <FieldError errors={[errors.budget]} />
          </Field>

          <Field className="gap-1 md:col-span-2 lg:col-span-3">
            <FieldLabel
              htmlFor="description"
              className="font-medium text-muted-foreground"
            >
              Description
            </FieldLabel>
            <Textarea
              id="description"
              placeholder="Describe the department scope and responsibilities"
              className="border"
              {...register("description", {
                required: "Description is required",
              })}
            />
            <FieldError errors={[errors.description]} />
          </Field>
        </FieldGroup>

        <div className="flex justify-start gap-4 pt-4">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Department"}
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={() => navigate(ROUTE_LINKS.DEPARTMENTS)}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
