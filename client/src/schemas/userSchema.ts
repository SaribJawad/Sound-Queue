import z from "zod";

const objectIdRegex = /^[a-f\d]{24}$/i;

export const UserSchema = z.object({
  _id: z.string().regex(objectIdRegex, "Invalid MongoDB ObjectID"),
  googleId: z.string(),
  name: z.string(),
  email: z.string().email(),
  avatar: z.string(),
  streams: z.array(z.string().optional()),
  isAlive: z.boolean(),
});
