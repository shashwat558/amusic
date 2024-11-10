import { z } from "zod";

export const CreateStreamSchema = z.object({
    creatorId: z.string(),
    //TODO: Find a way to validat youtube and spotify url
    url: z.string().url() 
})