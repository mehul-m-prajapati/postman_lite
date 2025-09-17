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
  }) => void;
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

  const onSubmit = async (values: RequestFormType) => {
    let headers: Record<string, string> = {};

    if (values.authType === "Bearer" && values.authValue) {
      headers["Authorization"] = `Bearer ${values.authValue}`;
    } else if (values.authType === "APIKey" && values.authValue) {
      headers["x-api-key"] = values.authValue;
    }

    if (values.headers) {
      try {
        const extra = JSON.parse(values.headers);
        Object.assign(headers, extra);
      } catch (e) {
        alert("Headers must be valid JSON");
        return;
      }
    }

    let body: any = undefined;
    if (values.body) {
      try {
        body = JSON.parse(values.body);
      } catch (e) {
        body = values.body;
      }
    }

    const response = await sendRequest({
      url: values.url,
      method: values.method,
      headers,
      body,
    });

    onResponse(response);
  };

  const watchAuthType = watch("authType");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4 border rounded">

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Controller
          control={control}
          name="method"
          render={({ field }) => (

            <div>
              <label className="block mb-1">Method</label>
              <Select value={field.value} onValueChange={field.onChange}>

                <SelectTrigger>
                  <SelectValue placeholder="Select a method" />
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

        <div>
            <label className="block mb-1">URL</label>

            <Input {...register("url")} placeholder="https://api.example.com/data" />

            {errors.url && <p className="text-red-700 text-sm">{errors.url.message}</p>}
        </div>
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

      <AuthInputs register={register} watchAuthType={watchAuthType} />

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

      <Button className="cursor-pointer" type="submit">Send Request</Button>
    </form>
  );
}

export default RequestForm;
