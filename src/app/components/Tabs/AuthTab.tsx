import { Controller } from "react-hook-form";
import {
  Select,
  SelectItem,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AuthTabProps {
  control: any;
  register: any;
  authType: string;
  errors: any;
}

export default function AuthTab({ control, register, authType, errors }: AuthTabProps) {
  return (
    <div className="space-y-4">
      <Controller
        control={control}
        name="authType"
        render={({ field }) => (
          <div>
            <label className="block mb-1">Auth Type</label>

            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger>
                <SelectValue placeholder="Auth Type" />
              </SelectTrigger>

              <SelectContent>
                {["None", "Bearer", "APIKey"].map((a) => (
                  <SelectItem key={a} value={a}>
                    {a}
                  </SelectItem>
                ))}
              </SelectContent>

            </Select>
          </div>
        )}
      />

      {authType !== "None" && (
        <div>
          <label className="block mb-1">
            {authType === "Bearer" ? "Token" : "API Key"}
          </label>
          <input
            {...register("authValue")}
            placeholder={authType === "Bearer" ? "your_token_here": "api_key_here"}
            type="text"
            className="px-4 py-2 border border-gray-300 rounded-md
             hover:border-orange-700 focus:outline-none focus:border-orange-700"
          />
          {errors.authValue && (
            <p className="text-red-700 text-sm mt-1">{errors.authValue.message}</p>
          )}
        </div>
      )}
    </div>
  );
}
