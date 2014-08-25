sed -i '/script src=/d' index.html
sed -i '/<head>/a <script src="js/incraftmental.js"></script>' index.html
cd js
rm incraftmental.js
cat *.js >> incraftmental.js
uglifyjs incraftmental.js -e -m -c -o incraftmental.js