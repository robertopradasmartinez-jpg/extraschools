-- Crear tabla clicks para trackear visualizaciones de actividades
CREATE TABLE IF NOT EXISTS clicks (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
    "activityId" TEXT NOT NULL,
    "userId" TEXT,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "referrer" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "clicks_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES activities(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "clicks_userId_fkey" FOREIGN KEY ("userId") REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE
);

-- Crear índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS "clicks_activityId_idx" ON clicks("activityId");
CREATE INDEX IF NOT EXISTS "clicks_userId_idx" ON clicks("userId");
CREATE INDEX IF NOT EXISTS "clicks_createdAt_idx" ON clicks("createdAt");