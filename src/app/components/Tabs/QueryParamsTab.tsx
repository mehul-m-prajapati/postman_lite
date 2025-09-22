import { Textarea } from "@/components/ui/textarea";
import { UseFormRegister, FieldErrors } from "react-hook-form";

interface QueryParamsTabProps {
  register: UseFormRegister<any>;
  errors: any;
}

export default function QueryParamsTab({ register, errors }: QueryParamsTabProps) {
  return (
    <div>
      <label className="block mb-1">Query Params (JSON)</label>
      <Textarea
        {...register("queryParams")}
        placeholder='{ "key1": "value1", "key2": "value2" }'
        rows={4}
      />
      {errors.queryParams && (
        <p className="text-red-700 text-sm mt-1">{errors.queryParams.message}</p>
      )}
    </div>
  );
}
