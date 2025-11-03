import { z } from "zod";

export const permissionSchema = z.object({
  code: z.string(),
});
