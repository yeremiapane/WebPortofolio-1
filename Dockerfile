# Gunakan base image Go
FROM golang:1.23.1-alpine AS builder
# Set environment agar biner Go cocok di Alpine
ENV CGO_ENABLED=0 GOOS=linux GOARCH=amd64

# Set working directory di dalam container
WORKDIR /app

# Copy semua file proyek ke dalam container
COPY Backend .

RUN go clean -cache -modcache && \
    go mod download && \
    go build -o web_portofolio main.go


# Download dependencies
RUN go mod tidy

# Build binary aplikasi
RUN go build -o web_portofolio main.go

# Gunakan base image minimal untuk runtime
FROM debian:bullseye-slim

# Install dependency minimal (jika diperlukan)
RUN apt-get update && apt-get install -y \
    ca-certificates && \
    rm -rf /var/lib/apt/lists/*

# Set working directory untuk runtime
WORKDIR /app


# Copy binary hasil build
COPY --from=builder /app/web_portofolio /app/

# Copy folder Frontend dan uploads ke dalam container
COPY --from=builder /app/Frontend /app/Frontend
COPY --from=builder /app/uploads /app/uploads

# Set environment variable untuk runtime
ENV PORT=8080
EXPOSE 8080

# Salin file .env ke dalam container
COPY Backend/.env /app/.env

# Jalankan aplikasi
CMD ["./web_portofolio"]
