"use client";

import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectItem,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { sendRequest } from "@/lib/fetcher";
import AuthInputs from "./AuthInputs";

const RequestSchema = z.object({
  method: z.enum(["GET", "POST", "PUT", "PATCH", "DELETE"]),
  url: z.string().url("Must be a valid URL"),
  headers: z.string().optional(),
  body: z.string().optional(),
  authType: z.enum(["None", "Bearer", "APIKey"]),
  authValue: z.string().optional(),
});

type RequestFormType = z.infer<typeof RequestSchema>;

interface Props {
  onResponse: (resp: {
    status: number;
    data: any;
    headers: any;
    time: number;
  } & Pick<RequestFormType, "method" | "url">) => void
}

function RequestForm({ onResponse }: Props) {
  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RequestFormType>({
    resolver: zodResolver(RequestSchema),
    defaultValues: {
      method: "GET",
      authType: "None",
    },
  });

  const onSubmit = async (formData: RequestFormType) => {
    let headers: Record<string, string> = {};

    if (formData.authType === "Bearer" && formData.authValue) {
      headers["Authorization"] = `Bearer ${formData.authValue}`;
    } else if (formData.authType === "APIKey" && formData.authValue) {
      headers["x-api-key"] = formData.authValue;
    }

    if (formData.headers) {
      try {
        const extra = JSON.parse(formData.headers);
        Object.assign(headers, extra);
      } catch (e) {
        alert("Headers must be valid JSON");
        return;
      }
    }

    let body: any = undefined;
    if (formData.body) {
      try {
        body = JSON.parse(formData.body);
      } catch (e) {
        body = formData.body;
      }
    }

    const response = await sendRequest({
      url: formData.url,
      method: formData.method,
      headers,
      body,
    });

    onResponse({
        ...response,
        method: formData.method,
        url: formData.url,
    });
  };

  const watchAuthType = watch("authType");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4 border rounded">

        {/* --- This is the new inline row --- */}
        <div className="flex items-center space-x-3">
            {/* Method Select */}
            <Controller
                control={control}
                name="method"
                render={({ field }) => (
                    <div className="flex-shrink-0">

                        <Select value={field.value} onValueChange={field.onChange}>
                            <SelectTrigger className="w-24 px-4 py-2 border border-gray-300 rounded-md bg-gray-100 hover:border-orange-500 focus:outline-none focus:border-orange-500">
                            <SelectValue placeholder="Method" />
                            </SelectTrigger>

                            <SelectContent>
                            {["GET", "POST", "PUT", "PATCH", "DELETE"].map((m) => (
                                <SelectItem key={m} value={m}>
                                    {m}
                                </SelectItem>
                            ))}
                            </SelectContent>
                        </Select>

                    </div>
                )}
            />

            {/* URL Input */}
            <div className="flex-grow">
                <Input
                    {...register("url")}
                    placeholder="https://api.example.com/data"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md hover:border-orange-500 focus:outline-none focus:border-orange-500"
                />
                {errors.url && (
                    <p className="text-red-700 text-sm mt-1">{errors.url.message}</p>
                )}
            </div>

            {/* Send Button */}
            <Button
                type="submit"
                className="flex-shrink-0 px-6 py-2 rounded-md font-semibold
                 text-white bg-orange-600 cursor-pointer hover:bg-orange-800"
            >
                Send
            </Button>
        </div>



      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
      </div>

      <AuthInputs register={register} authType={watchAuthType} />

      <div>
        <label className="block mb-1">Headers (JSON)</label>
        <Textarea
            {...register("headers")}
            placeholder='{ "Accept": "application/json", "Custom-Header": "value" }'
            rows={3}
        />
      </div>

      <div>
        <label className="block mb-1">Body (JSON or Raw Text)</label>
        <Textarea
            {...register("body")}
            placeholder='{"key":"value"}'
            rows={5}
        />
      </div>
    </form>
  );
}

export default RequestForm;
