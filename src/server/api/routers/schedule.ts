import { z } from 'zod'
import { createTRPCRouter, publicProcedure } from '~/server/api/trpc'
import { env } from "~/env";

interface ScheduleRecord {
	timestamp: string;
  subject: string;
  professor: string;
  room: string;
  kind: string;
}

export const scheduleRouter = createTRPCRouter({
    get: publicProcedure
    .input(z.object({ group: z.number(), date: z.number() }))
    .query(async ({ctx, input}) => {
        const resp = await fetch(`${env.RECIPES_API_URL}?g=${input.group}&d=${input.date}`)
        if (resp.ok) return {
            error: await resp.text()
        }
        const data = await resp.json()
        return data as ScheduleRecord[]
    })
})