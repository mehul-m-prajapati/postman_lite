import { Textarea } from "@/components/ui/textarea";
import { UseFormRegister } from "react-hook-form";

interface BodyTabProps {
  register: UseFormRegister<any>;
  errors: any;
}

export default function BodyTab({ register, errors }: BodyTabProps) {
  return (
    <div>
      <label className="block mb-1">Body (JSON or Raw Text)</label>
      <Textarea
        {...register("body")}
        placeholder='{"key":"value"}'
        rows={8}
      />
      {errors.body && (
        <p className="text-red-700 text-sm mt-1">{errors.body.message}</p>
      )}
    </div>
  );
}
