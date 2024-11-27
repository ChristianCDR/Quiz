# Quiz
Appli de quiz

--Docker--

cd docker && docker compose up

If port 5432 already in use 

sudo lsof -i :5432
sudo kill -9 PID

--Back--

cd back && symfony server:start --allow-http --no-tls --allow-all-ip

--Front--

verifier que node -v > 18
verifier que java -version > 17

cd front && npx expo start


