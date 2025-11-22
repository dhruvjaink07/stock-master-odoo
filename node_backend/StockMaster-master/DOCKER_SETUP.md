# 🐳 Docker Setup Guide

Use Docker Compose to instantly setup PostgreSQL and PgAdmin without installation hassles.

## Prerequisites

- Docker Desktop installed and running
- Docker Compose (included with Docker Desktop)

## Quick Start (Recommended)

### 1. Start Services

```bash
cd StockMaster-master
docker-compose up -d
```

Wait 10 seconds for database to be ready.

### 2. Seed Database

```bash
npm run db:push
npm run seed
```

### 3. Start Application

```bash
npm run dev
```

Done! 🎉

---

## What Gets Created

**PostgreSQL:**
- Database: `stockmaster`
- User: `postgres`
- Password: `postgres`
- Port: `5432`
- Automatic health checks

**PgAdmin:**
- Web URL: http://localhost:5050
- Email: `admin@stockmaster.local`
- Password: `admin`

---

## Useful Commands

### Start Services
```bash
docker-compose up -d
```

### Stop Services
```bash
docker-compose down
```

### Restart Services
```bash
docker-compose restart
```

### View Logs
```bash
# All services
docker-compose logs -f

# Just PostgreSQL
docker-compose logs -f postgres

# Just PgAdmin
docker-compose logs -f pgadmin
```

### Reset Database (Delete All Data)
```bash
docker-compose down -v
docker-compose up -d
npm run db:push
npm run seed
```

### Check Status
```bash
docker-compose ps
```

---

## Access Database

### From Command Line
```bash
docker-compose exec postgres psql -U postgres -d stockmaster
```

Then you're in PostgreSQL shell:
```sql
-- List tables
\dt

-- Query a table
SELECT * FROM products;

-- Exit
\q
```

### From PgAdmin GUI

1. Open: http://localhost:5050
2. Login:
   - Email: `admin@stockmaster.local`
   - Password: `admin`
3. Click "Add New Server"
4. Fill in:
   - **General Tab - Name:** stockmaster
   - **Connection Tab - Host:** postgres
   - **Connection Tab - Username:** postgres
   - **Connection Tab - Password:** postgres
5. Click "Save"
6. Browse tables, run queries, visualize data

---

## Environment Variables

Default `.env` file works with Docker:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/stockmaster"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
JWT_EXPIRES_IN="24h"
PORT=3000
NODE_ENV="development"
```

---

## Production Considerations

For production, modify `docker-compose.yml`:

```yaml
postgres:
  environment:
    POSTGRES_PASSWORD: your-secure-password-here  # Change this!
    POSTGRES_USER: stockmaster                    # Change to non-postgres
```

Then run:
```bash
docker-compose down -v  # Remove old data
docker-compose up -d
```

---

## Troubleshooting

### "Cannot connect to database"
```bash
# Check if containers are running
docker-compose ps

# Check logs
docker-compose logs postgres
```

### "Port 5432 already in use"
Change port in `docker-compose.yml`:
```yaml
ports:
  - "5433:5432"  # Use 5433 instead
```

Then update `.env`:
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5433/stockmaster"
```

### "PgAdmin not accessible"
```bash
docker-compose restart pgadmin
```

### Database seems slow
```bash
docker-compose logs postgres
docker system df  # Check disk usage
```

---

## Docker Commands Cheat Sheet

```bash
# View all StockMaster containers
docker ps | grep stockmaster

# View database logs
docker logs stockmaster-db

# Connect to database directly
docker exec -it stockmaster-db psql -U postgres

# Backup database
docker exec stockmaster-db pg_dump -U postgres stockmaster > backup.sql

# Restore database
docker exec -i stockmaster-db psql -U postgres stockmaster < backup.sql

# Remove everything (careful!)
docker-compose down -v
```

---

## Using Docker Volumes

Data persists in `postgres_data` volume. To backup:

```bash
# List volumes
docker volume ls

# Backup volume
docker run --rm -v stockmaster-db_postgres_data:/data -v $(pwd):/backup \
  alpine tar czf /backup/postgres_backup.tar.gz -C /data .

# Restore volume
docker run --rm -v stockmaster-db_postgres_data:/data -v $(pwd):/backup \
  alpine tar xzf /backup/postgres_backup.tar.gz -C /data
```

---

## Why Use Docker?

✅ No PostgreSQL installation needed
✅ Same environment on Windows/Mac/Linux
✅ Easy to reset and start fresh
✅ Includes PgAdmin for visual database management
✅ Data persists between restarts
✅ Perfect for development

---

## Next Steps

1. ✅ Run `docker-compose up -d`
2. ✅ Run `npm run db:push`
3. ✅ Run `npm run seed`
4. ✅ Run `npm run dev`
5. ✅ Visit http://localhost:3000

---

Questions? See `DATABASE_SETUP.md` for more options!
