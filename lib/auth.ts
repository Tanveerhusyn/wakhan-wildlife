import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { z } from "zod"

const credentialsSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
})

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsed = credentialsSchema.safeParse(credentials)
        if (!parsed.success) return null

        const { username, password } = parsed.data

        const adminUsername = process.env.ADMIN_USERNAME
        const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH

        if (!adminUsername || !adminPasswordHash) return null
        if (username !== adminUsername) return null

        // Hash is base64-encoded in env to avoid dotenv $ variable expansion
        const hash = Buffer.from(adminPasswordHash, "base64").toString("utf8")
        const valid = await bcrypt.compare(password, hash)
        if (!valid) return null

        return { id: "admin", name: "Admin", email: "admin@wakhanwildlife.com" }
      },
    }),
  ],
  session: { strategy: "jwt" },
  pages: { signIn: "/admin/login" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.role = "admin"
      return token
    },
    async session({ session, token }) {
      if (token.role) (session.user as { role?: string }).role = token.role as string
      return session
    },
  },
})
