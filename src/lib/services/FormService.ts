import { deserialize } from "$app/forms";
import { goto, invalidateAll } from "$app/navigation";
import type { RequestEvent, ServerLoadEvent } from "@sveltejs/kit";
import type { ZodObject } from "zod";
import { z } from "zod";


function formValidate<T extends z.ZodRawShape>(formData: FormData, schema: ZodObject<T>) {
   const formObject = Object.fromEntries(formData);
   const form = schema.safeParse(formObject);

   let errors = {} as { [P in keyof T]: string }; // Создаем объект с неопределенными значениями

   for (const key of Object.keys(schema.shape)) {
      errors[key as keyof T] = ""
   }

   if (form.success) {
      return {
         valid: true, errors,
         data: form.data,
      }
   }

   const fieldErrors = form.error.flatten().fieldErrors as { [P in keyof T]?: string[] };

   errors = Object.keys(fieldErrors)
      .reduce((acc, el) => ({
         [el]: fieldErrors[el]![0],
         ...acc
      }), {}) as { [P in keyof T]: string };

   return {
      valid: false, errors,
      data: formObject as { [P in keyof T]: string },
   }
}

export async function superValidate<T extends z.ZodRawShape>(event: ServerLoadEvent | RequestEvent, schema: ZodObject<T>): Promise<ValidationResult<T>> {
   const constraints = Object.keys(schema.shape).reduce((acc, field) => ({
      ...acc,
      [field]: schema.shape[field]._def.checks,
   }), {}) as { [P in keyof T]: FieldConstraints[] };


   try {
      const validateData = formValidate(await event.request.formData(), schema);
      return {
         ...validateData, constraints
      }
   }
   catch (error) {
      const data = {} as { [P in keyof T]: string }; // Создаем объект с неопределенными значениями

      for (const key of Object.keys(schema.shape)) {
         data[key as keyof T] = ""
      }

      return {
         valid: false, data, constraints, errors: { ...data }
      };
   }

}

export function superForm<T>(form: ValidationResult<T>, callback?: () => void) {
   const z = createZodSchema(form.constraints)

   const enhance = (node: HTMLFormElement) => {
      function handleSubmit(event: SubmitEvent) {
         event.preventDefault();

         const result = formValidate(new FormData(node), z);

         for (let key in result.data) {
            const errorKey = key as keyof typeof result.errors;
            form.errors[errorKey] = result.errors[errorKey];
         }
         
         console.log(result);

         if (!result.valid) {
            Object.keys(result.errors).forEach((key) => {
               const errorKey = key as keyof typeof result.errors;
               form.errors[errorKey] = result.errors[errorKey];
            }); return;
         }

         fetch(event.submitter?.getAttribute('formaction') ?? node.action, {
            method: 'POST',
            body: new FormData(node)
         }).then(async (response) => {
            const data = deserialize(await response.text());

            if (data.type == 'redirect') {
               console.log(data.location)
               goto(data.location);
            }
            if (data.type == 'failure') {
               const errors = data.data as {};


               Object.keys(errors).forEach((key) => {
                  const errorKey = key as keyof typeof errors;
                  form.errors[errorKey] = errors[errorKey];
               });
            }

            if (data.type == 'success' && data?.data?.invalidate){
               invalidateAll()
            }

            callback && callback();
         });
      }
      // Добавление слушателя событий
      node.addEventListener('submit', handleSubmit);

      return {
         destroy() {
            node.removeEventListener('submit', handleSubmit);
         }
      };
   }

   return {
      form: form.data,
      errors: form.errors,
      enhance
   }
}

export function isValidResult<T>(result: ValidationResult<T>): result is ValidationResult<T> & { valid: true, data: T } {
   return result.valid;
}

export interface ValidationResult<T> {
   valid: boolean;
   data: { [P in keyof T]?: string };
   errors: { [P in keyof T]: string }; // предположим, что ошибки - это массивы строк для каждого поля
   constraints: { [P in keyof T]: FieldConstraints[] };
}

interface FieldConstraints {
   kind: string;
   value?: number;
   min?: number;
   max?: number;
   message?: string;
   required?: boolean;
}

interface SchemaConstraints {
   [fieldName: string]: FieldConstraints[];
}

function createZodSchema(constraints: SchemaConstraints) {
   let schema = z.object({})

   Object.entries(constraints).forEach(([fieldName, fieldConstraints]) => {
      let fieldSchema: z.ZodType<any>;

      if (fieldConstraints) {
         if (["min", "max", "email"].some(el => fieldConstraints.map(el => el.kind).includes(el)))
            fieldSchema = z.string();
         else
            fieldSchema = z.number();

         if (fieldSchema instanceof z.ZodString) {
            fieldSchema = applyChecksToStringFieldSchema(fieldSchema, fieldConstraints)
         }
         if (fieldSchema instanceof z.ZodNumber) {
            fieldSchema = applyChecksToNumberFieldSchema(fieldSchema, fieldConstraints)
         }
      } else {
         fieldSchema = z.string().optional();
      }

      schema = schema.merge(z.object({ [fieldName]: fieldSchema }));
   });

   return schema;
}

function applyChecksToStringFieldSchema(fieldSchema: z.ZodString, checks: any[]) {
   return checks.reduce((schema: z.ZodString, check) => {
      switch (check.kind) {
         case 'email':
            return schema.email({ message: check.message });
         case 'min':
            return schema.min(check.value, { message: check.message });
         case 'max':
            return schema.max(check.value, { message: check.message });
         default:
            return schema;
      }
   }, fieldSchema);
}

function applyChecksToNumberFieldSchema(fieldSchema: z.ZodNumber, checks: any[]) {
   return checks.reduce((schema: z.ZodNumber, check) => {
      switch (check.kind) {
         case 'min':
            return schema.min(check.value, { message: check.message });
         case 'max':
            return schema.max(check.value, { message: check.message });
         default:
            return schema;
      }
   }, fieldSchema);
}