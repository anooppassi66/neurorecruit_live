 "use client"
 
 import { toast } from "react-toastify"
 
 export class ApiError extends Error {
   status: number
   data: any
   constructor(status: number, message: string, data?: any) {
     super(message)
     this.name = "ApiError"
     this.status = status
     this.data = data
   }
 }
 
 type ApiOptions = {
   successMessage?: string
   showSuccess?: boolean
   showError?: boolean
   toastId?: string
 }
 
 export async function apiFetch<T = any>(
   input: RequestInfo | URL,
   init?: RequestInit,
   options: ApiOptions = {}
 ): Promise<T> {
   const res = await fetch(input, init)
   let data: any = null
   try {
     data = await res.json()
   } catch {
     data = null
   }
 
   const method = (init?.method || "GET").toUpperCase()
 
  if (res.ok) {
     const inferredMsg =
       (data && (data.message || data.msg || data.status)) || undefined
     const message = options.successMessage ?? inferredMsg
    const isMutation = method !== "GET"
    const shouldToast =
      (options.showSuccess ?? isMutation) && Boolean(message && message.length > 0)
     if (shouldToast && message) {
       toast.success(String(message), {
         toastId: options.toastId ?? `success:${message}`,
       })
     }
     return data as T
   }
 
   const errMsg =
     (data && (data.message || data.error || data.msg)) ||
     `Error ${res.status}`
   if (options.showError ?? true) {
     toast.error(String(errMsg), {
       toastId: options.toastId ?? `error:${errMsg}`,
     })
   }
   throw new ApiError(res.status, String(errMsg), data)
 }
