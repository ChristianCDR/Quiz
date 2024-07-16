# Quiz
Appli de quiz

--Docker--

cd /docker
docker-compose up

If port 5432 already in use 
# sudo lsof -i :5432
# sudo kill -9 PID

--Back--

symfony server:start

--Front--
verifier que node -v > 18
verifier que java -version > 17

npm install -g react-native-cli

npm install -g react-native

npx react-native init front

telecharger android studio
cd ~/Téléchargements
tar -xzf android-studio-*-linux.tar.gz
sudo mv android-studio /opt/
/opt/android-studio/bin/studio.sh
nano ~/.bashrc
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/tools/bin
export PATH=$PATH:$ANDROID_HOME/platform-tools
source ~/.bashrc
adb --version
cd front
npx react-native run-android 
npx react-native start

