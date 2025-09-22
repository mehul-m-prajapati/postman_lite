import { Textarea } from "@/components/ui/textarea";
import { UseFormRegister, FieldErrors } from "react-hook-form";

interface HeadersTabProps {
  register: UseFormRegister<any>;
  errors: any;
}

export default function HeadersTab({ register, errors }: HeadersTabProps) {
  return (
    <div>
      <label className="block mb-1">Headers (JSON)</label>
      <Textarea
        {...register("headers")}
        placeholder='{ "Accept": "application/json", "Custom-Header": "value" }'
        rows={6}
      />
      {errors.headers && (
        <p className="text-red-700 text-sm mt-1">{errors.headers.message}</p>
      )}
    </div>
  );
}
