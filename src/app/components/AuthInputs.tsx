"use client";

import { UseFormRegister } from "react-hook-form";

interface Props {
  register: UseFormRegister<any>;
  watchAuthType: string;
}


function AuthInputs({ register, watchAuthType }: Props) {

  return (
    <div>
      {watchAuthType === "Bearer" && (
        <div>
          <label className="block">Bearer Token</label>
          <input
            {...register("authValue")}
            placeholder="your_token_here"
            className="mt-1 block w-full rounded border p-2"
          />
        </div>
      )}

      {watchAuthType === "APIKey" && (
        <div>
          <label className="block">API Key Value</label>
          <input
            {...register("authValue")}
            placeholder="api_key_here"
            className="mt-1 block w-full rounded border p-2"
          />
        </div>
      )}
    </div>
  )
}

export default AuthInputs
