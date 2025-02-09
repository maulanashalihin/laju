 # Gunakan Node.js LTS sebagai runtime
FROM node:lts

# Set TERM agar tidak error di terminal
ENV TERM=xterm

# Jalankan sebagai root untuk setup awal
USER root

# Install dependensi yang dibutuhkan
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    build-essential

# Copy semua file ke dalam container
COPY --chown=www-data:www-data . .

# Install NPM secara global dan yang dibutuhkan
RUN npm install -g pm2 knex node-gyp

# Install dependensi Node.js
RUN npm cache clean --force
RUN npm install

# Set working directory lebih awal
WORKDIR /app

# Set user yang akan digunakan
USER www-data

# Expose port 5173 dan 5555
EXPOSE 5173 5555

# Jalankan aplikasi menggunakan PM2 (development mode)
CMD [ "npm", "run", "dev", "--", "--host"] ]

# Jalankan aplikasi menggunakan PM2 (production mode)
# CMD [ "pm2-runtime", "start", "./build/server.js" ]