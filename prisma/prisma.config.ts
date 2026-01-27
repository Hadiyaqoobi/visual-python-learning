import path from 'node:path'
import { defineConfig } from 'prisma/config'

export default defineConfig({
  earlyAccess: true,
  schema: path.join(__dirname, 'schema.prisma'),
  migrate: {
    async resolveAdapter() {
      const { PrismaNeon } = await import('@prisma/adapter-neon')
      const { neonConfig, Pool } = await import('@neondatabase/serverless')
      
      neonConfig.wsProxy = (host) => `${host}:5433/v1`
      neonConfig.useSecureWebSocket = true
      neonConfig.pipelineTLS = false
      neonConfig.pipelineConnect = false
      
      const connectionString = process.env.DATABASE_URL
      const pool = new Pool({ connectionString })
      
      return new PrismaNeon(pool)
    },
  },
})
