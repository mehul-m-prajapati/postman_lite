"use client";

import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectItem,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { sendRequest } from "@/lib/fetcher";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import AuthTab from "./Tabs/AuthTab";
import HeadersTab from "./Tabs/HeadersTab";
import BodyTab from "./Tabs/BodyTab";
import QueryParamsTab from "./Tabs/QueryParamsTab";


const RequestSchema = z.object({
  method: z.enum(["GET", "POST", "PUT", "PATCH", "DELETE"]),
  url: z.string().url("Must be a valid URL"),
  headers: z.string().optional(),
  body: z.string().optional(),
  authType: z.enum(["None", "Bearer", "APIKey"]),
  authValue: z.string().optional(),
  queryParams: z.string().optional(),
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

    // Parse queryParams and append to URL
    let url = formData.url;
    if (formData.queryParams) {
      try {
        const params = JSON.parse(formData.queryParams);
        const searchParams = new URLSearchParams(params);
        url += (url.includes("?") ? "&" : "?") + searchParams.toString();
      } catch (e) {
        alert("Query Params must be valid JSON");
        return;
      }
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
                            <SelectTrigger className="w-24 px-4 py-2 border border-gray-300
                                rounded-md bg-gray-100 hover:border-orange-500
                                focus:outline-none focus:border-orange-500">
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-md
                     hover:border-orange-500 focus:outline-none focus:border-orange-500"
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
            > Send
            </Button>
        </div>

        {/* Tabs for Headers, Body, Auth, Query Params */}
        <Tabs>
            <TabList className="flex space-x-4 border-b mb-4">
                <Tab className="cursor-pointer px-4 py-2 rounded-t hover:bg-gray-200">Auth</Tab>
                <Tab className="cursor-pointer px-4 py-2 rounded-t hover:bg-gray-200">Headers</Tab>
                <Tab className="cursor-pointer px-4 py-2 rounded-t hover:bg-gray-200">Body</Tab>
                <Tab className="cursor-pointer px-4 py-2 rounded-t hover:bg-gray-200">Query Params</Tab>
            </TabList>

            <TabPanel>
                <AuthTab control={control} register={register} authType={watchAuthType} errors={errors} />
            </TabPanel>

            <TabPanel>
                <HeadersTab register={register} errors={errors} />
            </TabPanel>

            <TabPanel>
                <BodyTab register={register} errors={errors} />
            </TabPanel>

            <TabPanel>
                <QueryParamsTab register={register} errors={errors} />
            </TabPanel>
        </Tabs>
    </form>
  );
}

export default RequestForm;
